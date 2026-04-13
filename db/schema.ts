import { pgTable, serial, text, doublePrecision, integer, timestamp, date } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  price: doublePrecision('price').notNull(),
  stock: integer('stock').notNull().default(0),
  minStock: integer('min_stock').notNull().default(5),
  expirationDate: date('expiration_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sales = pgTable('sales', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  total: doublePrecision('total').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});

export const purchases = pgTable('purchases', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  cost: doublePrecision('cost').notNull(),
  timestamp: timestamp('timestamp').defaultNow(),
});
