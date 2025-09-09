
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = !!request.cookies.get('witrack_isLoggedIn')?.value;
  const { pathname } = request.nextUrl;

  const publicRoutes = ['/login', '/register'];
  const isPublicRoute = publicRoutes.includes(pathname);

  // If user is logged in and trying to access a public route (login/register), redirect to dashboard
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not logged in and trying to access a protected route, redirect to login
  if (!isLoggedIn && !isPublicRoute && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
