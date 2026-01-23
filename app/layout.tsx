import "./globals.css";
import AuthProvider from "./componentes/AuthProvider";
import { ThemeProvider } from "next-themes";
import { TemaBoton } from "./componentes/TemaBoton";
import Barra from "./componentes/Barra";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-black dark:text-white">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <Barra>{children}</Barra>
          </AuthProvider>0.......................................
          <TemaBoton/>
        </ThemeProvider>
      </body>
    </html>
  );
}
