import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'manager';
}

async function addUser(user: Omit<User, 'password'> & { password: string }) {
  const configPath = path.join(process.cwd(), 'config', 'users.ts');
  const hashedPassword = await bcrypt.hash(user.password, 10);
  
  const newUser = {
    ...user,
    password: hashedPassword
  };

  let content = await fs.readFile(configPath, 'utf-8');
  
  // Find the USERS array in the file
  const usersMatch = content.match(/export const USERS: User\[\] = \[([\s\S]*?)\];/);
  if (!usersMatch) {
    throw new Error('Could not find USERS array in config file');
  }

  // Parse existing users
  const existingUsers = eval(`[${usersMatch[1]}]`) as User[];
  
  // Add new user
  existingUsers.push(newUser);
  
  // Format users array
  const usersString = existingUsers
    .map(u => `
  {
    id: ${u.id},
    name: '${u.name}',
    email: '${u.email}',
    password: '${u.password}',
    role: '${u.role}'
  }`)
    .join(',');

  // Replace users array in file
  content = content.replace(
    /export const USERS: User\[\] = \[([\s\S]*?)\];/,
    `export const USERS: User[] = [${usersString}\n];`
  );

  await fs.writeFile(configPath, content, 'utf-8');
  console.log(`Added user: ${user.email}`);
}

// Example usage:
// addUser({
//   id: 3,
//   name: 'New Admin',
//   email: 'newadmin@example.com',
//   password: 'password123',
//   role: 'admin'
// });
