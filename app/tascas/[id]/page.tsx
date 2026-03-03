import TareaIndividual from "../../componentes/TareaIndividual";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { Redis } from "@upstash/redis";
import { redirect } from "next/navigation";

const redis = Redis.fromEnv();

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }
  
  const tarea = await redis.get(`tasca:${id}`) as any;
  
  if (!tarea || tarea.user_id !== session.user.id) {
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="shadow-2xl shadow-red-200 flex h-200 w-full max-w-3xl flex-col items-c py-8 px-16 bg-white dark:bg-black sm:items-start rounded-3xl m-8">
        <h1 className="object-center font-serif text-3xl font-bold text-black dark:text-white self-center">
          Tarea {id}
        </h1>
        <TareaIndividual tareas={tarea} />
      </div>
    </main>
  );
}
