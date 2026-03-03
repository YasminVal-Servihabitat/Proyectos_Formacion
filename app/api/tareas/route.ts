import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { Redis } from "@upstash/redis";
import { migracion } from "@/lib/migracion";

const redis = Redis.fromEnv();


async function obtenerUsuarioId() {
  const session = await getServerSession(authOptions);
  console.log('sesion ', JSON.stringify(session));
  if (!session?.user?.id) return null;
  return session.user.id;
}

export async function POST(request: Request) {
  try {
    await migracion();
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { texto } = await request.json();
    if (!texto || texto.trim() === "") {
      return NextResponse.json({ error: "Tarea vacía!" }, { status: 400 });
    }

    const tascaIds = await redis.get(`user:${userId}:tascas`) as string[] || [];
    const nuevoId = `t${tascaIds.length + 1}`;
    
    await redis.set(`tasca:${nuevoId}`, JSON.stringify({
      id: nuevoId,
      user_id: userId,
      titulo: texto.trim(),
      descripcion: texto.trim(),
      estado: "pendiente",
    }));

    tascaIds.push(nuevoId);
    await redis.set(`user:${userId}:tascas`, JSON.stringify(tascaIds));

    return NextResponse.json({ success: true, tarea: { id: nuevoId, titulo: texto.trim(), descripcion: texto.trim(), estado: "pendiente" } });
  } catch (error) {
    console.error('Error en POST:', error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await migracion();
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const tascaIds = await redis.get(`user:${userId}:tascas`) as string[] || [];
    const tareas = [];
    
    for (const tascaId of tascaIds) {
      const tarea = await redis.get(`tasca:${tascaId}`);
      if (tarea) tareas.push(tarea);
    }
    
    return NextResponse.json(tareas);
  } catch (error) {
    console.error('Error en GET:', error);
    return NextResponse.json({ error: "Error al leer tareas" }, { status: 500 });
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
      await redis.set(`tasca:${id}`, JSON.stringify(tarea));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await request.json();
    
    await redis.del(`tasca:${id}`);
    
    const tascaIds = await redis.get(`user:${userId}:tascas`) as string[] || [];
    const nuevosIds = tascaIds.filter(tascaId => tascaId !== id);
    await redis.set(`user:${userId}:tascas`, JSON.stringify(nuevosIds));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
