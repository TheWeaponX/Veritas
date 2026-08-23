import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { listRejectedArticles, deleteArticlePermanently } from '../../services/articles';

export default function AdminRejected() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function reload() {
    const data = await listRejectedArticles();
    setArticles(data);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Apagar permanentemente "${title}"? Essa ação não pode ser desfeita — o artigo, suas referências e seu histórico de revisão somem de vez.`)) return;
    setDeletingId(id);
    try {
      await deleteArticlePermanently(id);
      await reload();
    } catch (e: any) {
      alert(`Não foi possível apagar: ${e.message}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Artigos rejeitados</h1>
      <p className="text-sm text-ink-500 mb-8">
        Rejeitar em <code className="font-mono text-xs">/admin/revisoes</code> não apaga nada — os artigos ficam aqui até você decidir excluí-los de vez.
      </p>

      {loading ? (
        <p className="text-sm text-ink-500">Carregando...</p>
      ) : articles.length === 0 ? (
        <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-8 text-center">
          Nenhum artigo rejeitado no momento.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-ink-100 border border-ink-100 rounded-sm bg-paper-50">
          {articles.map((a) => (
            <div key={a.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-ink-500 mt-0.5">
                  por {a.users?.name ?? 'autor desconhecido'}
                  {a.themes?.name && ` · ${a.themes.name}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(a.id, a.title)}
                disabled={deletingId === a.id}
                className="flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
              >
                <Trash2 size={15} /> {deletingId === a.id ? 'Apagando...' : 'Apagar permanentemente'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
