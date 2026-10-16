import { useEffect, useState } from 'react';
import { ClipboardCheck, PawPrint, Scissors } from 'lucide-react';
import { listar, type Registro } from '@/api/banco';
import { executarPadrao, mensagemDeErro, type RespostaAtendimento } from '@/api/padroes';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { Select } from '@/components/Select/Select';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { getTodayISO } from '@/utils/format';
import { Opcoes, type Opcao } from '@/pages/Demonstracoes/comum';

const SEGMENTOS: Opcao[] = [
  { valor: 'petshop', rotulo: 'Petshop', icone: <PawPrint size={16} /> },
  { valor: 'barbearia', rotulo: 'Barbearia', icone: <Scissors size={16} /> },
];

export function AtendimentoDemoPage() {
  const { config } = useBusinessConfig();
  const [agendamentos, setAgendamentos] = useState<Registro[]>([]);
  const [agendamentoId, setAgendamentoId] = useState('');
  // Começa no segmento do negócio atual quando existe subclasse para ele.
  const [segmento, setSegmento] = useState(config.segment === 'barbearia' ? 'barbearia' : 'petshop');
  const [data, setData] = useState(getTodayISO());
  const [hora, setHora] = useState('10:00');
  const [resposta, setResposta] = useState<RespostaAtendimento | null>(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    listar('agendamentos')
      .then(setAgendamentos)
      .catch((falha) => setErro(mensagemDeErro(falha)));
  }, []);

  const escolherAgendamento = (id: string) => {
    setAgendamentoId(id);
    const agendamento = agendamentos.find((linha) => String(linha.id) === id);
    if (agendamento) {
      setData(String(agendamento.data));
      setHora(String(agendamento.hora));
    }
  };

  const realizar = async () => {
    setErro('');
    try {
      setResposta(await executarPadrao<RespostaAtendimento>('atendimento', { segmento, data, hora }));
    } catch (falha) {
      setResposta(null);
      setErro(mensagemDeErro(falha));
    }
  };


  return (
    <div className="page">
      <PageHeader
        title="Atendimento por segmento"
        subtitle="Realize um atendimento. Todo segmento prepara, atende e conclui nessa ordem; o começo e o fim mudam."
      />
      <div className="demo-estreito">
        <div className="card card-padding">
          <h3>Atendimento</h3>
          <div className="form-grid">
            <Opcoes rotulo="Segmento" opcoes={SEGMENTOS} valor={segmento} onChange={setSegmento} />
            <Select label="Agendamento" value={agendamentoId} onChange={(evento) => escolherAgendamento(evento.target.value)}>
              <option value="">Informar data e hora</option>
              {agendamentos.map((linha) => (
                <option key={linha.id} value={String(linha.id)}>
                  #{linha.id} · {linha.data} {linha.hora}
                </option>
              ))}
            </Select>
            <div className="form-grid form-grid-2">
              <Input label="Data" type="date" value={data} onChange={(evento) => setData(evento.target.value)} />
              <Input label="Hora" type="time" value={hora} onChange={(evento) => setHora(evento.target.value)} />
            </div>
            <div className="form-actions">
              <Button onClick={realizar}>
                <ClipboardCheck size={16} /> Realizar atendimento
              </Button>
            </div>
            {erro && <p className="form-error">{erro}</p>}
            {resposta && <p className="demo-destaque">{resposta.texto.split(' | ').join(' → ')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
