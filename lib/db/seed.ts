import { db } from '.';
import { products, users, type NewProduct, type NewUser } from './schema';
// import { sql } from 'drizzle-orm';

async function clearDatabase() {
  try {
    await db.delete(products).execute();
    await db.delete(users).execute();
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

async function seed() {
  try {
    // Check if data exists
    const existingUsers = await db.select().from(users).limit(1).execute();
    
    if (existingUsers.length > 0) {
      console.log('Data already exists. Skipping seed.');
      return;
    }

    // Clear existing data
    await clearDatabase();

    // Create user
    const [user] = await db.insert(users)
      .values({
        name: 'Digital Store Admin',
        image: '/avatars/admin.png',
        email: 'admin@digitalstore.com',
      } as NewUser)
      .returning()
      .execute();

    console.log('Created user:', user);

    // Create products
    const productData: NewProduct[] = [
      {
        name: 'Premium Wireless Headphones',
        price: 29900, // $299.00
        image: '/products/1.webp',
        userId: user.id,
      },
      {
        name: 'Smart Fitness Watch',
        price: 19900, // $199.00
        image: '/products/1.webp',
        userId: user.id,
      },
      {
        name: 'Ultra HD 4K Action Camera',
        price: 24900, // $249.00
        image: '/products/1.webp',
        userId: user.id,
      },
      {
        name: 'Portable Bluetooth Speaker',
        price: 7900, // $79.00
        image: '/products/1.webp',
        userId: user.id,
      },
      {
        name: 'Noise-Canceling Earbuds',
        price: 15900, // $159.00
        image: '/products/1.webp',
        userId: user.id,
      },
      {
        name: 'Smart Home Security Camera',
        price: 12900, // $129.00
        image: '/products/1.webp',
        userId: user.id,
      },
      {
        name: 'Wireless Charging Pad',
        price: 3900, // $39.00
        image: '/products/1.webp',
        userId: user.id,
      }
    ];

    const insertedProducts = await db.insert(products)
      .values(productData)
      .returning()
      .execute();

    console.log(`Seeded ${insertedProducts.length} products successfully`);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Only run seeding if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seed, clearDatabase };
