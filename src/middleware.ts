import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get('jwt')?.value;
  const loginUrl = new URL('/login', req.url);
  const dashboardUrl = new URL('/dashboard', req.url);
  const protectedPaths = ['/dashboard', '/subscribers'];

  const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (req.nextUrl.pathname === '/login') {
    if (token) {
      return NextResponse.redirect(dashboardUrl);
    }
  }

  if(isProtectedPath) {
    if (!token) {
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();

}

export const config = {
  matcher: [
    '/dashboard', '/login'
  ],
};