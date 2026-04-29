import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROTAS_PROTEGIDAS = ['/jogo', '/vitoria', '/game-over']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const username = request.cookies.get('username')?.value

  // Rota protegida sem usuário → redireciona para login
  if (ROTAS_PROTEGIDAS.includes(pathname) && !username) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Já logado tentando acessar login → redireciona para menu
  if (pathname === '/login' && username) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/jogo', '/vitoria', '/game-over', '/login'],
}
