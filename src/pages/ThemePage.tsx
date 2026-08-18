import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getThemeBySlug, listSubthemes } from '../services/themes';
import { supabase } from '../lib/supabase';
import type { Theme } from '../types/database.types';

export default function ThemePage() {
  const { slug } = useParams();
  const [theme, setTheme] = useState<Theme | null>(null);
  const [subthemes, setSubthemes] = useState<Theme[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const t = await getThemeBySlug(slug);
      setTheme(t);
      if (t) {
        const [subs, { data: arts }] = await Promise.all([
          listSubthemes(t.id),
          supabase.from('articles').select('*').eq('theme_id', t.id).eq('status', 'published').order('published_at', { ascending: false }),
        ]);
        setSubthemes(subs);
        setArticles(arts ?? []);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-24 text-sm text-ink-500">Carregando...</div>;

  if (!theme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Tema não encontrado</h1>
        <Link to="/" className="text-brass-600 hover:text-brass-500 text-sm">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">{theme.name}</h1>
      {theme.description && <p className="text-ink-500 mt-2 max-w-2xl">{theme.description}</p>}

      {subthemes.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {subthemes.map((s) => (
            <span key={s.id} className="specimen-tag">{s.name}</span>
          ))}
        </div>
      )}

      <div className="mt-12">
        <h2 className="font-display text-xl font-semibold mb-4">Artigos</h2>
        {articles.length === 0 ? (
          <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-6 text-center">
            Nenhum artigo publicado nesta área ainda.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((a) => (
              <Link key={a.id} to={`/artigos/${a.slug}`} className="border border-ink-100 rounded-sm p-5 bg-paper-50 hover:border-brass-500 transition-colors">
                <h3 className="font-display text-lg font-medium">{a.title}</h3>
                {a.summary && <p className="text-sm text-ink-500 mt-2 line-clamp-2">{a.summary}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
