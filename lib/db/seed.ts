import { db } from '.';
import type { NewProduct, NewUser } from './schema';

async function clearDatabase() {
  try {
    await db.products.delete();
    await db.users.delete();
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

async function seed() {
  try {
    // Check if data exists
    const existingUsers = await db.users.findMany();
    
    if (existingUsers.length > 0) {
      console.log('Data already exists. Skipping seed.');
      return;
    }

    // Clear existing data
    await clearDatabase();

    // Create user
    const user = await db.users.create({
      name: 'Digital Store Admin',
      image: '/avatars/admin.png',
      email: 'admin@digitalstore.com',
    } as NewUser);

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
        image: '/products/2.webp',
        userId: user.id,
      },
      {
        name: 'Noise-Canceling Earbuds',
        price: 15900, // $159.00
        image: '/products/3.webp',
        userId: user.id,
      },
      {
        name: 'Portable Bluetooth Speaker',
        price: 7900, // $79.00
        image: '/products/4.webp',
        userId: user.id,
      },
      {
        name: 'Wireless Gaming Mouse',
        price: 4900, // $49.00
        image: '/products/5.webp',
        userId: user.id,
      },
      {
        name: 'RGB Mechanical Keyboard',
        price: 8900, // $89.00
        image: '/products/6.webp',
        userId: user.id,
      },
    ];

    for (const product of productData) {
      const createdProduct = await db.products.create(product);
      console.log('Created product:', createdProduct);
    }

    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Only run seeding if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('✅ Database has been seeded');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database seeding failed');
      console.error(error);
      process.exit(1);
    });
}
