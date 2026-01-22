
import GestorDashboard from '../componentes/GestorDashboard';
export default function Home() {

  return (
    <div className="flex  items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex h-200 shadow-2xl  w-full max-w-3xl flex-col items-c  py-8 px-16 bg-white dark:bg-black sm:items-start rounded-3xl m-8">
        <h1 className="object-center font-mono text-3xl font-bold text-black dark:text-white self-center  ">
          Dashboard
        </h1>
        <GestorDashboard/>
      </main>
    </div>
  );
}
