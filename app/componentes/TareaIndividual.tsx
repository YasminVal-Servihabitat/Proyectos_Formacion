"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TareaIndividual({ tareas }: { tareas: { id: number } }) {
  const [tarea, setTarea] = useState<any>();
  const [editando, setEditando] = useState(false);
  const [textoEdicion, setTextoEdicion] = useState("");
  const [mostrarSelect, setMostrarSelect] = useState(false);

  async function cargarTarea() {
    const respuesta = await fetch("/api/tareas/" + tareas.id);
    const datos = await respuesta.json();
    setTarea(datos);
  }

  function iniciarEdicion(id: number, texto: string) {
    setEditando(true);
    setTextoEdicion(texto);
  }

  async function guardarEdicion() {
    if (textoEdicion.trim()) {
      await fetch("/api/tareas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: tarea.id, texto: textoEdicion.trim() }),
      });

      setTarea({ ...tarea, texto: textoEdicion.trim() });
      setEditando(false);
      setTextoEdicion("");
    }
  }
  function cancelarEdicion() {
    setEditando(false);
    setTextoEdicion("");
  }

  async function eliminarTarea(id: number) {
    await fetch("/api/tareas", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id }),
    });
    window.location.href = "/tascas";
  }

  function cambiarEstado(id: number, estado: string) {
    fetch("/api/tareas", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: id, estado: estado }),
    });
    cargarTarea();
  }

  useEffect(() => {
    cargarTarea();
  }, []);

  if (!tarea) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <br />
      <p className="text-2xl">
        <strong>ID: </strong>
        {tarea.id}
      </p>
      <br />
      <p className="text-2xl">
        <strong>Descripción:</strong> {tarea.texto}
      </p>
      <br />
      <p className="text-2xl">
        <strong>Estado:</strong> {tarea.estado}
      </p>
      {editando ? (
        <div>
          <input
            value={textoEdicion}
            onChange={(e) => setTextoEdicion(e.target.value)}
            className="border rounded px-2 py-1"
          />
          <button
            onClick={guardarEdicion}
            className="bg-green-500 text-white px-2 py-1 rounded ml-2"
          >
            Guardar
          </button>
          <button
            onClick={cancelarEdicion}
            className="bg-red-500 text-white px-2 py-1 rounded ml-2"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => iniciarEdicion(tarea.id, tarea.texto)}
            className="text-blue-500 hover:text-blue-700 font-bold"
          >
            Editar
          </button>
          <button
            onClick={() => {
              if (confirm("¿Estás seguro de que deseas eliminar esta tarea?")) {
                eliminarTarea(tarea.id);
              }
            }}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            Eliminar
          </button>
          <button
            onClick={() => setMostrarSelect(!mostrarSelect)}
            className="text-yellow-500 hover:text-yellow-700 font-bold ml-2"
          >
            Cambiar Estado
          </button>

          {mostrarSelect && (
            <select
              name="estado"
              id="estado"
              value={tarea.estado}
              onChange={(e) => {
                cambiarEstado(tarea.id, e.target.value);
                setMostrarSelect(false);
              }}
              className="ml-2 border rounded px-2 py-1"
            >
              <option value="completada">Completada</option>
              <option value="enProceso">En Proceso</option>
              <option value="pendiente">Pendiente</option>
            </select>
          )}
        </div>
      )}

      <br />
      <Link href="/tascas">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Ver Todas
        </button>
      </Link>
    </div>
  );
}
