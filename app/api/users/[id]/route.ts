import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fileContent = await readFile(USERS_FILE, 'utf-8');
    const { users } = JSON.parse(fileContent);
    const user = users.find((u: any) => u.id === Number(params.id));
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error reading user:', error);
    return NextResponse.json(
      { error: 'Failed to get user' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updatedUser = await request.json();
    const fileContent = await readFile(USERS_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    
    const userIndex = data.users.findIndex((u: any) => u.id === Number(params.id));
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...updatedUser,
      id: Number(params.id) // Ensure ID stays as number
    };
    
    await writeFile(USERS_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json(data.users[userIndex]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fileContent = await readFile(USERS_FILE, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Convert the ID to number for comparison since our JSON stores IDs as numbers
    const userIndex = data.users.findIndex((u: any) => u.id === Number(params.id));
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    data.users.splice(userIndex, 1);
    
    await writeFile(USERS_FILE, JSON.stringify(data, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
