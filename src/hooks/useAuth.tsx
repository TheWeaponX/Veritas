import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { fetchProfile } from '../services/auth';
import type { UserProfile } from '../types/database.types';

interface AuthContextValue {
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  // isEditor é true tanto para 'editor' quanto para 'admin' — ambos
  // gerenciam conteúdo (revisão, temas, tags). isAdmin fica reservado
  // para gestão de usuários e área exclusiva do administrador.
  isEditor: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(userId: string | undefined) {
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      const data = await fetchProfile(userId);
      setProfile(data as UserProfile);
    } catch {
      setProfile(null);
    }
  }

  useEffect(() => {
    // Sessão inicial (funciona em qualquer dispositivo em que o usuário
    // fizer login — os dados vêm do Supabase, não de storage local).
    supabase.auth.getSession().then(({ data }) => {
      loadProfile(data.session?.user.id).finally(() => setLoading(false));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user.id);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        profile,
        loading,
        isAuthenticated: !!profile,
        isAdmin: profile?.role === 'admin',
        isEditor: profile?.role === 'editor' || profile?.role === 'admin',
        refreshProfile: async () => {
          const { data } = await supabase.auth.getSession();
          await loadProfile(data.session?.user.id);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
