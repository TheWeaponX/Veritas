import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchArticles } from '../services/articles';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initialQuery = params.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function runSearch(q: string) {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchArticles(q);
      setResults(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-2xl font-semibold mb-6">Pesquisar</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParams({ q: query });
          runSearch(query);
        }}
        className="flex items-center gap-2 border border-ink-100 rounded-sm p-1.5 bg-paper-50"
      >
        <Search className="ml-2 text-ink-500" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquise um conceito, fenômeno, cientista ou área da ciência..."
          className="flex-1 bg-transparent outline-none text-sm px-1 py-2"
        />
        <button type="submit" className="bg-ink-900 text-paper-50 text-sm font-medium px-4 py-2 rounded-sm">
          Pesquisar
        </button>
      </form>

      <div className="mt-8">
        {loading && <p className="text-sm text-ink-500">Pesquisando...</p>}
        {!loading && searched && results.length === 0 && (
          <p className="text-sm text-ink-500">Nenhum artigo encontrado para "{query}".</p>
        )}
        <div className="flex flex-col gap-3">
          {results.map((a) => (
            <Link key={a.id} to={`/artigos/${a.slug}`} className="border border-ink-100 rounded-sm p-4 bg-paper-50 hover:border-brass-500 transition-colors">
              {a.themes?.name && <span className="specimen-tag mb-2">{a.themes.name}</span>}
              <h3 className="font-display text-lg font-medium mt-2">{a.title}</h3>
              {a.summary && <p className="text-sm text-ink-500 mt-1 line-clamp-2">{a.summary}</p>}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
