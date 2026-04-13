import React from 'react';
import { inventoryService } from '@/modules/inventory/services';
import styles from '@/components/inventory/Transactions.module.css';
import { Truck, Wallet, Calendar, Package } from 'lucide-react';
import FormattedDate from '@/components/ui/FormattedDate';

export default async function PurchasesPage() {
  const purchasesData = await inventoryService.getDetailedPurchases();
  const totalCost = purchasesData.reduce((sum, s) => sum + (s.cost || 0), 0);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Historial de Compras</h1>
          <p className="text-gray-500 mt-1">Gestión de abastecimiento e inversión en inventario.</p>
        </div>
        
        <div className={`${styles.summaryCard} ${styles.purchasesTheme}`}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={18} className="text-purple-400" />
            <span className={styles.summaryLabel}>Inversión Total (30d)</span>
          </div>
          <span className={styles.summaryValue}>${totalCost.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
        </div>
      </header>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><div className="flex items-center gap-2"><Package size={14} /> Producto</div></th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Costo</th>
              <th><div className="flex items-center gap-2"><Calendar size={14} /> Fecha</div></th>
            </tr>
          </thead>
          <tbody>
            {purchasesData.map((purchase) => (
              <tr key={purchase.id}>
                <td className="font-semibold">{purchase.productName || 'Producto Eliminado'}</td>
                <td><span className={styles.badge}>{purchase.category || 'N/A'}</span></td>
                <td className="font-medium text-emerald-400">+{purchase.quantity} und.</td>
                <td className={styles.price}>
                  ${purchase.cost.toFixed(2)}
                </td>
                <td className={styles.date}>
                  <FormattedDate date={purchase.timestamp} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
