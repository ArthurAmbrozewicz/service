import { useEffect, useState } from 'react';
import { ListOrdered, Sparkles, UserCheck } from 'lucide-react';
import { listar, type Registro } from '@/api/banco';
import { executarPadrao, mensagemDeErro, type RespostaAlocacao } from '@/api/padroes';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/Button/Button';
import { Select } from '@/components/Select/Select';
import { Badge } from '@/components/Badge/Badge';
import { Table, type Column } from '@/components/Table/Table';
import { Opcoes, type Opcao } from '@/pages/Demonstracoes/comum';

const ESTRATEGIAS: Opcao[] = [
  { valor: 'primeiro_ativo', rotulo: 'Primeiro ativo', icone: <ListOrdered size={16} /> },
  { valor: 'por_especialidade', rotulo: 'Por especialidade', icone: <Sparkles size={16} /> },
];

export function AlocacaoDemoPage() {
  const [funcionarios, setFuncionarios] = useState<Registro[]>([]);
  const [estrategia, setEstrategia] = useState('primeiro_ativo');
  const [especialidade, setEspecialidade] = useState('');
  const [resposta, setResposta] = useState<RespostaAlocacao | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    listar('funcionarios')
      .then(setFuncionarios)
      .catch((falha) => setErro(mensagemDeErro(falha)));
  }, []);

  const especialidades = [...new Set(funcionarios.map((linha) => String(linha.especialidade)))];

  const alocar = async () => {
    setErro('');
    if (estrategia === 'por_especialidade' && !especialidade) {
      setErro('Escolha a especialidade.');
      return;
    }
    try {
      setResposta(await executarPadrao<RespostaAlocacao>('alocacao', { estrategia, especialidade }));
    } catch (falha) {
      setResposta(null);
      setErro(mensagemDeErro(falha));
    }
  };

  const escolhidoId = resposta?.funcionario?.id;

  const colunas: Column<Registro>[] = [
    { key: 'ordem', header: 'Ordem', render: (linha) => String(funcionarios.indexOf(linha) + 1) },
    { key: 'nome', header: 'Nome', render: (linha) => String(linha.nome) },
    { key: 'especialidade', header: 'Especialidade', render: (linha) => String(linha.especialidade) },
    {
      key: 'status',
      header: 'Status',
      render: (linha) => (
        <Badge variant={linha.status === 'ativo' ? 'success' : 'neutral'}>{String(linha.status)}</Badge>
      ),
    },
    {
      key: 'escolhido',
      header: 'Alocação',
      render: (linha) => (linha.id === escolhidoId ? <Badge variant="info">Escolhido</Badge> : ''),
    },
  ];


  return (
    <div className="page">
      <PageHeader
        title="Alocação de profissional"
        subtitle="Escolha a regra que decide quem atende. A mesma lista de funcionários, regras diferentes."
      />
      <div className="demo-estreito">
        <div className="card card-padding">
          <h3>Regra de alocação</h3>
          <div className="form-grid">
            <Opcoes rotulo="Estratégia" opcoes={ESTRATEGIAS} valor={estrategia} onChange={setEstrategia} />
            {estrategia === 'por_especialidade' && (
              <Select label="Especialidade" value={especialidade} onChange={(evento) => setEspecialidade(evento.target.value)}>
                <option value="">Selecione</option>
                {especialidades.map((nome) => (
                  <option key={nome} value={nome}>{nome}</option>
                ))}
              </Select>
            )}
            <div className="form-actions">
              <Button onClick={alocar}>
                <UserCheck size={16} /> Alocar profissional
              </Button>
            </div>
            {erro && <p className="form-error">{erro}</p>}
            {resposta && (
              <p className="demo-destaque">
                {resposta.funcionario
                  ? `${resposta.funcionario.nome} (${resposta.funcionario.especialidade}) vai atender.`
                  : 'Nenhum funcionário ativo atende essa regra.'}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card card-padding">
        <h3>Funcionários no banco</h3>
        <Table columns={colunas} data={funcionarios} keyExtractor={(linha) => String(linha.id)} />
      </div>
    </div>
  );
}
