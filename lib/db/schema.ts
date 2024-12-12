import { sql } from 'drizzle-orm';
import { 
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  image: text('image'),
  email: text('email').notNull().unique(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: integer('price').notNull(),
  image: text('image').notNull(),
  category: text('category').notNull(),
  slug: text('slug').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>(),
  highlights: text('highlights', { mode: 'json' }).$type<string[]>(),
  format: text('format'),
  storage: text('storage'),
  userId: integer('user_id').notNull().references(() => users.id),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;
export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  slug: string;
  tags: string[] | null;
  highlights: string[] | null;
  format: string | null;
  storage: string | null;
  userId: number;
  createdAt: string | null;
};

export type NewProduct = Omit<Product, 'id' | 'createdAt' | 'slug'> & {
  createdAt?: string | null;
};
