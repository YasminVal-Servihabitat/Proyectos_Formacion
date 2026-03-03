import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

export const redis = Redis.fromEnv();

function leerArchivo() {
  const archivo = fs.readFileSync(
    path.join(process.cwd(), "userTareas.json"),
    "utf-8"
  );
  return JSON.parse(archivo);
}

export async function migracion() {
  const migrado = await redis.get("migrado");
  if (migrado) {
    console.log('Ya migrado, saltando...');
    return;
  }

  console.log('Iniciando migración...');
  const datos = leerArchivo();
  
  for (const [userId, usuario] of Object.entries(datos.usuarios) as [string, any][]) {
    // Guardar usuario
    await redis.set(`user:${userId}`, JSON.stringify({
      id: userId,
      nombre: usuario.name,
      email: usuario.email,
      password: usuario.password,
      role: "user",
    }));

    const taskIds: string[] = [];
    
   
    if (Array.isArray(usuario.tareas)) {
      for (const tarea of usuario.tareas) {
        const taskId = `t${tarea.id}`;
        taskIds.push(taskId);
        
        await redis.set(`tasca:${taskId}`, JSON.stringify({
          id: taskId,
          user_id: userId,
          titulo: tarea.texto,
          descripcion: tarea.texto,
          estado: tarea.estado,
        }));
      }
    }
    
    // Guardar lista de IDs de tareas del usuario
    await redis.set(`user:${userId}:tascas`, JSON.stringify(taskIds));
  }
  
  await redis.set("migrado", "true");
  console.log("Migración completada");
}
