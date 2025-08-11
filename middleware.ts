import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Define protected routes that require authentication
const protectedRoutes = [
  '/',
  '/asset',
  '/drivers', 
  '/trips',
  '/fuel',
  '/maintenance',
  '/realTimeData',
  '/vehicleOverview',
  '/userManagement'
]

// Define public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )

  // Get the NextAuth session token
  const token = await getToken({ 
    req: request, 
    secret: process.env.AUTH_SECRET 
  })
  
  // Check if user is authenticated using NextAuth session
  const isAuthenticated = !!token

  // If accessing a protected route without authentication, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // // If accessing login page while already authenticated, redirect to dashboard
  // if (pathname === '/login' && isAuthenticated) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  // // If accessing signup page while already authenticated, redirect to dashboard
  // if (pathname === '/signup' && isAuthenticated) {
  //   return NextResponse.redirect(new URL('/', request.url))
  // }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 