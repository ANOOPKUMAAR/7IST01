
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedInCookie = request.cookies.get('witrack_isLoggedIn');
  const isLoggedIn = isLoggedInCookie ? JSON.parse(isLoggedInCookie.value) : false;
  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === '/login' || pathname === '/register';
  const isHomePage = pathname === '/';

  // Allow access to the homepage regardless of auth state, 
  // as it handles the initial redirection logic.
  if (isHomePage) {
    return NextResponse.next();
  }

  // If the user is logged in and trying to access a public route (login/register),
  // redirect them to the dashboard.
  if (isLoggedIn && isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the user is not logged in and trying to access a protected route,
  // redirect them to the login page.
  if (!isLoggedIn && !isPublicRoute) {
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
