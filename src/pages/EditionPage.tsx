import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEditionByNumber, listArticlesInEdition } from '../services/editions';

export default function EditionPage() {
  const { number } = useParams();
  const [edition, setEdition] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!number) return;
    (async () => {
      const ed = await getEditionByNumber(Number(number));
      setEdition(ed);
      if (ed) setArticles(await listArticlesInEdition(ed.id));
      setLoading(false);
    })();
  }, [number]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-24 text-sm text-ink-500">Carregando edição...</div>;

  if (!edition || edition.status !== 'published') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2 text-ink-900">Edição não encontrada</h1>
        <Link to="/edicoes" className="text-brass-600 hover:text-brass-500 text-sm font-medium">Ver todas as edições</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Cabeçalho da Edição com Capa */}
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12 border-b border-ink-100 pb-10">
        {edition.cover_url && (
          <div className="w-full md:w-56 shrink-0 aspect-[3/4] bg-ink-50 border border-ink-100 rounded-sm overflow-hidden shadow-sm">
            <img 
              src={edition.cover_url} 
              alt={`Capa da Edição ${edition.number}`} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <span className="specimen-tag">Edição #{edition.number}</span>
            {edition.publish_date && (
              <span className="text-xs text-ink-500">
                {new Date(edition.publish_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 leading-tight">
            {edition.title || `Edição #${edition.number}`}
          </h1>

          {edition.description && (
            <p className="text-ink-700 mt-4 leading-relaxed text-base">
              {edition.description}
            </p>
          )}
        </div>
      </div>

      {/* Lista de Artigos da Edição */}
      <div>
        <h2 className="font-display text-xl font-bold text-ink-900 mb-6">Artigos desta edição</h2>

        {articles.length === 0 ? (
          <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-8 text-center">
            Nenhum artigo publicado nesta edição ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {articles.map((a) => (
              <Link 
                key={a.id} 
                to={`/artigos/${a.slug}`} 
                className="group border border-ink-100 rounded-sm p-6 bg-paper-50 hover:border-brass-500 transition-colors"
              >
                <h3 className="font-display text-xl font-semibold text-ink-900 group-hover:text-brass-600 transition-colors">
                  {a.title}
                </h3>
                {a.summary && <p className="text-sm text-ink-600 mt-2 line-clamp-2 leading-relaxed">{a.summary}</p>}
                {a.users?.name && (
                  <p className="text-xs font-medium text-ink-500 mt-4">
                    Por <span className="text-ink-700">{a.users.name}</span>
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
