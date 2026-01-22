"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function SideBar() {
  const [abrirSide, setAbrirSide] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <div
        onClick={() => setAbrirSide(!abrirSide)}
        className="fixed top-4 left-4 z-50 text-black bg-white border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm p-2 focus:outline-none inline-flex"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2"
            d="M5 7h14M5 12h14M5 17h10"
          />
        </svg>
      </div>
      <aside
        className={` dark:bg-white fixed top-0 left-0 z-40 w-64 h-full transition-transform duration-300 bg-black font-serif 
      ${abrirSide ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-full px-3 py-4 pt-16 overflow-y-auto bg-neutral-primary-soft border-e border-default ">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/about"
                className={`dark:text-black flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group text-white font-serif 
              ${pathname === "/about" ? "bg-red-200 rounded-2xl" : ""}`}
              >
                <span className="ms-3"> About</span>
              </a>
            </li>
            <li>
              <a
                href="/tascas"
                className={`dark:text-black flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group text-white 
              ${pathname === "/tascas" ? "bg-red-200 rounded-2xl" : ""}`}
              >
                <span className="ms-3">Tareas</span>
              </a>
            </li>
            <li>
              <a
                href="/dashboard"
                className={`dark:text-black flex items-center px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group text-white font-serif 
              ${pathname === "/dashboard" ? "bg-red-200 rounded-2xl" : ""}`}
              >
                <span className="ms-3"> Dashboard</span>
              </a>
            </li>
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/auth/signin" })}
                className="flex items-center w-full px-2 py-1.5 text-body rounded-base hover:bg-neutral-tertiary hover:text-fg-brand group text-red-500 font-serif"
              >
                <span className="ms-3">Login Out</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
