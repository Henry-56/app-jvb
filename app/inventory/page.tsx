import { inventoryService } from '@/modules/inventory/services';
import { DashboardHeader } from '@/components/dashboard/DashboardComponents';
import { Package, Search, Plus, Filter, MoreVertical } from 'lucide-react';
import styles from './Inventory.module.css';

export default async function InventoryPage() {
  // Logic to fetch products
  // const products = await inventoryService.getAllProducts();
  
  const mockProducts = [
    { id: 1, name: 'Arroz Costeño 1kg', category: 'Granos', price: 3.50, stock: 45, minStock: 10, expirationDate: '2025-12-01' },
    { id: 2, name: 'Leche Gloria Azul', category: 'Lácteos', price: 4.20, stock: 4, minStock: 12, expirationDate: '2024-06-15' },
    { id: 3, name: 'Aceite Primor 1L', category: 'Abarrotes', price: 11.50, stock: 20, minStock: 5, expirationDate: '2025-08-20' },
    { id: 4, name: 'Azúcar Rubia 1kg', category: 'Granos', price: 3.80, stock: 2, minStock: 15, expirationDate: '2026-01-10' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <DashboardHeader 
        title="Gestión de Inventario" 
        subtitle="Administra tus productos, controla el stock y visualiza alertas de vencimiento."
      />

      <div className={`glass ${styles.tableContainer}`}>
        <div className={styles.tableActions}>
          <div className={styles.searchBox}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Buscar producto..." className={styles.searchInput} />
          </div>
          <div className={styles.filterBtns}>
            <button className={styles.secondaryBtn}>
              <Filter size={18} />
              Filtrar
            </button>
            <button className={styles.primaryBtn}>
              <Plus size={18} />
              Nuevo Producto
            </button>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Vencimiento</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((product) => {
              const isLowStock = product.stock <= product.minStock;
              return (
                <tr key={product.id} className={styles.tableRow}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productIcon}><Package size={16} /></div>
                      <span>{product.name}</span>
                    </div>
                  </td>
                  <td><span className={styles.categoryBadge}>{product.category}</span></td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={isLowStock ? styles.lowStock : ''}>
                      {product.stock} und.
                    </span>
                  </td>
                  <td>
                    {isLowStock ? (
                      <span className={styles.statusBadgeError}>Stock Bajo</span>
                    ) : (
                      <span className={styles.statusBadgeSuccess}>Óptimo</span>
                    )}
                  </td>
                  <td>{product.expirationDate}</td>
                  <td>
                    <button className={styles.actionBtn}><MoreVertical size={16} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
