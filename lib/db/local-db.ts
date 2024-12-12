import { User } from './schema';

const STORAGE_KEY = 'digital-ecomm-users';

export class LocalDatabase {
  private users: User[] = [];

  constructor() {
    this.initializeUsers();
  }

  private initializeUsers() {
    if (typeof window === 'undefined') return;

    const storedUsers = localStorage.getItem(STORAGE_KEY);
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    } else {
      // Create default user if no data exists
      const defaultUser: User = {
        id: 1,
        name: 'admin',
        image: '/user.png',
        email: 'admin@tubeguruji.com',
        createdAt: new Date().toISOString()
      };
      this.users = [defaultUser];
      this.saveUsers();
    }
  }

  private saveUsers(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.users));
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: Math.max(0, ...this.users.map(u => u.id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  clearUsers(): void {
    this.users = [];
    this.saveUsers();
  }
}

// Create a singleton instance
export const localDb = new LocalDatabase();
