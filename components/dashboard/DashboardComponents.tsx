import React from 'react';
import styles from './Dashboard.module.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: string;
}

export const StatsCard = ({ title, value, icon, trend, color }: StatsCardProps) => {
  return (
    <div className={`glass glass-hover ${styles.card}`}>
      <div className={styles.cardHeader}>
        <span className={styles.cardTitle}>{title}</span>
        <div className={styles.cardIcon} style={{ background: color }}>
          {icon}
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardValue}>{value}</h3>
        {trend && <span className={styles.cardTrend}>{trend}</span>}
      </div>
    </div>
  );
};

export const DashboardHeader = ({ title, subtitle }: { title: string, subtitle: string }) => {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.actions}>
        <button className={styles.primaryBtn}>Registrar Venta</button>
      </div>
    </header>
  );
};
