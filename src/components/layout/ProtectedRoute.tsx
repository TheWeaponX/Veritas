import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <PageLoading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export function RequireAdmin({ children }: { children: JSX.Element }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <PageLoading />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return children;
}

// Para telas de conteúdo (revisão, temas, tags) que editor E admin acessam.
// Gestão de usuários continua exclusiva de RequireAdmin.
export function RequireEditor({ children }: { children: JSX.Element }) {
  const { isEditor, loading } = useAuth();
  if (loading) return <PageLoading />;
  if (!isEditor) return <Navigate to="/" replace />;
  return children;
}

function PageLoading() {
  return <div className="flex items-center justify-center h-64 text-sm text-ink-500">Carregando...</div>;
}
