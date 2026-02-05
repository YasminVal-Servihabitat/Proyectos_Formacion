import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { put, list } from "@vercel/blob";
const archivo = "userTareas.json";

async function leerDatos() {
  try {
    const { blobs } = await list({ prefix: archivo });
    if (blobs.length === 0) {
      return { usuarios: {} };
    }
    const respuesta = await fetch(blobs[0].downloadUrl);
     // Te descarga el contenido
    const datos = await respuesta.json();
    return datos;
  } catch {
    return { usuarios: {} };
  }
}

async function  escribirTareas(datos: any) {
  const blob = await put(archivo, JSON.stringify(datos), {
    access: "public",
    allowOverwrite: true
  });
}

async function obtenerUsuarioId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const datos = await leerDatos();
  for (let id in datos.usuarios) {
    if (datos.usuarios[id].email === session.user.email) {
      return id;
    }
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { texto } = await request.json();
    if (!texto || texto.trim() === "") {
      return NextResponse.json({ error: "Tarea vacía!" }, { status: 400 });
    }

    const datos = await leerDatos();
    if (!datos.usuarios[userId]) {
      datos.usuarios[userId] = { tareas: [] };
    }

    const tareasUsuario = datos.usuarios[userId].tareas;
    const nuevoId =
      tareasUsuario.length > 0
        ? Math.max(...tareasUsuario.map((t: any) => t.id)) + 1
        : 1;
    const nuevaTarea = {
      id: nuevoId,
      texto: texto.trim(),
      estado: "pendiente",
    };

    datos.usuarios[userId].tareas.push(nuevaTarea);
    await escribirTareas(datos);

    return NextResponse.json({ success: true, tarea: nuevaTarea });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const datos = await leerDatos();
    const tareasUsuario = datos.usuarios[userId]?.tareas || [];
    return NextResponse.json(tareasUsuario);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al leer tareas" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, estado, texto } = await request.json();
    const datos = await leerDatos();

    if (!datos.usuarios[userId]) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const nuevasTareas = datos.usuarios[userId].tareas.map((tarea: any) => {
      if (tarea.id === id) {
        const tareaActualizada = { ...tarea };
        if (estado !== undefined) tareaActualizada.estado = estado;
        if (texto !== undefined) tareaActualizada.texto = texto;
        return tareaActualizada;
      }
      return tarea;
    });

    datos.usuarios[userId].tareas = nuevasTareas;
    await escribirTareas(datos);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await obtenerUsuarioId();
    if (!userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await request.json();
    const datos = await leerDatos();

    if (!datos.usuarios[userId]) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    const nuevasTareas = datos.usuarios[userId].tareas.filter(
      (tarea: any) => tarea.id !== id
    );
    datos.usuarios[userId].tareas = nuevasTareas;
    await escribirTareas(datos);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
