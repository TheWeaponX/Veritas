import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [latestEdition, setLatestEdition] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        // Busca a edição mais recente publicada
        const { data: editionData } = await supabase
          .from('editions')
          .select('*')
          .order('number', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (editionData) {
          setLatestEdition(editionData);

          // Busca os artigos associados a esta edição
          const { data: articlesData } = await supabase
            .from('articles')
            .select('*, themes:theme_id(name, slug), users:author_id(name)')
            .eq('edition_id', editionData.id)
            .eq('status', 'published')
            .order('position', { ascending: true });

          setArticles(articlesData ?? []);
        }
      } catch (err) {
        console.error('Erro ao carregar dados da página inicial:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchHomeData();
  }, []);

  if (loading) {
    return <div className="max-w-5xl mx-auto px-6 py-32 text-center text-sm text-ink-500 font-serif">A carregar biblioteca...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* DESTAQUE DA EDIÇÃO ATUAL / LIBER PRIMUS */}
        {latestEdition ? (
          <section className="bg-white border border-ink-100 rounded-xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
            
            {/* Elemento decorativo clássico */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-ink-50 rounded-bl-full pointer-events-none opacity-50" />

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-ink-100">
                <div>
                  <span className="inline-block font-mono text-xs uppercase tracking-widest bg-ink-900 text-white px-3 py-1 rounded mb-2">
                    Edição #{latestEdition.number}
                  </span>
                  <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900">
                    {latestEdition.title || 'Scientia Periodica: Liber Primus'}
                  </h1>
                </div>
                <Link 
                  to="/editions" 
                  className="text-xs font-mono uppercase tracking-wider text-ink-600 hover:text-ink-950 transition-colors self-start sm:self-auto"
                >
                  Ver edições anteriores →
                </Link>
              </div>

              {/* Descrição fluida e elegante */}
              <div className="prose prose-lg text-ink-700 font-serif leading-relaxed mb-8 max-w-none">
                <p>
                  {latestEdition.description || 
                    "O Liber Primus é o marco inaugural da nossa jornada pelo conhecimento, concebido como a pedra angular da Scientia Periodica para propor um diálogo direto entre os fenómenos naturais, a vida e as criações humanas. Rompendo com as barreiras tradicionais do saber, este volume de estreia foca-se na intersecção de disciplinas que moldam a nova realidade, explorando as dualidades ocultas da matéria, os engenhosos mecanismos de defesa e as origens aquáticas da Biologia, do limiar entre a melodia acidental e o perigo físico na acústica, e as eficiências da liberdade e robustez que sustentam os sistemas digitais modernos."}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <div className="bg-white border border-ink-100 rounded-xl p-8 text-center">
            <h1 className="font-display text-2xl font-bold text-ink-900 mb-2">Scientia Periodica</h1>
            <p className="text-ink-600 font-serif">Nenhuma edição publicada no momento.</p>
          </div>
        )}

        {/* SUMÁRIO DA EDIÇÃO */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-ink-900 tracking-wide uppercase text-sm">
              Sumário desta edição
            </h2>
            <span className="text-xs font-mono text-ink-400">
              {articles.length} {articles.length === 1 ? 'artigo publicado' : 'artigos publicados'}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white border border-ink-100 rounded-lg p-8 text-center text-ink-500 font-serif text-sm">
              Ainda não existem artigos publicados nesta edição.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.id} 
                  to={`/article/${article.slug}`}
                  className="group bg-white border border-ink-100 rounded-lg p-6 hover:border-ink-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {article.themes?.name && (
                      <span className="inline-block text-[10px] font-mono uppercase tracking-wider bg-ink-50 text-ink-600 px-2.5 py-0.5 rounded mb-3">
                        {article.themes.name}
                      </span>
                    )}
                    <h3 className="font-display text-xl font-bold text-ink-900 group-hover:text-brass-700 transition-colors mb-2 leading-snug">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-sm text-ink-600 font-serif line-clamp-2 leading-relaxed mb-4">
                        {article.summary}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-ink-50 flex items-center justify-between text-xs font-mono text-ink-500">
                    <span>Por {article.users?.name || 'Autor'}</span>
                    <span className="group-hover:translate-x-1 transition-transform font-bold text-ink-900">Ler artigo →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
