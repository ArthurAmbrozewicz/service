import { CrudTela } from '@/pages/banco/CrudTela';

function pagina(recurso: string) {
  return function Tela() {
    return <CrudTela recurso={recurso} />;
  };
}

export const ClientesBancoPage = pagina('clientes');
export const FuncionariosBancoPage = pagina('funcionarios');
export const ServicosBancoPage = pagina('servicos');
export const HorariosBancoPage = pagina('horarios');
export const AgendamentosBancoPage = pagina('agendamentos');
export const ItensAgendamentoBancoPage = pagina('agendamento_servicos');
export const PagamentosBancoPage = pagina('pagamentos');
export const NotificacoesBancoPage = pagina('notificacoes');
export const EstabelecimentoBancoPage = pagina('estabelecimentos');
export const ModulosBancoPage = pagina('modulos');
export const ServicoFuncionariosBancoPage = pagina('servico_funcionarios');
export const ConfiguracoesBancoPage = pagina('configuracoes');
