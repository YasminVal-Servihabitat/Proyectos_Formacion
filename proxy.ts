import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = await getToken({ req: request })
  console.log(token)
  if (pathname == '/') {
    if (token !== null) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }else{
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }
  }
  
  if (pathname !== '/auth/signin' && token == null) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
  }else if (pathname == '/auth/signin' && token !== null ){
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}