import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/Login/LoginPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { AgendaPage } from '@/pages/Agenda/AgendaPage';
import { ClienteDetalhesPage } from '@/pages/ClienteDetalhes/ClienteDetalhesPage';
import { ServicosPage } from '@/pages/Servicos/ServicosPage';
import { AgendamentoPage } from '@/pages/Agendamento/AgendamentoPage';
import { PagamentosPage } from '@/pages/Pagamentos/PagamentosPage';
import { NotificacoesPage } from '@/pages/Notificacoes/NotificacoesPage';
import { ProfissionaisPage } from '@/pages/Profissionais/ProfissionaisPage';
import { ModuloSegmentoPage } from '@/pages/ModuloSegmento/ModuloSegmentoPage';
import { PersonalizacaoPage } from '@/pages/Personalizacao/PersonalizacaoPage';
import { ModulosPage } from '@/pages/Modulos/ModulosPage';
import { NotificacaoDemoPage } from '@/pages/Demonstracoes/NotificacaoDemoPage';
import { AlocacaoDemoPage } from '@/pages/Demonstracoes/AlocacaoDemoPage';
import { PagamentoDemoPage } from '@/pages/Demonstracoes/PagamentoDemoPage';
import { RelatorioDemoPage } from '@/pages/Demonstracoes/RelatorioDemoPage';
import { AtendimentoDemoPage } from '@/pages/Demonstracoes/AtendimentoDemoPage';
import {
  AgendamentosBancoPage,
  ClientesBancoPage,
  EstabelecimentoBancoPage,
  FuncionariosBancoPage,
  HorariosBancoPage,
  ItensAgendamentoBancoPage,
  ConfiguracoesBancoPage,
  ModulosBancoPage,
  NotificacoesBancoPage,
  PagamentosBancoPage,
  ServicoFuncionariosBancoPage,
  ServicosBancoPage,
} from '@/pages/banco/paginas';
import { storage } from '@/utils/storage';

function ProtectedRoute() {
  if (!storage.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/agenda" element={<AgendaPage />} />
          <Route path="/clientes" element={<ClientesBancoPage />} />
          <Route path="/clientes/:id" element={<ClienteDetalhesPage />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/agendamentos/novo" element={<AgendamentoPage />} />
          <Route path="/pagamentos" element={<PagamentosPage />} />
          <Route path="/notificacoes" element={<NotificacoesPage />} />
          <Route path="/profissionais" element={<ProfissionaisPage />} />
          <Route path="/modulo" element={<ModuloSegmentoPage />} />
          <Route path="/personalizacao" element={<PersonalizacaoPage />} />
          <Route path="/modulos" element={<ModulosPage />} />
          <Route path="/demonstracoes/notificacoes" element={<NotificacaoDemoPage />} />
          <Route path="/demonstracoes/alocacao" element={<AlocacaoDemoPage />} />
          <Route path="/demonstracoes/pagamento" element={<PagamentoDemoPage />} />
          <Route path="/demonstracoes/relatorios" element={<RelatorioDemoPage />} />
          <Route path="/demonstracoes/atendimento" element={<AtendimentoDemoPage />} />
          <Route path="/banco/clientes" element={<Navigate to="/clientes" replace />} />
          <Route path="/banco/funcionarios" element={<FuncionariosBancoPage />} />
          <Route path="/banco/servicos" element={<ServicosBancoPage />} />
          <Route path="/banco/horarios" element={<HorariosBancoPage />} />
          <Route path="/banco/agendamentos" element={<AgendamentosBancoPage />} />
          <Route path="/banco/itens" element={<ItensAgendamentoBancoPage />} />
          <Route path="/banco/pagamentos" element={<PagamentosBancoPage />} />
          <Route path="/banco/notificacoes" element={<NotificacoesBancoPage />} />
          <Route path="/banco/estabelecimento" element={<EstabelecimentoBancoPage />} />
          <Route path="/banco/modulos" element={<ModulosBancoPage />} />
          <Route path="/banco/servico-funcionarios" element={<ServicoFuncionariosBancoPage />} />
          <Route path="/banco/configuracoes" element={<ConfiguracoesBancoPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
