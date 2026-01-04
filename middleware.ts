import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const sessionToken = request.cookies.get('admin_session')?.value

    if (!sessionToken) {
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verify session is not expired (basic check - token format: timestamp_randomstring)
    try {
      const [timestamp] = sessionToken.split('_')
      const sessionTime = parseInt(timestamp, 10)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (now - sessionTime > twentyFourHours) {
        // Session expired, redirect to login
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin_session')
        return response
      }
    } catch {
      // Invalid session format, redirect to login
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin_session')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
