import { useMemo, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import { Table, type Column } from '@/components/Table/Table';
import { Modal } from '@/components/Modal/Modal';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { useMockData } from '@/hooks/useMockData';
import { useDados } from '@/context/DadosContext';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { formatCurrency } from '@/utils/format';
import type { Service } from '@/types';

export function ServicosPage() {
  const { services, professionals } = useMockData();
  const { salvarServico, excluirServico } = useDados();
  const { config } = useBusinessConfig();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<{
    name: string;
    category: string;
    duration: number;
    price: number;
    status: 'ativo' | 'inativo';
  }>({ name: '', category: '', duration: 30, price: 0, status: 'ativo' });

  const columns: Column<Service>[] = useMemo(
    () => [
      { key: 'name', header: 'Nome', render: (r) => <strong>{r.name}</strong> },
      { key: 'category', header: 'Categoria', render: (r) => r.category },
      { key: 'duration', header: 'Duração', render: (r) => `${r.duration} min` },
      { key: 'price', header: 'Preço', render: (r) => formatCurrency(r.price) },
      {
        key: 'pro',
        header: config.labels.professional,
        hideOnMobile: true,
        render: (r) =>
          r.professionalIds
            .map((id) => professionals.find((p) => p.id === id)?.name.split(' ')[0])
            .filter(Boolean)
            .join(', ') || '—',
      },
      {
        key: 'status',
        header: 'Status',
        render: (r) => (
          <Badge variant={r.status === 'ativo' ? 'success' : 'neutral'}>{r.status}</Badge>
        ),
      },
      {
        key: 'actions',
        header: 'Ações',
        render: (r) => (
          <div className="row-actions">
            <button type="button" className="icon-btn" onClick={() => { setEditing(r); setForm({ name: r.name, category: r.category, duration: r.duration, price: r.price, status: r.status }); setOpen(true); }}>
              <Pencil size={16} />
            </button>
            <button type="button" className="icon-btn danger" onClick={() => { excluirServico(r.id).catch((falha: Error) => window.alert(falha.message)); }}>
              <Trash2 size={16} />
            </button>
          </div>
        ),
      },
    ],
    [config.labels.professional, professionals]
  );

  const save = async () => {
    if (!form.name.trim()) return;
    await salvarServico(form, config.segment, editing?.id);
    setOpen(false);
    setEditing(null);
  };

  return (
    <FeatureGate feature="services">
      <div className="page">
        <PageHeader
          title={config.labels.servicePlural}
          subtitle={`Catálogo adaptado ao segmento ${config.segment}`}
          actions={
            <Button size="sm" onClick={() => { setEditing(null); setForm({ name: '', category: '', duration: config.schedulingRules.defaultDuration, price: 0, status: 'ativo' }); setOpen(true); }}>
              <Plus size={16} /> Novo {config.labels.service.toLowerCase()}
            </Button>
          }
        />

        <div className="card card-padding">
          <Table columns={columns} data={services} keyExtractor={(r) => r.id} />
        </div>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title={editing ? `Editar ${config.labels.service}` : `Novo ${config.labels.service}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={save}>Salvar</Button>
            </>
          }
        >
          <div className="form-grid">
            <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <Input label="Duração (min)" type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
            <Input label="Preço" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'ativo' | 'inativo' })}>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </Select>
          </div>
        </Modal>
      </div>
    </FeatureGate>
  );
}
