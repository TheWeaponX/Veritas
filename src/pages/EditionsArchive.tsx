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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl font-semibold mb-1">Edições anteriores</h1>
      <p className="text-ink-500 mb-10">O arquivo completo, edição por edição.</p>

      {loading ? (
        <p className="text-sm text-ink-500">Carregando...</p>
      ) : editions.length === 0 ? (
        <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-8 text-center">
          Nenhuma edição publicada ainda.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-ink-100 border border-ink-100 rounded-sm bg-paper-50">
          {editions.map((e) => (
            <Link key={e.id} to={`/edicoes/${e.number}`} className="flex items-center justify-between px-4 py-4 hover:bg-paper-100 transition-colors">
              <div>
                <span className="specimen-tag mb-1">Edição #{e.number}</span>
                <p className="font-display text-lg font-medium mt-1.5">
                  {e.title || (e.publish_date && new Date(e.publish_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }))}
                </p>
              </div>
              {e.publish_date && (
                <span className="text-xs text-ink-500 shrink-0">
                  {new Date(e.publish_date).toLocaleDateString('pt-BR')}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
