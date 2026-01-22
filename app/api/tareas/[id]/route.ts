import { NextResponse } from "next/server";
import fs from "fs";

const fe = require("fs");
const Archivo = "userTareas.json";

function leerDatos() {
  let leer = fs.readFileSync(Archivo, "utf8");
  let datos = JSON.parse(leer);
  return datos;
}
function escribirTareas(datos: any) {
  fs.writeFileSync(Archivo, JSON.stringify(datos));
}


export async function GET(request: any, { params }: any) {
  const { id } = await params;
  const datos = leerDatos();
  

  let tarea = null;
  for (const userId in datos.usuarios) {
    tarea = datos.usuarios[userId].tareas.find((t: any) => t.id == Number(id));
    if (tarea) break;
  }

  if (!tarea) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }
  return NextResponse.json(tarea);
}



export async function PUT(request: Request) {
  try {
    const { id, estado, texto } = await request.json();
    const datos = leerDatos();
    
    // Buscar y actualizar la tarea en todos los usuarios
    let tareaEncontrada = false;
    for (const userId in datos.usuarios) {
      const nuevasTareas = datos.usuarios[userId].tareas.map((tarea: any) => {
        if (tarea.id === id) {
          tareaEncontrada = true;
          const tareaActualizada = { ...tarea };
          if (estado !== undefined) tareaActualizada.estado = estado;
          if (texto !== undefined) tareaActualizada.texto = texto;
          return tareaActualizada;
        }
        return tarea;
      });
      datos.usuarios[userId].tareas = nuevasTareas;
    }
    
    if (!tareaEncontrada) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
    }
    
    escribirTareas(datos);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
