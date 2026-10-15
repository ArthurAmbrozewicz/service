import { BrowserRouter } from 'react-router-dom';
import { BusinessConfigProvider } from '@/context/BusinessConfigProvider';
import { DadosProvider } from '@/context/DadosContext';
import { AppRoutes } from '@/routes';

export default function App() {
  return (
    <BusinessConfigProvider>
      <DadosProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DadosProvider>
    </BusinessConfigProvider>
  );
}
