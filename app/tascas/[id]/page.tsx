import TareaIndividual from "../../componentes/TareaIndividual";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const res = await fetch(`http://localhost:3000/api/tareas/${id}`);
  
  if (!res.ok) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="shadow-2xl shadow-red-200 flex h-200 w-full max-w-3xl flex-col items-c py-8 px-16 bg-white dark:bg-black sm:items-start rounded-3xl m-8">
          <h1 className="object-center font-serif text-3xl font-bold text-red-600 self-center">
            Tarea no encontrada
          </h1>
        </div>
      </main>
    );
  }
  
  const tareas = await res.json();

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="shadow-2xl shadow-red-200 flex h-200 w-full max-w-3xl flex-col items-c py-8 px-16 bg-white dark:bg-black sm:items-start rounded-3xl m-8">
        <h1 className="object-center font-serif text-3xl font-bold text-black dark:text-white self-center">
          Tarea {id}
        </h1>
        <TareaIndividual tareas={tareas} />
      </div>
    </main>
  );
}
