import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listPublicAuthors } from '../services/users';
import type { UserProfile } from '../types/database.types';

export default function AuthorsList() {
  const [authors, setAuthors] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPublicAuthors().then(setAuthors).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-display text-3xl font-semibold mb-1">Autores</h1>
      <p className="text-ink-500 mb-10">Conheça quem escreve e revisa o conteúdo da Scientia Periodica.</p>

      {loading ? (
        <p className="text-sm text-ink-500">Carregando...</p>
      ) : authors.length === 0 ? (
        <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-8 text-center">
          Nenhum autor cadastrado ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {authors.map((a) => (
            <Link key={a.id} to={`/autores/${a.slug}`} className="border border-ink-100 rounded-sm p-5 bg-paper-50 hover:border-brass-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-ink-100 overflow-hidden mb-3">
                {a.profile_image && <img src={a.profile_image} alt={a.name} className="w-full h-full object-cover" />}
              </div>
              <p className="font-display text-lg font-medium">{a.name}</p>
              {a.institution && <p className="text-xs text-ink-500 mt-0.5">{a.institution}</p>}
              {a.biography && <p className="text-sm text-ink-500 mt-2 line-clamp-2">{a.biography}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
