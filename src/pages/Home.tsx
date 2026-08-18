import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getCurrentEdition, listArticlesInEdition } from '../services/editions';

export default function Home() {
  const [query, setQuery] = useState('');
  const [edition, setEdition] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const ed = await getCurrentEdition();
        setEdition(ed);
        if (ed) setArticles(await listArticlesInEdition(ed.id));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const coverArticle = articles.find((a) => a.id === edition?.cover_article_id);
  const restArticles = articles.filter((a) => a.id !== edition?.cover_article_id);

  return (
    <div>
      {/* HERO */}
      <section className="bg-ink-900 text-paper-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
            Conhecimento científico, organizado para todos.
          </h1>
          <p className="mt-4 text-ink-100 max-w-xl mx-auto">
            Uma edição nova toda semana, escrita por jovens estudantes e cientistas em formação.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/pesquisa?q=${encodeURIComponent(query)}`;
            }}
            className="mt-8 flex items-center gap-2 bg-paper-50 rounded-sm p-1.5 max-w-xl mx-auto"
          >
            <Search className="ml-2 text-ink-500 shrink-0" size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquise um conceito, fenômeno ou área da ciência..."
              className="flex-1 bg-transparent outline-none text-sm text-ink-900 px-1 py-2"
            />
            <button type="submit" className="bg-brass-500 hover:bg-brass-400 text-ink-950 text-sm font-medium px-4 py-2 rounded-sm transition-colors">
              Pesquisar
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {error && <p className="text-red-600 text-sm">Não foi possível carregar a edição: {error}</p>}

        {loading ? (
          <p className="text-sm text-ink-500">Carregando...</p>
        ) : !edition ? (
          <div className="border border-dashed border-ink-100 rounded-sm p-10 text-center text-sm text-ink-500">
            Nenhuma edição publicada ainda. Assim que a primeira edição for fechada pelo admin, ela aparece aqui.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8 border-b border-ink-100 pb-4">
              <div>
                <span className="specimen-tag">Edição #{edition.number}</span>
                <h2 className="font-display text-2xl font-semibold mt-2">
                  {edition.title || `Edição de ${new Date(edition.publish_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`}
                </h2>
                {edition.description && <p className="text-sm text-ink-500 mt-1 max-w-xl">{edition.description}</p>}
              </div>
              <Link to="/edicoes" className="text-sm text-brass-600 hover:text-brass-500 shrink-0">Edições anteriores →</Link>
            </div>

            {coverArticle && (
              <Link to={`/artigos/${coverArticle.slug}`} className="block border border-ink-100 rounded-sm bg-paper-50 p-8 mb-8 hover:border-brass-500 transition-colors">
                <span className="text-xs font-mono uppercase tracking-wider text-brass-600">Destaque da semana</span>
                <h3 className="font-display text-2xl font-semibold mt-2">{coverArticle.title}</h3>
                {coverArticle.summary && <p className="text-ink-600 mt-2">{coverArticle.summary}</p>}
                {coverArticle.users?.name && <p className="text-xs text-ink-500 mt-3">por {coverArticle.users.name}</p>}
              </Link>
            )}

            <h3 className="font-display text-lg font-semibold mb-4">Sumário desta edição</h3>
            {restArticles.length === 0 && !coverArticle ? (
              <p className="text-sm text-ink-500">Nenhum artigo nesta edição.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restArticles.map((a) => (
                  <Link key={a.id} to={`/artigos/${a.slug}`} className="border border-ink-100 rounded-sm p-4 bg-paper-50 hover:border-brass-500 transition-colors">
                    <h4 className="font-display text-base font-medium">{a.title}</h4>
                    {a.summary && <p className="text-sm text-ink-500 mt-1 line-clamp-2">{a.summary}</p>}
                    {a.users?.name && <p className="text-xs text-ink-500 mt-2">por {a.users.name}</p>}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
