"use client";
import { useState, useEffect } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Tarea {
  texto: string;
}

interface Metricas {
  total: number;
  completadas: number;
  enProceso: number;
  pendientes: number;
  ultimaTarea: Tarea | null;
}


export default function GestorDashboard() {
  const [metricas, setMetricas] = useState<Metricas>({ total: 0, completadas: 0, enProceso: 0, pendientes: 0, ultimaTarea: null });
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  async function cargarMetricas() {
    const respuesta = await fetch("/api/tareas/metricas");
    const datos = await respuesta.json();
    setMetricas(datos);
  }

  useEffect(() => {
    cargarMetricas();
  }, []);


  

  if (status === "loading") {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="shadow-2xl bg-zinc-50 font-sans dark:bg-gray-900 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard - {session.user?.name}</h1>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-full h-32 text-center mb-6 rounded-lg flex items-center justify-center shadow-lg">
        <h2 className="text-3xl font-bold text-white">Total Tareas: {metricas.total}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-6 rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold mb-2 text-white">Completadas</h3>
          <h2 className="text-3xl font-bold text-white">{metricas.completadas}</h2>
        </div>
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold mb-2 text-white">En Proceso</h3>
          <h2 className="text-3xl font-bold text-white">{metricas.enProceso}</h2>
        </div>
        <div className="bg-gradient-to-br from-red-400 to-rose-500 p-6 rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold mb-2 text-white">Pendientes</h3>
          <h2 className="text-3xl font-bold text-white">{metricas.pendientes}</h2>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 mt-6 p-6 rounded-lg shadow-xl text-center" >
        <h2 className="text-2xl font-bold text-white">Última Tarea</h2>
        <h3 className="text-lg mt-2 text-gray-100">{metricas.ultimaTarea?.texto || "No hay tareas"}</h3>
      </div>
      
    </div>
  );
}
