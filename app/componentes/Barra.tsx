"use client";
import { usePathname } from "next/navigation";
import SideBar from "./sideBar";

export default function Barra({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/auth/signin" && <SideBar />}
      {children}
    </>
  );
}
