"use client";
import { redirect } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";

export default function GestorTareas() {
  const [tareas, setTareas] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [filtro, setFiltro] = useState("todas");
  const [editandoTarea, setEditandotarea] = useState<number | undefined>(
    undefined
  );

  useEffect(() => {
    obtenerTareas();
  }, []);

  function obtenerTareas() {
    fetch("/api/tareas")
      .then(function (datosServidor) {
        return datosServidor.json();
      })
      .then(function (datos) {
        setTareas(datos);
      });
  }

  function añadirTarea(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim()) {
      fetch("/api/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto: input.trim() }),
      }).then(() => {
        obtenerTareas();
        setInput("");
      });
    }
  }

  function eliminarTarea(id: number) {
    fetch("/api/tareas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });

    const nuevasTareas = tareas.filter((tarea) => tarea.id !== id);
    setTareas(nuevasTareas);
  }

  function ponerEstado(id: number, estado: string) {
    fetch("/api/tareas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, estado: estado }),
    });
    const nuevasTareas: any[] = [];
    tareas.map((tarea: any) => {
      tarea.id === id
        ? nuevasTareas.push({ ...tarea, estado: estado })
        : nuevasTareas.push(tarea);
    });
    setTareas(nuevasTareas);
  }

  function iniciarEdicion(id: number, texto: string) {
    setEditandotarea(id);
    setInput(texto);
  }

  function guardarEdicion() {
    if (input.trim() && editandoTarea) {
      fetch("/api/tareas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editandoTarea, texto: input.trim() }),
      });

      const nuevasTareas = tareas.map((tarea) =>
        tarea.id === editandoTarea ? { ...tarea, texto: input.trim() } : tarea
      );
      setTareas(nuevasTareas);
      setInput("");
      setEditandotarea(undefined);
    }
  }

  function cancelarEdicion() {
    setInput("");
    setEditandotarea(undefined);
  }

  

  return (
    <>
      <form onSubmit={añadirTarea} className="flex justify-end gap-2">
        <input
          onChange={(e) => setInput(e.target.value)}
          className="bg-red-500/10 rounded-md border-red-600 border-2 w-130 mt-10 font-serif"
          type="text"
          value={input}
          placeholder={
            editandoTarea
              ? "Editar tarea..."
              : "Introduce la tarea que quieras añadir a la lista........"
          }
        />
        {editandoTarea ? (
          <div className="flex gap-2 mt-10">
            <button
              type="button"
              onClick={guardarEdicion}
              className="bg-green-400 rounded-md w-28 h-8 border-2"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={cancelarEdicion}
              className="bg-red-400 rounded-md w-28 h-8 border-2"
            >
              X
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="bg-gray-400 rounded-md w-28 h-8 border-2 border-blacks mt-10"
          >
            +
          </button>
        )}
      </form>

      <label htmlFor="estado">Filtrar por:</label>
      <select
        name="estado"
        id="estado"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      >
        <option className="dark:text-black" value="todas">Todas</option>
        <option className="dark:text-black" value="completada">Completada</option>
        <option className="dark:text-black" value="enProceso">En Proceso</option>
        <option className="dark:text-black" value="pendiente">Pendiente</option>
      </select>

      <div>
        <h2 className="text-2xl text-center">
          <strong>Lista de Tareas</strong>
        </h2>
        <h2>
          <strong>
            -----------------------------------------------------------------------------------------------
          </strong>
        </h2>
        {Array.isArray(tareas) &&
          tareas
            .filter(function (tarea) {
              if (filtro === "todas") {
                return true;
              } else {
                return tarea.estado === filtro;
              }
            })
            .map(function (tarea) {
              let colorTarea = "";
              if (tarea.estado === "completada") {
                colorTarea = "text-green-500";
              }
              if (tarea.estado === "enProceso") {
                colorTarea = "text-orange-500";
              }
              if (tarea.estado === "pendiente") {
                colorTarea = "text-red-500";
              }

              return (
                <div
                  key={tarea.id}
                  className={`${colorTarea} flex justify-between items-center`}
                >
                  <span>{tarea.id}. {tarea.texto}</span>
                  <div className="flex gap-2">
                    {tarea.estado !== "completada" ? (
                      <button
                        onClick={() => ponerEstado(tarea.id, "completada")}
                        type="button"
                        className="text-green-500 hover:text-green-700 font-bold"
                      >
                        ✓
                      </button>
                    ) : null}
                    <button
                      onClick={() => eliminarTarea(tarea.id)}
                      type="button"
                      className="text-red-500 hover:text-red-700 font-bold"
                    >
                      ×
                    </button>
                    <button
                      onClick={() => iniciarEdicion(tarea.id, tarea.texto)}
                      className="text-blue-500 hover:text-blue-700 font-bold"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => ponerEstado(tarea.id, "enProceso")}
                      className="text-blue-500 hover:text-blue-700 font-bold"
                    >
                      Iniciar
                    </button>
                    <Link href={`/tascas/${tarea.id}`}>
                    <button
                      onClick={()=>(tarea.id)}
                      className="dark:text-white text-gray-500 hover:text-gray-700 font-bold dark:hover:text-red-300"
                    >
                      Detalles
                    </button>
                    </Link>
                  </div>
                </div>
              );
            })}
      </div>
    </>
  );
}
