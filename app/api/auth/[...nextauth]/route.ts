import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { list } from "@vercel/blob"
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const archivo = "userTareas.json";

async function obtenerUsuarios() {
  try {
    const { blobs } = await list({ prefix: archivo });
    if (blobs.length === 0) {
      console.error('No se encontró el archivo userTareas.json en Blob Storage');
      return [];
    }
    
    const respuesta = await fetch(blobs[0].downloadUrl);
    if (!respuesta.ok) {
      console.error('Error al descargar blob:', respuesta.status);
      return [];
    }
    
    const texto = await respuesta.text();
    const datos = JSON.parse(texto);
    
    if (!datos?.usuarios) return [];
    
    return Object.entries(datos.usuarios).map(([id, usuario]: [string, any]) => ({
      id,
      correo: usuario.email,
      nombre: usuario.name,
      clave: usuario.password
    }));
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return [];
  }
}


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        clave: { label: "Contraseña", type: "password" }
      },
      async authorize(credentials) {
        const usuariosValidos = await obtenerUsuarios()
        
        const usuario = usuariosValidos.find(u => 
          u.correo === credentials?.correo && u.clave === credentials?.clave
        )
        
        if (usuario) {
          return {
            id: usuario.id,
            email: usuario.correo,
            name: usuario.nombre
          }
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl + "/dashboard"
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }