// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
 
// export function proxy(request: NextRequest) {
//   const { pathname } = request.nextUrl;
  
//   if (pathname === '/') {
//     return NextResponse.redirect(new URL('/dashboard', request.url));
//   }
  
//  /*  if (pathname.startsWith('/dashboard')||pathname.startsWith('/tascas')||pathname.startsWith('/about')) {
//     const token = request.cookies.get('next-auth.session-token'); 
//     if (!token) {
//       return NextResponse.redirect(new URL('/auth/signin', request.url));
//     }
//   } */

//   return NextResponse.next();
// }