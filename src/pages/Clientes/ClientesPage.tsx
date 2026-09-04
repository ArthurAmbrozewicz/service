import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Eye, Plus, Search } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import { Table, type Column } from '@/components/Table/Table';
import { Modal } from '@/components/Modal/Modal';
import { FeatureGate } from '@/components/FeatureGate/FeatureGate';
import { useMockData } from '@/hooks/useMockData';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { formatDate, generateId } from '@/utils/format';
import type { Customer } from '@/types';

export function ClientesPage() {
  const { customers: initial } = useMockData();
  const { config } = useBusinessConfig();
  const [customers, setCustomers] = useState(initial);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '' });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase()) ||
          c.phone.includes(search)
      ),
    [customers, search]
  );

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', phone: '', email: '' });
    setModalOpen(true);
  };

  const openEdit = (c: Customer) => {
    setEditing(c);
    setForm({ name: c.name, phone: c.phone, email: c.email });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, ...form } : c))
      );
    } else {
      setCustomers((prev) => [
        {
          id: generateId('c'),
          name: form.name,
          phone: form.phone,
          email: form.email,
          status: 'ativo',
          lastVisit: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setCustomers((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    }
  };

  const columns: Column<Customer>[] = [
    { key: 'name', header: 'Nome', render: (r) => <strong>{r.name}</strong> },
    { key: 'phone', header: 'Telefone', render: (r) => r.phone, hideOnMobile: true },
    { key: 'email', header: 'E-mail', render: (r) => r.email, hideOnMobile: true },
    { key: 'last', header: 'Último atendimento', render: (r) => formatDate(r.lastVisit) },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge variant={r.status === 'ativo' ? 'success' : 'neutral'}>
          {r.status === 'ativo' ? 'Ativo' : 'Inativo'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (r) => (
        <div className="row-actions">
          <Link to={`/clientes/${r.id}`} className="icon-btn" title="Visualizar">
            <Eye size={16} />
          </Link>
          <button type="button" className="icon-btn" onClick={() => openEdit(r)} title="Editar">
            <Pencil size={16} />
          </button>
          <button type="button" className="icon-btn danger" onClick={() => setDeleteId(r.id)} title="Excluir">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <FeatureGate feature="customers">
      <div className="page">
        <PageHeader
          title={config.labels.customerPlural}
          subtitle={`Cadastro e gestão de ${config.labels.customerPlural.toLowerCase()}`}
          actions={
            <Button size="sm" onClick={openCreate}>
              <Plus size={16} /> Adicionar {config.labels.customer.toLowerCase()}
            </Button>
          }
        />

        <div className="toolbar">
          <div className="search-field">
            <Search size={16} />
            <Input
              placeholder={`Buscar ${config.labels.customer.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="card card-padding">
          <Table columns={columns} data={filtered} keyExtractor={(r) => r.id} />
        </div>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? `Editar ${config.labels.customer}` : `Novo ${config.labels.customer}`}
          footer={
            <>
              <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button onClick={save}>Salvar</Button>
            </>
          }
        >
          <div className="form-grid">
            <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input label="Telefone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="E-mail" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </Modal>

        <Modal
          open={Boolean(deleteId)}
          onClose={() => setDeleteId(null)}
          title="Confirmar exclusão"
          size="sm"
          footer={
            <>
              <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancelar</Button>
              <Button variant="danger" onClick={confirmDelete}>Excluir</Button>
            </>
          }
        >
          <p>Esta exclusão é simulada e remove o registro apenas da sessão atual.</p>
        </Modal>
      </div>
    </FeatureGate>
  );
}
