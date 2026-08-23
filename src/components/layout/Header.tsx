import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Shield } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/auth';

export default function Header() {
  const { profile, isAuthenticated, isEditor } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-ink-900 text-paper-50 border-b border-ink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight shrink-0">
          Encyclios
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-body text-sm text-ink-100">
          <Link to="/edicoes" className="hover:text-brass-400 transition-colors">Edições</Link>
          <Link to="/autores" className="hover:text-brass-400 transition-colors">Autores</Link>
          <Link to="/pesquisa" className="hover:text-brass-400 transition-colors flex items-center gap-1.5">
            <Search size={15} /> Pesquisar
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {isEditor && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 text-sm text-brass-400 hover:text-brass-300 transition-colors"
                >
                  <Shield size={14} /> Painel admin
                </Link>
              )}
              <Link
                to="/dashboard"
                className="text-sm text-ink-100 hover:text-brass-400 transition-colors"
              >
                {profile?.name}
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  navigate('/');
                }}
                className="text-sm px-3 py-1.5 rounded-sm border border-ink-500 hover:border-brass-500 hover:text-brass-400 transition-colors"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-ink-100 hover:text-brass-400 transition-colors">
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="text-sm px-3 py-1.5 rounded-sm bg-brass-500 text-ink-950 font-medium hover:bg-brass-400 transition-colors"
              >
                Criar conta
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Abrir menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-ink-700 px-4 py-4 flex flex-col gap-3 font-body text-sm">
          <Link to="/edicoes" onClick={() => setMenuOpen(false)}>Edições</Link>
          <Link to="/autores" onClick={() => setMenuOpen(false)}>Autores</Link>
          <Link to="/pesquisa" onClick={() => setMenuOpen(false)}>Pesquisar</Link>
          {isAuthenticated ? (
            <>
              {isEditor && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-brass-400">
                  Painel admin
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Meu painel</Link>
              <button
                className="text-left"
                onClick={async () => {
                  await signOut();
                  setMenuOpen(false);
                  navigate('/');
                }}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Entrar</Link>
              <Link to="/cadastro" onClick={() => setMenuOpen(false)}>Criar conta</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}