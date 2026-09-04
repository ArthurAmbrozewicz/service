import { BrowserRouter } from 'react-router-dom';
import { BusinessConfigProvider } from '@/context/BusinessConfigProvider';
import { PetsProvider } from '@/context/PetsContext';
import { AppRoutes } from '@/routes';

export default function App() {
  return (
    <BusinessConfigProvider>
      <PetsProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </PetsProvider>
    </BusinessConfigProvider>
  );
}
