import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getArticleBySlug } from '../services/articles';
import ArticleBody from '../components/article/ArticleBody';
import StudentFeatures from '../components/article/StudentFeatures';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    getArticleBySlug(slug)
      .then((data) => {
        if (!data) setError('not-found');
        else setArticle(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-4 py-24 text-sm text-ink-500">Carregando artigo...</div>;

  if (error === 'not-found' || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2">Artigo não encontrado</h1>
        <Link to="/" className="text-brass-600 hover:text-brass-500 text-sm">Voltar para a página inicial</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {article.themes?.name && <span className="specimen-tag">{article.themes.name}</span>}
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-4 leading-tight">{article.title}</h1>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500 mt-4">
        {article.users?.name && (
          <span>
            Autor: <strong className="text-ink-700">{article.users.name}</strong>
          </span>
        )}
        {article.published_at && (
          <span>Publicado em {new Date(article.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        )}
      </div>

      {article.is_demo && (
        <p className="mt-4 text-xs font-mono uppercase tracking-wider text-teal-600 border border-teal-600/30 inline-block px-2 py-1 rounded-sm">
          Conteúdo de demonstração
        </p>
      )}

      {article.summary && <p className="mt-8 text-lg text-ink-700 leading-relaxed">{article.summary}</p>}

      <div className="mt-8 text-ink-800 leading-relaxed">
        <ArticleBody content={article.content} />
      </div>

      {/* NOVO: Componente de funcionalidades para estudantes adicionado aqui */}
      <div className="mt-12 mb-8">
        <StudentFeatures 
          articleTitle={article.title}
          authorName={article.users?.name || 'Autor'}
          publishYear={article.published_at ? new Date(article.published_at).getFullYear() : new Date().getFullYear()}
          articleId={article.id}
        />
      </div>

      {article.references?.length > 0 && (
        <section className="mt-16 border-t border-ink-100 pt-8">
          <h2 className="font-display text-xl font-semibold mb-4">Referências</h2>
          <ol className="flex flex-col gap-2 text-sm text-ink-700 list-decimal list-inside">
            {article.references.map((ref: any) => (
              <li key={ref.id}>
                {ref.author && `${ref.author}. `}
                {ref.title}
                {ref.publication && `, ${ref.publication}`}
                {ref.year && ` (${ref.year})`}
                {ref.url && (
                  <>
                    {' — '}
                    <a href={ref.url} target="_blank" rel="noreferrer" className="text-brass-600 hover:underline">
                      link
                    </a>
                  </>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="mt-16 text-xs text-ink-500 border-t border-ink-100 pt-6">
        Este artigo foi revisado pela equipe editorial.
      </p>
    </article>
  );
}
