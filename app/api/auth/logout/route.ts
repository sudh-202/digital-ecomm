import { NextResponse } from 'next/server';

const COOKIE_NAME = 'auth_token';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear the auth cookie
  response.cookies.delete(COOKIE_NAME);
  
  return response;
}
