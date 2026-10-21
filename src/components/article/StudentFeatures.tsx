import { useState } from 'react';

interface StudentFeaturesProps {
  articleTitle: string;
  authorName: string;
  publishYear: number;
  articleId: string;
}

export default function StudentFeatures({ articleTitle, authorName, publishYear, articleId }: StudentFeaturesProps) {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleCopyCitation = () => {
    // Lógica para gerar a citação em formato ABNT
    const lastName = authorName.split(' ').pop()?.toUpperCase() || 'AUTOR';
    const firstNames = authorName.replace(lastName, '').trim();
    const url = window.location.href;
    const citation = `${lastName}, ${firstNames}. ${articleTitle}. Scientia Periodica, ${publishYear}. Disponível em: <${url}>. Acesso em: ${new Date().toLocaleDateString('pt-BR')}.`;
    
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPdf = () => {
    // Usa a funcionalidade nativa do navegador para imprimir/salvar em PDF.
    // A classe "print:hidden" garante que estes botões não saiam na impressão.
    window.print();
  };

  const handleSaveArticle = () => {
    // Esta função será ligada ao Supabase mais tarde para a funcionalidade de "Favoritos"
    setSaved(!saved);
  };

  return (
    <div className="bg-paper-50 p-6 rounded-md border border-ink-100 flex flex-col sm:flex-row gap-4 justify-between items-center print:hidden">
      <div className="text-sm text-ink-700">
        <h3 className="font-display font-semibold text-ink-900 mb-1">Ferramentas de Estudo</h3>
        <p>Gere citações bibliográficas, guarde ou exporte este artigo.</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={handleSaveArticle}
          className={`px-4 py-2 text-sm font-medium rounded-sm border transition-colors ${
            saved 
              ? 'bg-brass-500 text-ink-950 border-brass-500' 
              : 'bg-white text-ink-700 border-ink-200 hover:border-brass-500'
          }`}
        >
          {saved ? '★ Guardado' : 'Guardar Artigo'}
        </button>

        <button 
          onClick={handleCopyCitation}
          className="px-4 py-2 text-sm font-medium bg-white text-ink-700 border border-ink-200 rounded-sm hover:border-brass-500 transition-colors"
        >
          {copied ? 'Citação Copiada!' : 'Citar (ABNT)'}
        </button>

        <button 
          onClick={handlePrintPdf}
          className="px-4 py-2 text-sm font-medium bg-ink-900 text-paper-50 rounded-sm hover:bg-ink-700 transition-colors"
        >
          Baixar PDF
        </button>
      </div>
    </div>
  );
}
