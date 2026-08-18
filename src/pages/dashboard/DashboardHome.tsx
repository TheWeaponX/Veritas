import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { listMyArticles, createDraft } from '../../services/articles';
import type { Article } from '../../types/database.types';

const STATUS_LABEL: Record<string, string> = {
  draft: 'Rascunho',
  submitted: 'Em revisão',
  changes_requested: 'Alterações solicitadas',
  approved: 'Aprovado, aguardando edição',
  published: 'Publicado',
  archived: 'Arquivado',
  rejected: 'Rejeitado',
};

export default function DashboardHome() {
  const { profile } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const canWrite = profile && ['author', 'editor', 'admin'].includes(profile.role);

  useEffect(() => {
    if (!profile) return;
    listMyArticles(profile.id).then(setArticles).finally(() => setLoading(false));
  }, [profile]);

  const counts = {
    published: articles.filter((a) => a.status === 'published').length,
    draft: articles.filter((a) => a.status === 'draft').length,
    submitted: articles.filter((a) => a.status === 'submitted').length,
    views: articles.reduce((sum, a) => sum + (a.views ?? 0), 0),
  };

  async function handleNewArticle() {
    if (!profile) return;
    setCreating(true);
    try {
      const article = await createDraft(profile.id, 'Novo artigo sem título');
      navigate(`/dashboard/artigos/editar/${article.id}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Olá, {profile?.name}</h1>
        {canWrite && (
          <button
            onClick={handleNewArticle}
            disabled={creating}
            className="flex items-center gap-1.5 bg-brass-500 hover:bg-brass-400 text-ink-950 text-sm font-medium px-4 py-2 rounded-sm disabled:opacity-50"
          >
            <Plus size={16} /> {creating ? 'Criando...' : 'Novo artigo'}
          </button>
        )}
      </div>

      {!canWrite && (
        <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-4 mb-8">
          Sua conta ainda é de leitor. Peça a um administrador para virar autor e poder publicar artigos.
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat label="Publicados" value={counts.published} />
        <Stat label="Rascunhos" value={counts.draft} />
        <Stat label="Em revisão" value={counts.submitted} />
        <Stat label="Visualizações" value={counts.views} />
      </div>

      <h2 className="font-display text-lg font-semibold mb-4">Meus artigos</h2>
      {loading ? (
        <p className="text-sm text-ink-500">Carregando...</p>
      ) : articles.length === 0 ? (
        <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-6 text-center">
          Você ainda não criou nenhum artigo. Clique em "Novo artigo" para começar.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-ink-100 border border-ink-100 rounded-sm bg-paper-50">
          {articles.map((a) => (
            <Link
              key={a.id}
              to={`/dashboard/artigos/editar/${a.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-paper-100 transition-colors"
            >
              <span className="font-medium text-sm">{a.title}</span>
              <span className="text-xs font-mono uppercase tracking-wider text-ink-500">{STATUS_LABEL[a.status]}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-ink-100 rounded-sm p-4 bg-paper-50">
      <p className="text-2xl font-display font-semibold">{value}</p>
      <p className="text-xs text-ink-500 mt-1">{label}</p>
    </div>
  );
}
