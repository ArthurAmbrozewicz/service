import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Search, X } from 'lucide-react';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { getVisibleNavItems, resolveNavLabel } from '@/config/navigation';
import { SEGMENT_LABELS } from '@/config/business';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/** Minúsculas e sem acento. */
function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

/** Tira o plural para singular e plural se acharem: "notificacoes" vira "notificacao". */
function raiz(palavra: string) {
  return palavra
    .replace(/(oes|aes)$/, 'ao')
    .replace(/ais$/, 'al')
    .replace(/eis$/, 'el')
    .replace(/ns$/, 'm')
    .replace(/s$/, '');
}

/** O nome da tela contém o texto, ou cada palavra buscada começa alguma palavra do nome. */
function corresponde(rotulo: string, termo: string) {
  const nome = normalizar(rotulo);
  if (nome.includes(termo)) return true;
  const palavras = nome.split(/[^a-z0-9]+/).map(raiz);
  return termo.split(/\s+/).every((buscada) => palavras.some((palavra) => palavra.startsWith(raiz(buscada))));
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { config, isFeatureEnabled } = useBusinessConfig();
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const items = getVisibleNavItems(isFeatureEnabled, config.segment).map((item) => ({
    ...item,
    label: resolveNavLabel(item, config.labels),
  }));
  const termo = normalizar(busca);
  const encontrados = termo ? items.filter((item) => corresponde(item.label, termo)) : items;

  const abrir = () => {
    setBusca('');
    onClose();
  };

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

        <div className="sidebar-search search-field">
          <Search size={16} />
          <Input
            type="search"
            placeholder="Buscar tela..."
            aria-label="Buscar tela"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            onKeyDown={(evento) => {
              // Enter abre a primeira tela encontrada; Esc limpa a busca.
              if (evento.key === 'Enter' && termo && encontrados.length > 0) {
                navigate(encontrados[0].path);
                abrir();
              }
              if (evento.key === 'Escape') setBusca('');
            }}
          />
        </div>

        <nav className="sidebar-nav">
          {encontrados.map((item) => {
            const Icon =
              ((Icons as unknown as Record<string, LucideIcon>)[item.icon] ?? Icons.Circle);
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={abrir}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          {encontrados.length === 0 && <p className="sidebar-vazio">Nenhuma tela encontrada.</p>}
        </nav>

        <div className="sidebar-footer">
          <span className="sidebar-hint">Service · LPS · Demo acadêmica</span>
        </div>
      </aside>
    </>
  );
}
