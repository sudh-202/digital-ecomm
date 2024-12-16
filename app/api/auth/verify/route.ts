import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = 'your-secret-key';
const COOKIE_NAME = 'auth_token';

interface DecodedToken {
  id: number;
  email: string;
  role: string;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME);

    console.log('Verify endpoint called, token present:', !!token);

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      const decoded = verify(token.value, JWT_SECRET) as DecodedToken;
      console.log('Token verified, user:', decoded);

      return NextResponse.json({
        success: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        }
      });
    } catch {
      console.error('Token verification failed');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch {
    console.error('Verify endpoint error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
