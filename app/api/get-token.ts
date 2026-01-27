import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default async function handler(request: NextRequest, res: NextResponse) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request })
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/tascas') || pathname.startsWith('/about')) {
    if (token) {
      console.log("JSON Web Token", JSON.stringify(token, null, 2))
      return NextResponse.json({ success: true, token })
    } else {
      return NextResponse.json({ error: "NO se ha encontrado ningun TOKEN" }, { status: 401 })
    }
  }
  
  return NextResponse.json({ success: true })
}