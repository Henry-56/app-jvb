import { db } from '@/db';
import { products, sales, purchases } from '@/db/schema';
import { eq, sql, desc } from 'drizzle-orm';

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    minStock: number;
    expirationDate: string | null;
}

export const inventoryService = {
  async getAllProducts() {
    return await db.query.products.findMany({
      orderBy: [desc(products.updatedAt)],
    });
  },

  async getProductById(id: number) {
    return await db.query.products.findFirst({
      where: eq(products.id, id),
    });
  },

  async updateStock(productId: number, quantityChange: number) {
    return await db.update(products)
      .set({
        stock: sql`${products.stock} + ${quantityChange}`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId))
      .returning();
  },

  async recordSale(productId: number, quantity: number, total: number) {
    return await db.transaction(async (tx) => {
      // 1. Create sale record
      await tx.insert(sales).values({
        productId,
        quantity,
        total,
      });

      // 2. Update stock
      return await tx.update(products)
        .set({
          stock: sql`${products.stock} - ${quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId))
        .returning();
    });
  },

  async recordPurchase(productId: number, quantity: number, cost: number) {
    return await db.transaction(async (tx) => {
      // 1. Create purchase record
      await tx.insert(purchases).values({
        productId,
        quantity,
        cost,
      });

      // 2. Update stock
      return await tx.update(products)
        .set({
          stock: sql`${products.stock} + ${quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId))
        .returning();
    });
  },

  async getDashboardStats() {
    const allProducts = await this.getAllProducts();
    const totalInventoryValue = allProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const criticalStockCount = allProducts.filter(p => p.stock <= p.minStock).length;
    
    // 1. Calculate Top Sellers (Quantity sold in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesStats = await db.select({
      productId: sales.productId,
      totalSold: sql<number>`sum(${sales.quantity})`,
      salesCount: sql<number>`count(${sales.id})`,
    })
    .from(sales)
    .where(sql`${sales.timestamp} >= ${thirtyDaysAgo}`)
    .groupBy(sales.productId);

    // Map stats back to products
    const productsWithStats = allProducts.map(p => {
      const stats = salesStats.find(s => s.productId === p.id);
      return {
        ...p,
        totalSold: Number(stats?.totalSold || 0),
        salesCount: Number(stats?.salesCount || 0),
        weeklyDemand: Number(((stats?.totalSold || 0) / 4).toFixed(1)), // Estimated weekly
      };
    });

    const topSellers = [...productsWithStats]
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5);

    const lowRotation = productsWithStats
      .filter(p => p.totalSold < 5)
      .slice(0, 5);

    return {
      totalProducts: allProducts.length,
      totalInventoryValue,
      criticalStockCount,
      topSellers,
      lowRotation,
      products: productsWithStats,
    };
  }
}
