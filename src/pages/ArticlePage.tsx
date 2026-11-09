import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ArticleBody from '../components/article/ArticleBody';
import StudentFeatures from '../components/article/StudentFeatures';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug || params.id; 
  
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Identificador não encontrado na rota.');
      setLoading(false);
      return;
    }

    async function fetchArticle() {
      try {
        // 1. Incrementa a visualização na base de dados
        await supabase.rpc('increment_article_views', { article_slug: slug });

        // 2. Busca os dados limpos (Garante que "editions" não existe aqui)
        const { data, error: supabaseError } = await supabase
          .from('articles')
          .select('id, title, summary, content, views, users:author_id(name, biography), themes!articles_theme_id_fkey(name, slug)')
          .eq('slug', slug)
          .maybeSingle();

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        if (!data) {
          setError('O artigo não existe na base de dados.');
        } else {
          setArticle(data);
        }
      } catch (err: any) {
        console.error('Erro genérico ao procurar artigo:', err);
        setError(`Erro de comunicação: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [slug, params]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center text-sm text-ink-500 font-serif">
        A carregar volume...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        {/* TÍTULO MODIFICADO PARA TESTE VISUAL */}
        <h1 className="font-display text-3xl font-semibold mb-3 text-red-600">TESTE DE ATUALIZAÇÃO</h1>
        <p className="text-sm text-ink-600 mb-6">Se está a ver este texto a vermelho, a nova versão finalmente chegou ao servidor!</p>
        
        {error && <p className="text-xs text-red-600 mb-6 bg-red-50 border border-red-100 p-3 rounded max-w-md mx-auto">Detalhes: {error}</p>}
        <Link to="/" className="inline-block bg-ink-900 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors shadow-sm">
          Voltar ao Início
        </Link>
      </div>
    );
  }

  const publishYear = new Date().getFullYear();

  let contentElement;
  try {
    if (typeof article.content === 'string') {
      contentElement = <div dangerouslySetInnerHTML={{ __html: article.content }} />;
    } else if (typeof article.content === 'object' && article.content !== null) {
      contentElement = <ArticleBody content={article.content} />;
    } else {
      contentElement = <p className="text-ink-600 italic">Este artigo não possui conteúdo submetido.</p>;
    }
  } catch (renderError) {
    console.error('Erro ao renderizar o conteúdo do artigo:', renderError);
    contentElement = <p className="text-red-600 bg-red-50 p-4 rounded text-sm">O conteúdo deste artigo possui uma formatação inválida e não pôde ser apresentado.</p>;
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] py-16 px-4 sm:px-6 lg:px-8">
      <article className="max-w-3xl mx-auto bg-white p-8 sm:p-14 shadow-sm border border-ink-100 rounded-lg">
        
        <header className="mb-10 pb-8 border-b border-ink-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono uppercase tracking-widest text-ink-400 mb-6">
            <div className="flex items-center gap-4">
              <span className="bg-ink-50 text-ink-600 px-2.5 py-1 rounded">Scientia Periodica</span>
              
              <span className="flex items-center gap-1.5 text-ink-500" title="Visualizações totais">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {article.views || 0}
              </span>
            </div>
            {article.users?.name && <span>Por <strong className="text-ink-900">{article.users.name}</strong></span>}
          </div>
          
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight mb-6">{article.title}</h1>
          {article.summary && <p className="text-lg text-ink-700 leading-relaxed font-serif italic border-l-2 border-brass-300 pl-4">{article.summary}</p>}
        </header>

        <div className="mb-10 print:hidden">
          <StudentFeatures 
            articleTitle={article.title}
            authorName={article.users?.name || 'Autor Desconhecido'}
            publishYear={publishYear}
            articleId={article.id}
          />
        </div>
        
        <div className="prose prose-lg max-w-none text-ink-900 font-serif leading-relaxed space-y-6">
          {contentElement}
        </div>

        <footer className="mt-16 pt-8 border-t border-ink-100 flex items-center justify-between text-xs text-ink-400 font-mono">
          <Link to="/" className="hover:text-ink-900 transition-colors">← Voltar à biblioteca</Link>
          <span>ISSN: 2965-0000</span>
        </footer>

      </article>
    </main>
  );
}
