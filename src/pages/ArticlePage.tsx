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
