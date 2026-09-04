import { useState } from 'react';
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { SEGMENT_LABELS, segmentPresets } from '@/config/business';
import type { BusinessSegment } from '@/types';
import { Button } from '@/components/Button/Button';
import { storage } from '@/utils/storage';

interface HeaderProps {
  onMenuClick: () => void;
}

const SEGMENTS = Object.keys(segmentPresets) as BusinessSegment[];

export function Header({ onMenuClick }: HeaderProps) {
  const { config, applySegmentPreset } = useBusinessConfig();
  const [demoOpen, setDemoOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    storage.setAuthenticated(false);
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <Button variant="ghost" size="sm" className="menu-btn" onClick={onMenuClick} aria-label="Abrir menu">
          <Menu size={20} />
        </Button>
        <div className="header-title">
          <strong>{config.businessName}</strong>
          <span>Negócio atual: {SEGMENT_LABELS[config.segment]}</span>
        </div>
      </div>

      <div className="header-right">
        <div className="demo-selector">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDemoOpen((v) => !v)}
            aria-expanded={demoOpen}
          >
            Modo de Demonstração
            <ChevronDown size={16} />
          </Button>
          {demoOpen && (
            <div className="demo-dropdown">
              <p className="demo-dropdown-title">Aplicar preset completo</p>
              {SEGMENTS.map((segment) => (
                <button
                  key={segment}
                  type="button"
                  className={`demo-option ${config.segment === segment ? 'active' : ''}`}
                  onClick={() => {
                    applySegmentPreset(segment);
                    setDemoOpen(false);
                  }}
                >
                  {SEGMENT_LABELS[segment]}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Sair">
          <LogOut size={18} />
          <span className="hide-mobile">Sair</span>
        </Button>
      </div>
    </header>
  );
}
