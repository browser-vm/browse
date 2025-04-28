import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl;

  // We only want to run this middleware for the proxy service routes
  if (pathname.startsWith('/service/')) {
    const response = NextResponse.next();
    
    // Add security headers to proxied content
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'no-referrer');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Set content security policy
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self' * data: blob: 'unsafe-inline' 'unsafe-eval';"
    );
    
    return response;
  }
  
  return NextResponse.next();
}

// This configuration determines which routes this middleware is run for
export const config = {
  matcher: '/service/:path*',
};
