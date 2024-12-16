import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const COOKIE_NAME = 'auth_token';

export async function GET(request: Request) {
  try {
    // Get token from cookie
    const cookieHeader = request.headers.get('cookie');
    const token = cookieHeader?.split(';')
      .find(c => c.trim().startsWith(`${COOKIE_NAME}=`))
      ?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET);
    return NextResponse.json({ user: decoded });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
