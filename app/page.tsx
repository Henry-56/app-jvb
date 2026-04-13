import { DashboardHeader, StatsCard } from '@/components/dashboard/DashboardComponents';
import { 
  Package, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  Activity
} from 'lucide-react';
import styles from '@/components/dashboard/Dashboard.module.css';

// This would be a Server Component fetching data from the service
export default async function DashboardPage() {
  // In a real scenario, we'd fetch from inventoryService.getDashboardStats()
  // const stats = await inventoryService.getDashboardStats();
  
  const stats = {
    totalProducts: 45,
    inventoryValue: 12450.50,
    criticalItems: 3,
    recentSales: 12
  };

  return (
    <div className="animate-in fade-in duration-700">
      <DashboardHeader 
        title="Dashboard Inteligente" 
        subtitle="Bienvenido de nuevo. Aquí está el resumen de tu tienda hoy."
      />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '2.5rem'
      }}>
        <StatsCard 
          title="Productos Totales" 
          value={stats.totalProducts} 
          icon={<Package size={20} />}
          color="rgba(99, 102, 241, 0.5)"
          trend="+2 esta semana"
        />
        <StatsCard 
          title="Valor Inventario" 
          value={`$${stats.inventoryValue.toLocaleString()}`} 
          icon={<DollarSign size={20} />}
          color="rgba(16, 185, 129, 0.5)"
          trend="Equilibrio óptimo"
        />
        <StatsCard 
          title="Stock Crítico" 
          value={stats.criticalItems} 
          icon={<AlertTriangle size={20} />}
          color="rgba(239, 68, 68, 0.5)"
          trend="Requiere atención"
        />
        <StatsCard 
          title="Ventas (Hoy)" 
          value={stats.recentSales} 
          icon={<TrendingUp size={20} />}
          color="rgba(236, 72, 153, 0.5)"
          trend="+15% vs ayer"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass" style={{ padding: '1.5rem', height: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Tendencia de Ventas</h2>
            <Activity size={20} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
            [Gráfico de Ventas - Recharts]
          </div>
        </div>
        
        <div className="glass" style={{ padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Sugerencias IA</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>Reponer Stock</p>
              <p style={{ color: '#94a3b8' }}>El Arroz "Costeño" bajó de su mínimo. Sugiero comprar 20 unidades.</p>
            </div>
            <div style={{ padding: '0.75rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
              <p style={{ color: 'var(--secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>Alta Rotación</p>
              <p style={{ color: '#94a3b8' }}>La Leche "Gloria" ha tenido un aumento de ventas del 20% hoy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
