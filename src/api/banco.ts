export type Registro = { id: number } & Record<string, string | number>;

async function pedir<T>(caminho: string, opcoes?: RequestInit): Promise<T> {
  const resposta = await fetch(caminho, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...opcoes?.headers },
  });
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados.erro ?? 'Não foi possível falar com o banco.');
  }
  return dados as T;
}

export function listar(recurso: string) {
  return pedir<Registro[]>(`/api/${recurso}`);
}

export function criar(recurso: string, corpo: Record<string, string | number>) {
  return pedir<Registro>(`/api/${recurso}`, { method: 'POST', body: JSON.stringify(corpo) });
}

export function atualizar(recurso: string, id: number, corpo: Record<string, string | number>) {
  return pedir<Registro>(`/api/${recurso}/${id}`, { method: 'PUT', body: JSON.stringify(corpo) });
}

export function excluir(recurso: string, id: number) {
  return pedir<{ ok: boolean }>(`/api/${recurso}/${id}`, { method: 'DELETE' });
}

export function entrar(email: string, senha: string) {
  return pedir<{ id: number; nome: string; email: string; papel: string }>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}
