import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { PUBLIC_ROUTES } from '@/lib/constants';

export default auth(async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await auth();
  const isAuthenticated = !!session?.user;

  // Check if the current route is public
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (isAuthenticated && (pathname === '/signin' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
