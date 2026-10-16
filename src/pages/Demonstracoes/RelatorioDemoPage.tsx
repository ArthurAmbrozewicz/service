import { useState } from 'react';
import { CalendarDays, DollarSign, FileText } from 'lucide-react';
import { executarPadrao, mensagemDeErro, type RespostaRelatorio } from '@/api/padroes';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Button } from '@/components/Button/Button';
import { Badge } from '@/components/Badge/Badge';
import { Opcoes, type Opcao } from '@/pages/Demonstracoes/comum';

const TIPOS: Opcao[] = [
  { valor: 'agenda', rotulo: 'Agenda', icone: <CalendarDays size={16} /> },
  { valor: 'financeiro', rotulo: 'Financeiro', icone: <DollarSign size={16} /> },
];

export function RelatorioDemoPage() {
  const [tipo, setTipo] = useState('agenda');
  const [resposta, setResposta] = useState<RespostaRelatorio | null>(null);
  const [erro, setErro] = useState('');

  const gerar = async () => {
    setErro('');
    try {
      setResposta(await executarPadrao<RespostaRelatorio>('relatorio', { tipo }));
    } catch (falha) {
      setResposta(null);
      setErro(mensagemDeErro(falha));
    }
  };


  return (
    <div className="page">
      <PageHeader
        title="Relatórios"
        subtitle="Gere o relatório da agenda ou o financeiro. Os dois têm cabeçalho, corpo e rodapé na mesma ordem; só o conteúdo muda."
      />
      <div className="demo-estreito">
        <div className="card card-padding">
          <h3>Gerar relatório</h3>
          <div className="form-grid">
            <Opcoes rotulo="Relatório" opcoes={TIPOS} valor={tipo} onChange={setTipo} />
            <div className="form-actions">
              <Button onClick={gerar}>
                <FileText size={16} /> Gerar relatório
              </Button>
            </div>
            {erro && <p className="form-error">{erro}</p>}
          </div>
          {resposta && (
            <div className="demo-documento mt-16">
              <div className="demo-parte">
                <Badge variant="neutral">cabeçalho · mãe</Badge>
                <strong>{resposta.cabecalho}</strong>
              </div>
              <div className="demo-parte">
                <Badge variant="success">corpo · filha</Badge>
                {resposta.corpo.length > 0 ? (
                  <ul>
                    {resposta.corpo.map((linha, indice) => (
                      <li key={`${linha}-${indice}`}>{linha}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="muted-text">Sem registros.</span>
                )}
              </div>
              <div className="demo-parte">
                <Badge variant="neutral">rodapé · mãe</Badge>
                <span>{resposta.rodape}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
