import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/Input/Input';
import { Button } from '@/components/Button/Button';
import { entrar } from '@/api/banco';
import { storage } from '@/utils/storage';
import { useBusinessConfig } from '@/context/BusinessConfigContext';
import { SEGMENT_LABELS } from '@/config/business';

export function LoginPage() {
  const [email, setEmail] = useState('leo@email.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { config } = useBusinessConfig();

  const enter = () => {
    storage.setAuthenticated(true);
    navigate('/dashboard');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setError('');
    try {
      await entrar(email, password);
      enter();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <div className="login-brand">
          <div className="brand-logo brand-logo-lg">{config.logoInitials}</div>
          <h1>Service</h1>
          <p>Plataforma de agendamento e gestão para negócios de serviços locais</p>
          <span className="login-segment-chip">{SEGMENT_LABELS[config.segment]} · {config.businessName}</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Entrar</h2>
          <Input
            label="E-mail"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            autoComplete="username"
          />
          <div className="password-field">
            <Input
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
          <Button type="submit" fullWidth size="lg">
            Entrar
          </Button>
          <button type="button" className="link-btn">
            Esqueci minha senha
          </button>
          <div className="login-divider">
            <span>ou</span>
          </div>
          <Button type="button" variant="outline" fullWidth onClick={enter}>
            Visualizar demonstração
          </Button>
          <p className="login-hint">Contas iniciais: leo@email.com e ana@email.com. Senha: 123. A demonstração entra sem senha.</p>
        </form>
      </div>
    </div>
  );
}
