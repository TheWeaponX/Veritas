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
        const { data: editionData } = await supabase
          .from('editions')
          .select('*')
          .order('number', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (editionData) {
          setLatestEdition(editionData);

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
    return <div className="max-w-5xl mx-auto px-6 py-32 text-center text-sm text-ink-500 font-serif">A carregar o volume...</div>;
  }

  const publishYear = latestEdition?.publish_date 
    ? new Date(latestEdition.publish_date).getFullYear() 
    : new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-ink-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* CABEÇALHO DO PROJETO / HERO */}
        <header className="text-center max-w-2xl mx-auto space-y-4 pt-4">
          <div className="inline-block font-mono text-xs uppercase tracking-widest text-brass-700 bg-brass-50 border border-brass-200 px-3.5 py-1.5 rounded-full">
            Enciclopédia Científica de Acesso Aberto
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-ink-900">
            Scientia Periodica
          </h1>
          <p className="font-serif text-base sm:text-lg text-ink-600 leading-relaxed italic">
            "Um espaço onde a química, a biologia, a acústica e a tecnologia convergem numa única e contínua busca pela verdade."
          </p>
        </header>

        {/* VITRINE DA EDIÇÃO ATUAL (ESTILO CAPA DE LIVRO ANTIGO / CLÁSSICO) */}
        {latestEdition ? (
          <section className="bg-white border-2 border-ink-900/10 rounded-2xl p-8 sm:p-12 shadow-xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Detalhe estético lateral (lombada simulada) */}
            <div className="absolute top-0 left-0 w-3 h-full bg-brass-700 hidden lg:block" />

            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider bg-ink-900 text-white px-3 py-1 rounded">
                  Edição #{latestEdition.number}
                </span>
                <span className="text-xs font-mono text-ink-500">
                  Ano {publishYear} • ISSN: 2965-0000
                </span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 leading-tight">
                {latestEdition.title || 'Liber Primus'}
              </h2>

              <div className="prose font-serif text-ink-700 leading-relaxed text-base sm:text-lg">
                <p>
                  {latestEdition.description || 
                    "O Liber Primus é o marco inaugural da nossa jornada pelo conhecimento, concebido como a pedra angular da Scientia Periodica para propor um diálogo direto entre os fenómenos naturais, a vida e as criações humanas. Rompendo com as barreiras tradicionais do saber, este volume de estreia foca-se na intersecção de disciplinas que moldam a nova realidade."}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-mono uppercase tracking-widest text-ink-400">
                  {articles.length} Artigos Publicados neste Volume
                </span>
              </div>
            </div>

            {/* Coluna da Direita: Selo Editorial / Informação extra */}
            <div className="lg:col-span-4 bg-ink-50 border border-ink-200/60 rounded-xl p-6 flex flex-col justify-between space-y-6 text-center">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-400 mb-1">Volume Inaugural</p>
                <p className="font-display text-2xl font-bold text-ink-900">Liber Primus</p>
                <div className="w-12 h-0.5 bg-brass-600 mx-auto my-3" />
                <p className="text-xs font-serif text-ink-600 italic">
                  Curadoria dedicada à união entre exatas, naturais e ciências humanas.
                </p>
              </div>

              <Link 
                to="/editions" 
                className="inline-block w-full bg-ink-900 text-white py-2.5 px-4 rounded text-xs font-mono uppercase tracking-wider hover:bg-ink-800 transition-colors shadow-sm"
              >
                Explorar Edições Anteriores
              </Link>
            </div>

          </section>
        ) : (
          <div className="bg-white border border-ink-100 rounded-xl p-8 text-center">
            <p className="font-serif text-ink-600">Nenhuma edição publicada no momento.</p>
          </div>
        )}

        {/* SUMÁRIO DETALHADO DA EDIÇÃO */}
        <section className="space-y-6">
          <div className="border-b border-ink-200 pb-4 flex items-end justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brass-700">Índice Académico</span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink-900">
                Sumário do Volume
              </h3>
            </div>
            <span className="text-xs font-mono text-ink-500 hidden sm:inline-block">
              Clique num artigo para iniciar a leitura
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="bg-white border border-ink-100 rounded-lg p-12 text-center text-ink-500 font-serif text-sm">
              Ainda não existem artigos publicados nesta edição.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link 
                  key={article.id} 
                  to={`/artigos/${article.slug}`}
                  className="group bg-white border border-ink-200/80 rounded-xl p-7 hover:border-brass-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {article.themes?.name ? (
                        <span className="text-[11px] font-mono uppercase tracking-widest bg-ink-50 text-brass-800 border border-brass-200/50 px-2.5 py-1 rounded">
                          {article.themes.name}
                        </span>
                      ) : <span />}
                      <span className="text-xs font-mono text-ink-400 group-hover:text-brass-700 transition-colors">
                        Artigo de Investigação
                      </span>
                    </div>

                    <h4 className="font-display text-xl sm:text-2xl font-bold text-ink-900 group-hover:text-brass-700 transition-colors leading-snug">
                      {article.title}
                    </h4>

                    {article.summary && (
                      <p className="text-sm text-ink-600 font-serif line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-ink-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-ink-600 font-medium">Por <strong className="text-ink-900">{article.users?.name || 'Autor'}</strong></span>
                    <span className="text-brass-700 group-hover:translate-x-1.5 transition-transform font-bold flex items-center gap-1">
                      Ler na íntegra →
                    </span>
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
