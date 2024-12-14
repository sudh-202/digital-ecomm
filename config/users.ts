import bcrypt from 'bcryptjs';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager';
}

// DO NOT modify these passwords
export const USERS: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'adminsudhanshu@app.com',
    password: '$2a$10$Nzpx8tbpEcq5NjYb6T1r3uT7mrj9GFVKvjiUOKdnSJuYOkDySecpe', // Admin@sudhanshu@123
    role: 'admin'
  },
  {
    id: 2,
    name: 'Manager User',
    email: 'manager@app.com',
    password: '$2a$10$Nzpx8tbpEcq5NjYb6T1r3uT7mrj9GFVKvjiUOKdnSJuYOkDySecpe', // Manager@123
    role: 'manager'
  }
];
