import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AdminHome() {
  const [counts, setCounts] = useState<{ users: number; articles: number; published: number; submitted: number } | null>(null);

  useEffect(() => {
    (async () => {
      const [users, articles, published, submitted] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
      ]);
      setCounts({
        users: users.count ?? 0,
        articles: articles.count ?? 0,
        published: published.count ?? 0,
        submitted: submitted.count ?? 0,
      });
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-6">Painel administrativo</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Stat label="Usuários" value={counts?.users} />
        <Stat label="Artigos" value={counts?.articles} />
        <Stat label="Publicados" value={counts?.published} />
        <Stat label="Aguardando revisão" value={counts?.submitted} />
      </div>

      {counts && counts.submitted > 0 && (
        <Link
          to="/admin/revisoes"
          className="inline-block bg-brass-500 hover:bg-brass-400 text-ink-950 text-sm font-medium px-4 py-2 rounded-sm"
        >
          {counts.submitted} artigo(s) aguardando sua revisão →
        </Link>
      )}

      <p className="text-sm text-ink-500 mt-10">
        Gestão de usuários, temas e tags entra na próxima etapa.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="border border-ink-100 rounded-sm p-4 bg-paper-50">
      <p className="text-2xl font-display font-semibold">{value ?? '–'}</p>
      <p className="text-xs text-ink-500 mt-1">{label}</p>
    </div>
  );
}
