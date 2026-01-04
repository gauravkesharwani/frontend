import { NextRequest, NextResponse } from 'next/server'

// Generate a simple session token
function generateSessionToken(): string {
  const timestamp = Date.now()
  const randomPart = Math.random().toString(36).substring(2, 15)
  return `${timestamp}_${randomPart}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { password } = body

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set')
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Verify password
    if (password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      )
    }

    // Generate session token
    const sessionToken = generateSessionToken()

    // Create response with session cookie
    const response = NextResponse.json(
      { success: true, message: 'Authenticated' },
      { status: 200 }
    )

    // Set HTTP-only cookie with 24-hour expiry
    response.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours in seconds
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  // Logout - clear session cookie
  const response = NextResponse.json(
    { success: true, message: 'Logged out' },
    { status: 200 }
  )

  response.cookies.delete('admin_session')

  return response
}

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    status: 'ok',
    service: 'Admin Auth API',
  })
}
