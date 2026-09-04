import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { X } from 'lucide-react';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { getVisibleNavItems, resolveNavLabel } from '@/config/navigation';
import { SEGMENT_LABELS } from '@/config/business';
import { Button } from '@/components/Button/Button';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { config, isFeatureEnabled } = useBusinessConfig();
  const items = getVisibleNavItems(isFeatureEnabled, config.segment);

  return (
    <>
      <div className={`sidebar-backdrop ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-logo">{config.logoInitials}</div>
          <div>
            <strong>{config.businessName}</strong>
            <span>{SEGMENT_LABELS[config.segment]}</span>
          </div>
          <Button variant="ghost" size="sm" className="sidebar-close" onClick={onClose} aria-label="Fechar menu">
            <X size={18} />
          </Button>
        </div>

        <nav className="sidebar-nav">
          {items.map((item) => {
            const Icon =
              ((Icons as unknown as Record<string, LucideIcon>)[item.icon] ?? Icons.Circle);
            const label = resolveNavLabel(item, config.labels);
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={18} />
                <span>{label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-hint">Service · LPS · Demo acadêmica</span>
        </div>
      </aside>
    </>
  );
}
