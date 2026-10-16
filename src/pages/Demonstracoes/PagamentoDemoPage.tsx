import { useEffect, useState } from 'react';
import { Banknote, CreditCard, Percent, QrCode, Tag, Wallet } from 'lucide-react';
import { listar, type Registro } from '@/api/banco';
import { executarPadrao, mensagemDeErro, type RespostaPagamento, type RespostaPreco } from '@/api/padroes';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { Badge } from '@/components/Badge/Badge';
import { Table, type Column } from '@/components/Table/Table';
import { formatCurrency } from '@/utils/format';
import { Opcoes, type Opcao } from '@/pages/Demonstracoes/comum';

// Regra de preço: Strategy (backend/preco_strategy.py).
const REGRAS: Opcao[] = [
  { valor: 'cheio', rotulo: 'Preço cheio', icone: <Tag size={16} /> },
  { valor: 'desconto', rotulo: 'Com desconto', icone: <Percent size={16} /> },
];

// Forma de pagamento: Template Method (backend/pagamento_method.py).
const METODOS: Opcao[] = [
  { valor: 'pix', rotulo: 'PIX', icone: <QrCode size={16} /> },
  { valor: 'cartao', rotulo: 'Cartão', icone: <CreditCard size={16} /> },
  { valor: 'dinheiro', rotulo: 'Dinheiro', icone: <Banknote size={16} /> },
];

export function PagamentoDemoPage() {
  const [agendamentos, setAgendamentos] = useState<Registro[]>([]);
  const [clientes, setClientes] = useState<Registro[]>([]);
  const [itens, setItens] = useState<Registro[]>([]);
  const [servicos, setServicos] = useState<Registro[]>([]);
  const [pagamentos, setPagamentos] = useState<Registro[]>([]);
  const [agendamentoId, setAgendamentoId] = useState('');
  const [valor, setValor] = useState('');
  const [regra, setRegra] = useState('cheio');
  const [percentual, setPercentual] = useState('10');
  const [metodo, setMetodo] = useState('pix');
  const [previa, setPrevia] = useState<RespostaPreco | null>(null);
  const [resposta, setResposta] = useState<RespostaPagamento | null>(null);
  const [erro, setErro] = useState('');

  const carregarPagamentos = () =>
    listar('pagamentos')
      .then((linhas) => setPagamentos(linhas.reverse().slice(0, 6)))
      .catch(() => undefined);

  useEffect(() => {
    listar('agendamentos')
      .then(setAgendamentos)
      .catch((falha) => setErro(mensagemDeErro(falha)));
    listar('clientes').then(setClientes).catch(() => undefined);
    listar('agendamento_servicos').then(setItens).catch(() => undefined);
    listar('servicos').then(setServicos).catch(() => undefined);
    carregarPagamentos();
  }, []);

  // A prévia do valor a pagar vem do PrecoService do backend, com a regra escolhida.
  useEffect(() => {
    let ativo = true;
    const numero = Number(valor);
    const pronto = valor !== '' && Number.isFinite(numero) && (regra === 'cheio' || percentual !== '');
    const pedido = pronto
      ? executarPadrao<RespostaPreco>('preco', { estrategia: regra, valor, percentual })
      : Promise.resolve(null);
    pedido
      .then((dados) => {
        if (ativo) setPrevia(dados);
      })
      .catch(() => {
        if (ativo) setPrevia(null);
      });
    return () => {
      ativo = false;
    };
  }, [valor, regra, percentual]);

  const nome = (lista: Registro[], id: string | number) => String(lista.find((linha) => linha.id === Number(id))?.nome ?? `#${id}`);
  const agendamento = agendamentos.find((linha) => String(linha.id) === agendamentoId);
  const itensDoAgendamento = itens.filter((item) => String(item.agendamento_id) === agendamentoId);
  const total = itensDoAgendamento.reduce((soma, item) => soma + Number(item.valor), 0);
  const desconto = previa ? previa.valor - previa.resultado : 0;

  const escolherAgendamento = (id: string) => {
    setAgendamentoId(id);
    const soma = itens
      .filter((item) => String(item.agendamento_id) === id)
      .reduce((acumulado, item) => acumulado + Number(item.valor), 0);
    setValor(soma > 0 ? String(soma) : '');
  };

  const pagar = async () => {
    setErro('');
    if (!agendamento) {
      setErro('Escolha o agendamento.');
      return;
    }
    try {
      const corpo = {
        metodo,
        estrategia: regra,
        percentual,
        agendamento_id: agendamento.id,
        cliente_id: agendamento.cliente_id,
        valor: valor || '0',
      };
      setResposta(await executarPadrao<RespostaPagamento>('pagamento', corpo));
      carregarPagamentos();
    } catch (falha) {
      setResposta(null);
      setErro(mensagemDeErro(falha));
    }
  };

  const colunas: Column<Registro>[] = [
    { key: 'id', header: 'Id', render: (linha) => String(linha.id) },
    { key: 'cliente', header: 'Cliente', render: (linha) => nome(clientes, linha.cliente_id) },
    { key: 'metodo', header: 'Método', render: (linha) => String(linha.metodo) },
    { key: 'valor', header: 'Valor', render: (linha) => formatCurrency(Number(linha.valor)) },
    {
      key: 'status',
      header: 'Status',
      render: (linha) => <Badge variant={linha.status === 'pago' ? 'success' : 'warning'}>{String(linha.status)}</Badge>,
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title="Checkout de pagamento"
        subtitle="Escolha o agendamento, a regra de preço e a forma de pagamento. A regra calcula o valor; a forma de pagamento cobra sempre na mesma ordem."
      />
      <div className="demo-estreito">
        <div className="card card-padding">
          <h3>Pagamento</h3>
          <div className="form-grid">
            <Select label="Agendamento" value={agendamentoId} onChange={(evento) => escolherAgendamento(evento.target.value)}>
              <option value="">Selecione</option>
              {agendamentos.map((linha) => (
                <option key={linha.id} value={String(linha.id)}>
                  #{linha.id} · {linha.data} {linha.hora} · {nome(clientes, linha.cliente_id)}
                </option>
              ))}
            </Select>
            {agendamento && (
              <div className="demo-resumo">
                <strong>{nome(clientes, agendamento.cliente_id)}</strong>
                {itensDoAgendamento.length > 0 ? (
                  <ul>
                    {itensDoAgendamento.map((item) => (
                      <li key={item.id}>
                        {nome(servicos, item.servico_id)} · {formatCurrency(Number(item.valor))}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted-text">Agendamento sem serviços lançados. Digite o valor.</p>
                )}
                {total > 0 && <p>Total: {formatCurrency(total)}</p>}
              </div>
            )}
            <Input label="Valor de tabela" type="number" value={valor} onChange={(evento) => setValor(evento.target.value)} />
            <Opcoes rotulo="Regra de preço" opcoes={REGRAS} valor={regra} onChange={setRegra} />
            {regra === 'desconto' && (
              <Input
                label="Desconto (%)"
                type="number"
                value={percentual}
                onChange={(evento) => setPercentual(evento.target.value)}
              />
            )}
            {previa && (
              <div className="demo-resumo">
                <span className="muted-text">Valor a pagar</span>
                <p className="demo-valor">{formatCurrency(previa.resultado)}</p>
                {desconto > 0 ? (
                  <p className="muted-text">
                    De <s>{formatCurrency(previa.valor)}</s>, desconto de {formatCurrency(desconto)}.
                  </p>
                ) : (
                  <p className="muted-text">Sem desconto: igual ao valor de tabela.</p>
                )}
              </div>
            )}
            <Opcoes rotulo="Forma de pagamento" opcoes={METODOS} valor={metodo} onChange={setMetodo} />
            <div className="form-actions">
              <Button onClick={pagar}>
                <Wallet size={16} /> Pagar
                {previa ? ` ${formatCurrency(previa.resultado)}` : ''} com{' '}
                {METODOS.find((opcao) => opcao.valor === metodo)?.rotulo}
              </Button>
            </div>
            {erro && <p className="form-error">{erro}</p>}
            {resposta && (
              <p className="demo-destaque">
                Pagamento aprovado: {resposta.codigo}. Cobrado {formatCurrency(resposta.valor)}
                {resposta.valor < resposta.valor_tabela ? ` (de ${formatCurrency(resposta.valor_tabela)})` : ''}. Gravado
                em pagamentos com id {resposta.registro}.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="card card-padding">
        <h3>Últimos pagamentos</h3>
        <Table columns={colunas} data={pagamentos} keyExtractor={(linha) => String(linha.id)} />
      </div>
    </div>
  );
}
