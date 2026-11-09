import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ArticleBody from '../components/article/ArticleBody';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function fetchArticle() {
      const { data, error } = await supabase
        .from('articles')
        .select('*, users:author_id(name, biography)')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar artigo:', error);
      }

      if (data) {
        setArticle(data);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-24 text-sm text-ink-500 font-serif">Carregando volume...</div>;

  if (!article) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold mb-3 text-ink-900">Artigo não encontrado</h1>
        <p className="text-sm text-ink-600 mb-6">O registo procurado não se encontra disponível neste volume.</p>
        <Link to="/" className="inline-block bg-ink-900 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors">Voltar ao Início</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white p-8 sm:p-14 shadow-sm border border-ink-100 rounded-lg">
        
        {/* Cabeçalho Académico / Metadados */}
        <header className="mb-10 pb-8 border-b border-ink-100">
          <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-ink-400 mb-4">
            <span>Scientia Periodica</span>
            {article.users?.name && <span>Por {article.users.name}</span>}
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 leading-tight mb-4">
            {article.title}
          </h1>

          {article.summary && (
            <p className="text-lg text-ink-600 leading-relaxed font-serif italic">
              {article.summary}
            </p>
          )}
        </header>

        {/* Corpo do Artigo Organizado */}
        <div className="prose prose-lg max-w-none text-ink-900 font-serif leading-relaxed space-y-6">
          {typeof article.content === 'string' ? (
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          ) : (
            <ArticleBody content={article.content} />
          )}
        </div>

        {/* Rodapé do Artigo */}
        <footer className="mt-16 pt-8 border-t border-ink-100 flex items-center justify-between text-xs text-ink-400 font-mono">
          <Link to="/" className="hover:text-ink-900 transition-colors">← Voltar à biblioteca</Link>
          <span>ISSN: 2965-0000</span>
        </footer>

      </article>
    </main>
  );
}
