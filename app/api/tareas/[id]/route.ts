import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

async function obtenerUsuarioId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return session.user.id;
}



export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    console.log('Buscando tarea con ID:', id);

    const tarea = await redis.get(`tasca:${id}`) as any;
    
    console.log('Tarea encontrada:', tarea);
    
    if (!tarea || tarea.user_id !== userId) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }
    return NextResponse.json(tarea);
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}



export async function PUT(request: Request) {
  try {
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, estado, texto } = await request.json();
    const tarea = await redis.get(`tasca:${id}`) as any;

    if (tarea && tarea.user_id === userId) {
      if (estado !== undefined) tarea.estado = estado;
      if (texto !== undefined) {
        tarea.titulo = texto;
        tarea.descripcion = texto;
      }
      await redis.set(`tasca:${id}`, tarea);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}



