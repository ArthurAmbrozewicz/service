import { pedir } from '@/api/banco';

/** Um passo de um Template Method. `classe` diz se o método foi escrito na mãe ou na filha. */
export type Passo = { metodo: string; classe: string; texto: string };

export type RespostaNotificacao = { classe: string; canal: string; texto: string; registro: number };
export type RespostaPreco = { classe: string; valor: number; resultado: number };
export type RespostaAlocacao = {
  classe: string;
  funcionario: { id: number; nome: string; especialidade: string; status: string } | null;
};
export type RespostaPagamento = {
  classe: string;
  classe_preco: string;
  valor_tabela: number;
  valor: number;
  texto: string;
  codigo: string;
  passos: Passo[];
  registro: number;
};
export type RespostaRelatorio = { classe: string; cabecalho: string; corpo: string[]; rodape: string; passos: Passo[] };
export type RespostaAtendimento = { classe: string; texto: string; passos: Passo[] };

/** POST /api/padroes/<nome>. O backend (backend/api/padroes.py) executa a classe filha escolhida. */
export function executarPadrao<T>(nome: string, corpo: Record<string, string | number>) {
  return pedir<T>(`/api/padroes/${nome}`, { method: 'POST', body: JSON.stringify(corpo) });
}

/** Texto do erro que a API devolveu, para mostrar na tela. */
export function mensagemDeErro(falha: unknown) {
  return falha instanceof Error ? falha.message : 'Não foi possível falar com o backend.';
}
