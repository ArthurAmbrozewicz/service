import type { ReactNode } from 'react';
import { Button } from '@/components/Button/Button';

export type Opcao = { valor: string; rotulo: string; icone?: ReactNode };

/** Botões lado a lado para escolher a classe filha. */
export function Opcoes({
  rotulo,
  opcoes,
  valor,
  onChange,
}: {
  rotulo: string;
  opcoes: Opcao[];
  valor: string;
  onChange: (valor: string) => void;
}) {
  return (
    <div className="field">
      <span className="field-label">{rotulo}</span>
      <div className="demo-opcoes">
        {opcoes.map((opcao) => (
          <Button
            key={opcao.valor}
            type="button"
            size="sm"
            variant={opcao.valor === valor ? 'primary' : 'outline'}
            onClick={() => onChange(opcao.valor)}
          >
            {opcao.icone}
            {opcao.rotulo}
          </Button>
        ))}
      </div>
    </div>
  );
}
