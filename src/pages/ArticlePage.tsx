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
      const { data, error } = await supabase
        .from('articles')
        .select('*, users:author_id(name, bio), themes(name), editions(number, publish_date)')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (!error && data) {
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
        <Link to="/" className="text-brass-600 hover:text-brass-500 text-sm font-medium">Voltar à página inicial</Link>
      </div>
    );
  }

  const publishYear = article.editions?.publish_date 
    ? new Date(article.editions.publish_date).getFullYear() 
    : new Date().getFullYear();

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      
      {/* CABEÇALHO ACADÊMICO EXCLUSIVO PARA O PDF / IMPRESSÃO */}
      <div className="print-only-header">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider">Scientia Periodica</h1>
            <p className="text-xs text-gray-600">Enciclopédia Científica de Acesso Aberto</p>
          </div>
          <div className="text-right text-xs text-gray-600">
            {article.editions && <p>Edição #{article.editions.number} ({publishYear})</p>}
            <p>ISSN: 2965-0000 (Online)</p>
          </div>
        </div>
        <div className="text-xs text-gray-500 italic">
          Documento gerado em {new Date().toLocaleDateString('pt-BR')} — Disponível em: {window.location.href}
        </div>
      </div>

      {/* Metadados visíveis na Web */}
      <div className="mb-8 print:hidden">
        <div className="flex items-center gap-2 mb-3">
          {article.themes?.name && <span className="specimen-tag">{article.themes.name}</span>}
          {article.editions?.number && <span className="text-xs text-ink-500">Edição #{article.editions.number}</span>}
        </div>
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

      {/* Título formatado apenas para a versão impressa / PDF */}
      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold mb-2">{article.title}</h1>
        <p className="text-sm italic mb-2">Autor: {article.users?.name || 'Autor Desconhecido'}</p>
        {article.summary && <p className="text-xs font-serif italic border-l-2 border-black pl-3 py-1 my-3">{article.summary}</p>}
      </div>

      {/* Caixa de Ferramentas de Estudo (Oculta na impressão) */}
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
