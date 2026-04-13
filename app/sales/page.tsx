import React from 'react';
import { inventoryService } from '@/modules/inventory/services';
import styles from '@/components/inventory/Transactions.module.css';
import { ShoppingCart, TrendingUp, Calendar } from 'lucide-react';
import FormattedDate from '@/components/ui/FormattedDate';

export default async function SalesPage() {
  const salesData = await inventoryService.getDetailedSales();
  const totalRevenue = salesData.reduce((sum, s) => sum + (s.total || 0), 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Historial de Ventas</h1>
          <p className="text-gray-500 mt-1">Consulta todas las transacciones de salida realizadas.</p>
        </div>
        
        <div className={`${styles.summaryCard} ${styles.salesTheme}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-emerald-400" />
            <span className={styles.summaryLabel}>Ingresos Totales (30d)</span>
          </div>
          <span className={styles.summaryValue}>${totalRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
        </div>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><div className="flex items-center gap-2"><ShoppingCart size={14} /> Producto</div></th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Total</th>
              <th><div className="flex items-center gap-2"><Calendar size={14} /> Fecha</div></th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((sale) => (
              <tr key={sale.id}>
                <td className="font-semibold">{sale.productName || 'Producto Eliminado'}</td>
                <td><span className={styles.badge}>{sale.category || 'N/A'}</span></td>
                <td className="font-medium">{sale.quantity} und.</td>
                <td className={`${styles.price} ${styles.amount}`}>
                  ${sale.total.toFixed(2)}
                </td>
                <td className={styles.date}>
                  <FormattedDate date={sale.timestamp} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
