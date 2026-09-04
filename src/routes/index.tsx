import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { LoginPage } from '@/pages/Login/LoginPage';
import { DashboardPage } from '@/pages/Dashboard/DashboardPage';
import { AgendaPage } from '@/pages/Agenda/AgendaPage';
import { ClientesPage } from '@/pages/Clientes/ClientesPage';
import { ClienteDetalhesPage } from '@/pages/ClienteDetalhes/ClienteDetalhesPage';
import { ServicosPage } from '@/pages/Servicos/ServicosPage';
import { AgendamentoPage } from '@/pages/Agendamento/AgendamentoPage';
import { PagamentosPage } from '@/pages/Pagamentos/PagamentosPage';
import { NotificacoesPage } from '@/pages/Notificacoes/NotificacoesPage';
import { ProfissionaisPage } from '@/pages/Profissionais/ProfissionaisPage';
import { ModuloSegmentoPage } from '@/pages/ModuloSegmento/ModuloSegmentoPage';
import { PersonalizacaoPage } from '@/pages/Personalizacao/PersonalizacaoPage';
import { ModulosPage } from '@/pages/Modulos/ModulosPage';
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
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/clientes/:id" element={<ClienteDetalhesPage />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/agendamentos/novo" element={<AgendamentoPage />} />
          <Route path="/pagamentos" element={<PagamentosPage />} />
          <Route path="/notificacoes" element={<NotificacoesPage />} />
          <Route path="/profissionais" element={<ProfissionaisPage />} />
          <Route path="/modulo" element={<ModuloSegmentoPage />} />
          <Route path="/personalizacao" element={<PersonalizacaoPage />} />
          <Route path="/modulos" element={<ModulosPage />} />
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
