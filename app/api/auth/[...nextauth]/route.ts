import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { migracion, redis } from "@/lib/migracion";

async function obtenerUsuarios() {
  await migracion();
  try {
    const keys = await redis.keys('user:*');
    const usuarios = [];
    
    for (const key of keys) {
      if (!key.includes(':tascas')) {
        const usuario = await redis.get(key) as any;
        if (usuario) {
          usuarios.push({
            id: usuario.id,
            correo: usuario.email,
            nombre: usuario.nombre,
            clave: usuario.password
          });
        }
      }
    }
    
    return usuarios;
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
        console.log('Credenciales recibidas:', credentials);
        const usuariosValidos = await obtenerUsuarios()
        console.log('Usuarios válidos:', usuariosValidos);
        
        const usuario = usuariosValidos.find(u => 
          u.correo === credentials?.correo && u.clave === credentials?.clave
        )
        console.log('Usuario encontrado:', usuario);
        
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
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: '/auth/signin'
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
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