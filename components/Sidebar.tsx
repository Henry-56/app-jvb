import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Bot
} from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>A</div>
        <span>Abarrotes<span className={styles.highlight}>AI</span></span>
      </div>
      
      <nav className={styles.nav}>
        <Link href="/" className={styles.navItem}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/inventory" className={styles.navItem}>
          <Package size={20} />
          <span>Inventario</span>
        </Link>
        <Link href="/sales" className={styles.navItem}>
          <ShoppingCart size={20} />
          <span>Ventas</span>
        </Link>
        <Link href="/purchases" className={styles.navItem}>
          <TrendingUp size={20} />
          <span>Compras</span>
        </Link>
        <div className={styles.separator}></div>
        <Link href="/ia-assistant" className={styles.navItem}>
          <Bot size={20} />
          <span>Asistente IA</span>
        </Link>
      </nav>
      
      <div className={styles.footer}>
        <div className={styles.alert}>
          <AlertTriangle size={16} color="var(--warning)" />
          <span>3 productos bajos</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
