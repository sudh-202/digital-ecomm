import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function GET() {
  try {
    const fileContent = await readFile(USERS_FILE, 'utf-8');
    const { users } = JSON.parse(fileContent);
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error reading users:', error);
    return NextResponse.json(
      { error: 'Failed to get users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const newUser = await request.json();
    const fileContent = await readFile(USERS_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Generate a new numeric ID
    const maxId = Math.max(...data.users.map((user: any) => Number(user.id)), 0);
    newUser.id = maxId + 1;
    newUser.createdAt = new Date().toISOString();
    
    data.users.push(newUser);
    
    await writeFile(USERS_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
