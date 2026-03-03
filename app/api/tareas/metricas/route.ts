import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();


interface Tarea {
  id: Number;
  texto: String;
  estado: string;
}
async function obtenerUsuarioId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session.user.id;
}
export async function GET() {
  try {

    const userId = await obtenerUsuarioId();
    
    if (!userId || userId ==null) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }else{
      const tascaIds = await redis.get(`user:${userId}:tascas`) as string[] || [];
      const tareas = [];
      
      for (const tascaId of tascaIds) {
        const tarea = await redis.get(`tasca:${tascaId}`);
        if (tarea) tareas.push(tarea);
      }
      
      const completadas = tareas.filter((tarea: any) => tarea.estado === "completada").length;
      const enProceso = tareas.filter((tarea: any) => tarea.estado === "enProceso").length;
      const pendientes = tareas.filter((tarea: any) => tarea.estado === "pendiente").length;
      const ultimaTarea = tareas[tareas.length - 1] || null;
      const total = tareas.length;
      return NextResponse.json({
        total,
        completadas,
        enProceso,
        pendientes,
        ultimaTarea
      });
    }
   
  } catch (error) {
    return NextResponse.json(
      { error: "Error al leer tareas" },
      { status: 500 }
    );
  }
}