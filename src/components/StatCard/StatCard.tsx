import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/utils/format';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
  className?: string;
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  const IconComponent =
    ((Icons as unknown as Record<string, LucideIcon>)[icon] ?? Icons.BarChart3);

  return (
    <div className={cn('stat-card', className)}>
      <div className="stat-card-icon">
        <IconComponent size={22} />
      </div>
      <div className="stat-card-body">
        <span className="stat-card-label">{label}</span>
        <strong className="stat-card-value">{value}</strong>
        {trend && <span className="stat-card-trend">{trend}</span>}
      </div>
    </div>
  );
}

interface StatGridProps {
  children: ReactNode;
}

export function StatGrid({ children }: StatGridProps) {
  return <div className="stat-grid">{children}</div>;
}
