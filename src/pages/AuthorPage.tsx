import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserBySlug } from '../services/users';
import { listPublishedByAuthor } from '../services/articles';
import type { UserProfile } from '../types/database.types';

export default function AuthorPage() {
  const { slug } = useParams();
  const [author, setAuthor] = useState<UserProfile | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const a = await getUserBySlug(slug);
      setAuthor(a);
      if (a) setArticles(await listPublishedByAuthor(a.id));
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-24 text-sm text-ink-500">Carregando...</div>;

  if (!author) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Autor não encontrado</h1>
        <Link to="/autores" className="text-brass-600 hover:text-brass-500 text-sm">Voltar para autores</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-ink-100 overflow-hidden shrink-0">
          {author.profile_image && <img src={author.profile_image} alt={author.name} className="w-full h-full object-cover" />}
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold">{author.name}</h1>
          {author.institution && <p className="text-sm text-ink-500">{author.institution}</p>}
        </div>
      </div>

      {author.biography && <p className="mt-6 text-ink-700 leading-relaxed">{author.biography}</p>}

      {author.interests && author.interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {author.interests.map((i) => (
            <span key={i} className="specimen-tag !normal-case">{i}</span>
          ))}
        </div>
      )}

      {author.professional_links?.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4 text-sm">
          {author.professional_links.map((l) => (
            <a key={l.url} href={l.url} target="_blank" rel="noreferrer" className="text-brass-600 hover:underline">
              {l.label}
            </a>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl font-semibold mt-12 mb-4">Artigos publicados</h2>
      {articles.length === 0 ? (
        <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-6 text-center">
          Nenhum artigo publicado ainda.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {articles.map((a) => (
            <Link key={a.id} to={`/artigos/${a.slug}`} className="border border-ink-100 rounded-sm p-4 bg-paper-50 hover:border-brass-500 transition-colors">
              {a.themes?.name && <span className="specimen-tag mb-2">{a.themes.name}</span>}
              <h3 className="font-display text-lg font-medium mt-2">{a.title}</h3>
              {a.summary && <p className="text-sm text-ink-500 mt-1 line-clamp-2">{a.summary}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
