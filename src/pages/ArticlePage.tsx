import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import StudentFeatures from '../components/article/StudentFeatures';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    async function fetchArticle() {
      // Query simplificada para evitar conflitos de relações múltiplas no Supabase
      const { data, error } = await supabase
        .from('articles')
        .select('*, users:author_id(name, biography)')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar artigo:', error);
      }

      console.log('Dados recebidos do Supabase:', data);

      if (data) {
        setArticle(data);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [slug]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-24 text-sm text-ink-500">Carregando artigo...</div>;

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold mb-2 text-ink-900">Artigo não encontrado</h1>
        <p className="text-sm text-ink-600 mb-4">O slug procurado foi: <code className="bg-gray-100 px-2 py-1 rounded text-red-600">{slug}</code></p>
        <Link to="/" className="text-brass-600 hover:text-brass-500 text-sm font-medium">Voltar à página inicial</Link>
      </div>
    );
  }

  const publishYear = new Date().getFullYear();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      
      {/* Metadados visíveis na Web */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-ink-900 leading-tight mb-4">
          {article.title}
        </h1>
        {article.summary && (
          <p className="text-lg text-ink-700 leading-relaxed font-serif italic mb-6">
            {article.summary}
          </p>
        )}
        {article.users?.name && (
          <p className="text-sm font-medium text-ink-600">
            Por <span className="text-ink-900 font-semibold">{article.users.name}</span>
          </p>
        )}
      </div>

      {/* Caixa de Ferramentas de Estudo */}
      <div className="mb-10 print:hidden">
        <StudentFeatures 
          articleTitle={article.title}
          authorName={article.users?.name || 'Autor Desconhecido'}
          publishYear={publishYear}
          articleId={article.id}
        />
      </div>

      {/* Conteúdo do Artigo */}
      <div className="prose prose-lg max-w-none text-ink-900 font-serif leading-relaxed">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

    </article>
  );
}
