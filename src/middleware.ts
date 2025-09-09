
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedInCookie = request.cookies.get('witrack_isLoggedIn');
  const isLoggedIn = isLoggedInCookie ? JSON.parse(isLoggedInCookie.value) : false;
  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === '/login' || pathname === '/register';

  // If the user is logged in and trying to access a public route, redirect to the dashboard.
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is not logged in and trying to access a protected route, redirect to the login page.
  // The root path '/' should also be protected and redirect to login if not authenticated.
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
