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

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-24 text-sm text-ink-500">Carregando...</div>;

  if (!edition || edition.status !== 'published') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Edição não encontrada</h1>
        <Link to="/edicoes" className="text-brass-600 hover:text-brass-500 text-sm">Ver todas as edições</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <span className="specimen-tag">Edição #{edition.number}</span>
      <h1 className="font-display text-3xl font-semibold mt-3">
        {edition.title || new Date(edition.publish_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
      </h1>
      {edition.description && <p className="text-ink-600 mt-3">{edition.description}</p>}

      <div className="mt-10 flex flex-col gap-4">
        {articles.map((a) => (
          <Link key={a.id} to={`/artigos/${a.slug}`} className="border border-ink-100 rounded-sm p-5 bg-paper-50 hover:border-brass-500 transition-colors">
            <h3 className="font-display text-lg font-medium">{a.title}</h3>
            {a.summary && <p className="text-sm text-ink-500 mt-2">{a.summary}</p>}
            {a.users?.name && <p className="text-xs text-ink-500 mt-3">por {a.users.name}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
