import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { atualizar, criar, excluir, listar, type Registro } from '@/api/banco';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { Table, type Column } from '@/components/Table/Table';
import { Modal } from '@/components/Modal/Modal';
import { telas, type Campo, type TelaBanco } from '@/pages/banco/telas';

type Relacionados = Record<string, Registro[]>;

function valorCampo(campo: Campo, registro?: Registro): string {
  if (registro && registro[campo.nome] != null) return String(registro[campo.nome]);
  if (campo.tipo === 'opcoes') return campo.opcoes?.[0]?.valor ?? '';
  if (campo.tipo === 'numero') return '0';
  return '';
}

function texto(campo: Campo, valor: string | number, relacionados: Relacionados): string {
  if (campo.tipo === 'opcoes') {
    return campo.opcoes?.find((opcao) => opcao.valor === String(valor))?.rotulo ?? String(valor);
  }
  if (campo.tipo === 'relacao' && campo.recurso) {
    const item = (relacionados[campo.recurso] ?? []).find((linha) => linha.id === Number(valor));
    if (!item) return String(valor);
    return (campo.exibir ?? ['nome']).map((chave) => item[chave]).join(' ');
  }
  return String(valor ?? '');
}

export function CrudTela({ recurso }: { recurso: string }) {
  const tela: TelaBanco = telas[recurso];
  const [linhas, setLinhas] = useState<Registro[]>([]);
  const [relacionados, setRelacionados] = useState<Relacionados>({});
  const [busca, setBusca] = useState('');
  const [erro, setErro] = useState('');
  const [form, setForm] = useState<Record<string, string>>({});
  const [editando, setEditando] = useState<Registro | null>(null);
  const [aberto, setAberto] = useState(false);
  const [excluindo, setExcluindo] = useState<Registro | null>(null);

  const carregar = () => {
    setErro('');
    listar(tela.recurso)
      .then(setLinhas)
      .catch((falha: Error) => setErro(falha.message));
    const recursos = [...new Set(tela.campos.map((campo) => campo.recurso).filter(Boolean))] as string[];
    recursos.forEach((nome) => {
      listar(nome)
        .then((dados) => setRelacionados((atual) => ({ ...atual, [nome]: dados })))
        .catch(() => undefined);
    });
  };

  useEffect(() => {
    carregar();
  }, [tela.recurso]);

  const camposVisiveis = tela.campos.filter((campo) => campo.tipo !== 'senha');

  const filtradas = useMemo(() => {
    const termo = busca.toLowerCase();
    return linhas.filter((linha) =>
      camposVisiveis.some((campo) => texto(campo, linha[campo.nome], relacionados).toLowerCase().includes(termo))
    );
  }, [linhas, busca, relacionados, camposVisiveis]);

  const abrirNovo = () => {
    setEditando(null);
    setForm(Object.fromEntries(tela.campos.map((campo) => [campo.nome, valorCampo(campo)])));
    setAberto(true);
  };

  const abrirEdicao = (linha: Registro) => {
    setEditando(linha);
    setForm(Object.fromEntries(tela.campos.map((campo) => [campo.nome, campo.tipo === 'senha' ? '' : valorCampo(campo, linha)])));
    setAberto(true);
  };

  const salvar = async () => {
    const corpo: Record<string, string | number> = {};
    for (const campo of tela.campos) {
      const bruto = form[campo.nome] ?? '';
      if (campo.tipo === 'senha' && editando && !bruto.trim()) continue;
      if (campo.nome !== 'observacoes' && !bruto.trim() && campo.tipo !== 'numero') {
        setErro(`Preencha ${campo.rotulo.toLowerCase()}.`);
        return;
      }
      corpo[campo.nome] = campo.tipo === 'numero' || campo.tipo === 'relacao' || campo.nome === 'lida' || campo.nome === 'usa'
        ? Number(bruto)
        : bruto;
    }
    try {
      if (editando) await atualizar(tela.recurso, editando.id, corpo);
      else await criar(tela.recurso, corpo);
      setAberto(false);
      carregar();
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : 'Falha ao gravar.');
    }
  };

  const confirmarExclusao = async () => {
    if (!excluindo) return;
    try {
      await excluir(tela.recurso, excluindo.id);
      setExcluindo(null);
      carregar();
    } catch (falha) {
      setExcluindo(null);
      setErro(falha instanceof Error ? falha.message : 'Falha ao excluir.');
    }
  };

  const colunas: Column<Registro>[] = [
    ...camposVisiveis.map((campo) => ({
      key: campo.nome,
      header: campo.rotulo,
      render: (linha: Registro) => texto(campo, linha[campo.nome], relacionados),
    })),
    {
      key: 'acoes',
      header: 'Ações',
      render: (linha: Registro) => (
        <div className="row-actions">
          <button type="button" className="icon-btn" onClick={() => abrirEdicao(linha)} title="Editar">
            <Pencil size={16} />
          </button>
          <button type="button" className="icon-btn danger" onClick={() => setExcluindo(linha)} title="Excluir">
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title={tela.titulo}
        subtitle={tela.subtitulo}
        actions={
          <Button size="sm" onClick={abrirNovo}>
            <Plus size={16} /> Novo
          </Button>
        }
      />
      {erro && <p className="form-error">{erro}</p>}
      <div className="toolbar">
        <div className="search-field">
          <Search size={16} />
          <Input placeholder="Buscar..." value={busca} onChange={(evento) => setBusca(evento.target.value)} />
        </div>
      </div>
      <div className="card card-padding">
        <Table columns={colunas} data={filtradas} keyExtractor={(linha) => String(linha.id)} />
      </div>

      <Modal
        open={aberto}
        onClose={() => setAberto(false)}
        title={editando ? `Editar ${tela.titulo.toLowerCase()}` : `Novo — ${tela.titulo.toLowerCase()}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setAberto(false)}>Cancelar</Button>
            <Button onClick={salvar}>Salvar</Button>
          </>
        }
      >
        <div className="form-grid">
          {tela.campos.map((campo) =>
            campo.tipo === 'opcoes' || campo.tipo === 'relacao' ? (
              <Select
                key={campo.nome}
                label={campo.rotulo}
                value={form[campo.nome] ?? ''}
                onChange={(evento) => setForm({ ...form, [campo.nome]: evento.target.value })}
              >
                <option value="">Selecione</option>
                {campo.tipo === 'opcoes'
                  ? campo.opcoes?.map((opcao) => (
                      <option key={opcao.valor} value={opcao.valor}>{opcao.rotulo}</option>
                    ))
                  : (relacionados[campo.recurso ?? ''] ?? []).map((item) => (
                      <option key={item.id} value={String(item.id)}>
                        {texto({ ...campo, tipo: 'relacao' }, item.id, relacionados)}
                      </option>
                    ))}
              </Select>
            ) : (
              <Input
                key={campo.nome}
                label={campo.rotulo}
                type={campo.tipo === 'numero' ? 'number' : campo.tipo === 'senha' ? 'password' : 'text'}
                hint={campo.tipo === 'senha' && editando ? 'Em branco mantém a senha atual.' : undefined}
                value={form[campo.nome] ?? ''}
                onChange={(evento) => setForm({ ...form, [campo.nome]: evento.target.value })}
              />
            )
          )}
        </div>
      </Modal>

      <Modal
        open={Boolean(excluindo)}
        onClose={() => setExcluindo(null)}
        title="Confirmar exclusão"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setExcluindo(null)}>Cancelar</Button>
            <Button variant="danger" onClick={confirmarExclusao}>Excluir</Button>
          </>
        }
      >
        <p>O registro será apagado do banco.</p>
      </Modal>
    </div>
  );
}
