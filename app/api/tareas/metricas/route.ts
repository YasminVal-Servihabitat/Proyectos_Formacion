import { NextResponse } from "next/server";
import fs from "fs";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

const Archivo = "userTareas.json";

function leerDatos() {
  let leer = fs.readFileSync(Archivo, "utf8");
  let datos = JSON.parse(leer);
  return datos;
}

interface Tarea {
  id: Number;
  texto: String;
  estado: string;
}
async function obtenerUsuarioId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  
  const datos = leerDatos();
  for (let id in datos.usuarios) {
    if (datos.usuarios[id].email === session.user.email) {
      return id;
    }
  }
  return null;
}
export async function GET() {
  try {

    const userId = await obtenerUsuarioId();
    
    if (!userId || userId ==null) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }else{
const userIdInt=parseInt(userId);
      const datos = leerDatos();
      const tareasUsuario = datos.usuarios[userIdInt]?.tareas || [];
      
      const completadas = tareasUsuario.filter((tarea: Tarea) => tarea.estado === "completada").length;
      const enProceso = tareasUsuario.filter((tarea: Tarea) => tarea.estado === "enProceso").length;
      const pendientes = tareasUsuario.filter((tarea: Tarea) => tarea.estado === "pendiente").length;
      const ultimaTarea = tareasUsuario[tareasUsuario.length - 1] || null;
      const total = tareasUsuario.length;
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