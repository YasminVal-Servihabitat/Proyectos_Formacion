import Image from 'next/image'
export default function Home() {
   
   return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="shadow-2xl shadow-red-200 flex h-auto w-full max-w-4xl flex-col items-center py-8 px-16 bg-white dark:bg-black sm:items-start rounded-3xl m-8">

         <h1 className="object-center  text-3xl font-bold text-black dark:text-white self-center font-serif ">
           About
         </h1>
        <p className="mt-5 font-serif">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil vero quam quae voluptatum recusandae ex, tempora magnam quisquam consequatur. Nobis eligendi perferendis officiis maxime possimus. Sit, placeat? Tempora, eum similique.</p>
        <div className="flex gap-6 mt-6">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/messi.jpg"
              alt="Diosito Messi"
              height={300}
              width={400}
            />
          </div>
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/perro.jpg"
            alt="Perrito"
              height={300}
              width={500}
            />
          </div>
        </div>
       </main>
      
     </div>
   );
 }

