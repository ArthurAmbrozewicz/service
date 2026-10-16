import { useEffect, useState } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';
import { listar, type Registro } from '@/api/banco';
import { executarPadrao, mensagemDeErro, type RespostaNotificacao } from '@/api/padroes';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { Textarea } from '@/components/Textarea/Textarea';
import { Badge } from '@/components/Badge/Badge';
import { Table, type Column } from '@/components/Table/Table';
import { Opcoes, type Opcao } from '@/pages/Demonstracoes/comum';

const CANAIS: Opcao[] = [
  { valor: 'email', rotulo: 'E-mail', icone: <Mail size={16} /> },
  { valor: 'whatsapp', rotulo: 'WhatsApp', icone: <MessageCircle size={16} /> },
];

// Campo do cliente que vira o destino de cada canal.
const CAMPO_DESTINO: Record<string, string> = { email: 'email', whatsapp: 'telefone' };

export function NotificacaoDemoPage() {
  const [clientes, setClientes] = useState<Registro[]>([]);
  const [historico, setHistorico] = useState<Registro[]>([]);
  const [canal, setCanal] = useState('email');
  const [clienteId, setClienteId] = useState('');
  const [destino, setDestino] = useState('');
  const [tipo, setTipo] = useState('lembrete');
  const [titulo, setTitulo] = useState('Lembrete de horário');
  const [mensagem, setMensagem] = useState('Olá! Seu horário está marcado para amanhã às 10:00.');
  const [resposta, setResposta] = useState<RespostaNotificacao | null>(null);
  const [erro, setErro] = useState('');

  const carregarHistorico = () =>
    listar('notificacoes')
      .then((linhas) => setHistorico(linhas.filter((linha) => linha.canal).reverse().slice(0, 8)))
      .catch(() => undefined);

  useEffect(() => {
    listar('clientes')
      .then(setClientes)
      .catch((falha) => setErro(mensagemDeErro(falha)));
    carregarHistorico();
  }, []);

  // Trocar o cliente ou o canal preenche o destino com o e-mail ou o telefone do cadastro.
  const preencherDestino = (novoCanal: string, novoCliente: string) => {
    const cliente = clientes.find((linha) => String(linha.id) === novoCliente);
    setDestino(cliente ? String(cliente[CAMPO_DESTINO[novoCanal]] ?? '') : '');
  };

  const enviar = async () => {
    setErro('');
    if (!clienteId) {
      setErro('Escolha o cliente.');
      return;
    }
    try {
      const corpo = { canal, usuario_id: clienteId, destino, tipo, titulo, mensagem };
      setResposta(await executarPadrao<RespostaNotificacao>('notificacao', corpo));
      carregarHistorico();
    } catch (falha) {
      setResposta(null);
      setErro(mensagemDeErro(falha));
    }
  };

  const nomeCliente = (id: string | number) => clientes.find((linha) => linha.id === Number(id))?.nome ?? `#${id}`;

  const colunas: Column<Registro>[] = [
    { key: 'data', header: 'Data', render: (linha) => String(linha.data) },
    { key: 'cliente', header: 'Cliente', render: (linha) => nomeCliente(linha.usuario_id) },
    {
      key: 'canal',
      header: 'Canal',
      render: (linha) => (
        <Badge variant={linha.canal === 'whatsapp' ? 'success' : 'info'}>
          {linha.canal === 'whatsapp' ? 'WhatsApp' : 'E-mail'}
        </Badge>
      ),
    },
    { key: 'destino', header: 'Destino', render: (linha) => String(linha.destino) },
    { key: 'titulo', header: 'Título', render: (linha) => String(linha.titulo) },
  ];


  return (
    <div className="page">
      <PageHeader
        title="Envio de notificações"
        subtitle="Cadastre um aviso e escolha o canal. Cada canal é uma estratégia com regras próprias. O envio é simulado e fica gravado no banco."
      />
      <div className="dashboard-grid">
        <div className="card card-padding">
          <h3>Nova notificação</h3>
          <div className="form-grid">
            <Opcoes
              rotulo="Canal de envio"
              opcoes={CANAIS}
              valor={canal}
              onChange={(valor) => {
                setCanal(valor);
                preencherDestino(valor, clienteId);
              }}
            />
            <Select
              label="Cliente"
              value={clienteId}
              onChange={(evento) => {
                setClienteId(evento.target.value);
                preencherDestino(canal, evento.target.value);
              }}
            >
              <option value="">Selecione</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={String(cliente.id)}>{cliente.nome}</option>
              ))}
            </Select>
            <Input
              label={canal === 'email' ? 'E-mail do cliente' : 'WhatsApp do cliente'}
              value={destino}
              placeholder={canal === 'email' ? 'nome@dominio.com' : '(11) 98765-4321'}
              hint="Vem do cadastro do cliente. Pode editar para testar a validação do canal."
              onChange={(evento) => setDestino(evento.target.value)}
            />
            <Select label="Tipo de aviso" value={tipo} onChange={(evento) => setTipo(evento.target.value)}>
              <option value="confirmacao">Confirmação</option>
              <option value="lembrete">Lembrete</option>
              <option value="alteracao">Alteração</option>
              <option value="cancelamento">Cancelamento</option>
            </Select>
            <Input label="Título" value={titulo} onChange={(evento) => setTitulo(evento.target.value)} />
            <Textarea label="Mensagem" rows={3} value={mensagem} onChange={(evento) => setMensagem(evento.target.value)} />
            <div className="form-actions">
              <Button onClick={enviar}>
                <Send size={16} /> Enviar por {canal === 'email' ? 'e-mail' : 'WhatsApp'}
              </Button>
            </div>
            {erro && <p className="form-error">{erro}</p>}
          </div>
        </div>

        <div className="card card-padding">
          <h3>Mensagem enviada</h3>
          {resposta ? (
            <>
              <pre className={resposta.canal === 'whatsapp' ? 'demo-whatsapp' : 'demo-email'}>{resposta.texto}</pre>
              <p className="muted-text mt-8">Gravada em notificacoes com id {resposta.registro}.</p>
            </>
          ) : (
            <p className="muted-text">A mensagem aparece aqui no formato do canal depois do envio.</p>
          )}
        </div>
      </div>

      <div className="card card-padding">
        <h3>Últimos envios</h3>
        <Table
          columns={colunas}
          data={historico}
          keyExtractor={(linha) => String(linha.id)}
          emptyMessage="Nenhuma notificação enviada por canal ainda."
        />
      </div>
    </div>
  );
}
