import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ArticleBody from '../components/article/ArticleBody';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('ArticlePage carregado com slug:', slug);

    if (!slug) {
      console.error('Nenhum slug fornecido na URL.');
      setError('Slug não encontrado.');
      setLoading(false);
      return;
    }

    async function fetchArticle() {
      try {
        console.log('A iniciar procura do artigo no Supabase...');
        const { data, error: supabaseError } = await supabase
          .from('articles')
          .select('*, users:author_id(name, biography)')
          .eq('slug', slug)
          .maybeSingle();

        if (supabaseError) {
          console.error('Erro retornado pelo Supabase:', supabaseError);
          throw new Error(supabaseError.message);
        }

        console.log('Dados recebidos do Supabase:', data);

        if (!data) {
          console.warn('Nenhum artigo encontrado com o slug:', slug);
          setError('Artigo não encontrado.');
        } else {
          setArticle(data);
        }
      } catch (err: any) {
        console.error('Erro genérico ao procurar artigo:', err);
        setError(`Erro ao carregar o artigo: ${err.message || 'Erro desconhecido'}`);
      } finally {
        setLoading(false);
        console.log('Processo de carregamento finalizado.');
      }
    }

    fetchArticle();
  }, [slug]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-sm text-ink-500 font-serif">A carregar volume...</div>;
  }

  if (error || !article) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold mb-3 text-ink-900">Artigo não encontrado</h1>
        <p className="text-sm text-ink-600 mb-6">O registo procurado não se encontra disponível neste volume.</p>
        {error && <p className="text-xs text-red-600 mb-4 bg-red-50 p-3 rounded">Detalhes do erro: {error}</p>}
        <Link to="/" className="inline-block bg-ink-900 text-white px-6 py-2.5 rounded text-sm font-medium hover:bg-ink-800 transition-colors">Voltar ao Início</Link>
      </div>
    );
  }

  // Verifica se o conteúdo é um objeto (provavelmente JSON do editor) ou texto
  let contentElement;
  try {
    if (typeof article.content === 'string') {
      contentElement = <div dangerouslySetInnerHTML={{ __html: article.content }} />;
    } else if (typeof article.content === 'object' && article.content !== null) {
      contentElement = <ArticleBody content={article.content} />;
    } else {
      contentElement = <p className="text-ink-600 italic">Este artigo não possui conteúdo.</p>;
    }
  } catch (renderError) {
    console.error('Erro ao renderizar o conteúdo do artigo:', renderError);
    contentElement = <p className="text-red-600">Erro ao exibir o conteúdo do artigo.</p>;
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
          {contentElement}
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
