"use client";
import GestorTareas from "../componentes/GestorTareas";
export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="shadow-2xl shadow-red-200 flex h-200 w-full max-w-3xl flex-col items-c  py-8 px-16 bg-white dark:bg-black sm:items-start rounded-3xl m-8">
        <h1 className="object-center font-serif text-3xl font-bold text-black dark:text-white self-center">
          Gestión de Tareas
        </h1>
        <GestorTareas />
      </div>
    </main>
  );
}
