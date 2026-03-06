import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Rutas protegidas por rol
// El middleware solo verifica que exista el token (presencia de sesión).
// La verificación de ROL ocurre en los layouts de cada route group.
const PROTECTED_ROUTES = {
  applicant: ['/adoptar', '/mis-solicitudes', '/favoritos', '/mi-match', '/mi-perfil', '/chat'],
  shelter:   ['/refugio/'],
  admin:     ['/admin'],
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const path  = request.nextUrl.pathname

  const needsAuth = Object.values(PROTECTED_ROUTES)
    .flat()
    .some(route => path.startsWith(route))

  if (needsAuth && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', encodeURIComponent(path))
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Corre en todas las rutas excepto assets estáticos y endpoints de API
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
