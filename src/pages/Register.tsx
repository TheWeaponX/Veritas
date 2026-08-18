import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../services/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await signUp(name, email, password);
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Confira seu e-mail</h1>
        <p className="text-sm text-ink-500 mb-6">
          Enviamos um link de confirmação para <strong>{email}</strong>. Confirme para poder entrar.
        </p>
        <button onClick={() => navigate('/login')} className="text-brass-600 hover:text-brass-500 text-sm">
          Ir para o login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="font-display text-2xl font-semibold mb-1">Criar conta</h1>
      <p className="text-sm text-ink-500 mb-8">Crie sua conta de autor para publicar artigos.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Nome" type="text" value={name} onChange={setName} required />
        <Field label="E-mail" type="email" value={email} onChange={setEmail} required />
        <Field label="Senha" type="password" value={password} onChange={setPassword} required />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-ink-900 text-paper-50 py-2.5 rounded-sm font-medium hover:bg-ink-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p className="text-sm text-ink-500 text-center mt-2">
          Já tem conta? <Link to="/login" className="text-brass-600 hover:text-brass-500">Entrar</Link>
        </p>
      </form>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  required,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-ink-700 font-medium">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="border border-ink-100 rounded-sm px-3 py-2.5 outline-none focus:border-brass-500 bg-paper-50"
      />
    </label>
  );
}
