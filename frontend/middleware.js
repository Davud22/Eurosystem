import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname } = request.nextUrl
  
  // Dohvati token iz cookies
  const token = request.cookies.get('access_token')?.value
  
  // Admin rute - samo admin može pristupiti
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Nije logovan - preusmjeri na prijavu
      return NextResponse.redirect(new URL('/prijava', request.url))
    }
    
    // Za sada samo provjeravamo da li postoji token
    // U pravoj aplikaciji trebali biste dekodirati JWT i provjeriti role
  }
  
  // User rute - samo logovani korisnici mogu pristupiti
  if (pathname.startsWith('/user')) {
    if (!token) {
      // Nije logovan - preusmjeri na prijavu
      return NextResponse.redirect(new URL('/prijava', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*'
  ]
} 