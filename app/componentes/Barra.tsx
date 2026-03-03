"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SideBar from "./sideBar";

export default function Barra({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <>
      {pathname !== "/auth/signin" && <SideBar />}
      {children}
    </>
  );
}
