import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JSON_KEY!);
 
export async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const authCookie = (await cookieStore).get("auth")?.value;
  
  // unauthenticated user
  if (!authCookie) {
    const path = request.nextUrl.pathname;
    if (
      !(path == '/' ||
      path.startsWith('/sign-in') ||
      path.startsWith('/sign-up'))
    ) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    return NextResponse.next();
  }

  // Authenticated user
  try {
    const { payload } = await jwtVerify(authCookie, SECRET);
    const now = Math.floor(Date.now() / 1000);

    // 5 min
    if ((payload.exp as number) - now < 300) {
      const newToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(SECRET)

      const response = NextResponse.next();
      response.cookies.set('auth', newToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 3600 // 1 hour
      })
      return response
    }

  } catch (error) {
    console.error('JWT verification failed:', error)
    const response = NextResponse.redirect(new URL('/sign-in', request.url))
    response.cookies.delete("auth");
    return response
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
}
