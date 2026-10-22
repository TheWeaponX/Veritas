import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPublishedEditions } from '../services/editions';
import type { Edition } from '../types/database.types';

export default function EditionsArchive() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublishedEditions().then(setEditions).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-4xl font-bold mb-2 text-ink-900">Edições Anteriores</h1>
      <p className="text-ink-700 mb-12">Explore o nosso acervo completo, organizado edição por edição.</p>

      {loading ? (
        <p className="text-sm text-ink-500">Carregando acervo...</p>
      ) : editions.length === 0 ? (
        <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-8 text-center">
          Nenhuma edição publicada ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {editions.map((e) => (
            <Link 
              key={e.id} 
              to={`/edicoes/${e.number}`} 
              className="group flex flex-col border border-ink-100 rounded-sm bg-paper-50 hover:border-brass-500 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/5"
            >
              {/* Contêiner da Imagem com proporção de revista (3:4) */}
              <div className="aspect-[3/4] w-full bg-ink-50 border-b border-ink-100 flex items-center justify-center overflow-hidden">
                {e.cover_url ? (
                  <img 
                    src={e.cover_url} 
                    alt={`Capa da Edição ${e.number}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="text-ink-300 font-display text-3xl font-bold flex flex-col items-center">
                    <span className="text-sm tracking-widest uppercase mb-1">Edição</span>
                    #{e.number}
                  </div>
                )}
              </div>
              
              {/* Detalhes da Edição */}
              <div className="p-5 flex flex-col flex-1">
                <span className="specimen-tag self-start mb-3">Vol. {e.number}</span>
                <h2 className="font-display text-lg font-bold text-ink-900 group-hover:text-brass-600 transition-colors mb-1 line-clamp-2">
                  {e.title || `Edição ${e.number}`}
                </h2>
                <div className="mt-auto pt-4 flex items-center justify-between text-xs font-medium">
                  <span className="text-ink-500">
                    {e.publish_date ? new Date(e.publish_date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : ''}
                  </span>
                  <span className="text-brass-600 group-hover:text-brass-500 transition-colors">
                    Ler edição &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
