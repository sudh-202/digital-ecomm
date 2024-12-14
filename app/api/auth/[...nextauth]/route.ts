import { NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';
import { USERS } from '@/config/users';

const JWT_SECRET = 'your-secret-key';
const COOKIE_NAME = 'auth_token';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Login attempt for:', body.email);

    const user = USERS.find(u => u.email === body.email);
    
    if (!user) {
      console.log('User not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    if (body.password !== user.password) {
      console.log('Invalid password');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create token
    const token = sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

    // Set cookie
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400 // 1 day
    });

    console.log('Login successful, cookie set');
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
