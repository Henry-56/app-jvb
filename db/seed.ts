import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import * as dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding database - Historical Data Mode...');

  // 1. Get products
  const insertedProducts = await db.query.products.findMany();
  
  if (insertedProducts.length === 0) {
    console.log('No products found. Creating initial products...');
    const productsData = [
        { name: 'Arroz Costeño 1kg', category: 'Granos', price: 3.50, stock: 45, minStock: 10, expirationDate: '2025-12-01' },
        { name: 'Leche Gloria Azul', category: 'Lácteos', price: 4.20, stock: 15, minStock: 12, expirationDate: '2024-06-15' },
        { name: 'Aceite Primor 1L', category: 'Abarrotes', price: 11.50, stock: 20, minStock: 5, expirationDate: '2025-08-20' },
        { name: 'Azúcar Rubia 1kg', category: 'Granos', price: 3.80, stock: 3, minStock: 15, expirationDate: '2026-01-10' },
        { name: 'Fideos Lavaggi 500g', category: 'Pastas', price: 2.50, stock: 30, minStock: 10, expirationDate: '2025-11-05' },
        { name: 'Detergente Opal 1kg', category: 'Limpieza', price: 8.90, stock: 15, minStock: 5, expirationDate: null },
        { name: 'Yogurt Laive 1L', category: 'Lácteos', price: 6.50, stock: 8, minStock: 10, expirationDate: '2024-05-20' },
    ];
    await db.insert(schema.products).values(productsData);
  }

  // 2. Clear existing sales to avoid duplicates
  await db.delete(schema.sales);

  const products = await db.query.products.findMany();

  // 3. Generate Historical Sales (Last 30 days)
  console.log('Generating 30 days of sales history...');
  const salesEntries = [];
  const now = new Date();

  for (let i = 30; i >= 0; i--) {
    const currentDate = new Date(now);
    currentDate.setDate(now.getDate() - i);
    const dayOfWeek = currentDate.getDay();
    const isWeekend = [0, 5, 6].includes(dayOfWeek); // Sun, Fri, Sat

    for (const product of products) {
      // Products have different popularity
      const popularity = Math.random();
      const chanceOfSale = isWeekend ? 0.8 : 0.4;
      
      if (popularity > (1 - chanceOfSale)) {
        const quantity = Math.floor(Math.random() * (isWeekend ? 10 : 4)) + 1;
        salesEntries.push({
          productId: product.id,
          quantity: quantity,
          total: Number((product.price * quantity).toFixed(2)),
          timestamp: new Date(currentDate),
        });
      }
    }
  }

  // Batch insert sales for speed
  console.log(`Inserting ${salesEntries.length} sales records...`);
  for (let i = 0; i < salesEntries.length; i += 100) {
    await db.insert(schema.sales).values(salesEntries.slice(i, i + 100));
  }

  console.log('Seeding completed successfully!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
