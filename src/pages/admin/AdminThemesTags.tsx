import { useEffect, useState } from 'react';
import { Plus, X, Trash2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { listAllThemesFlat, createTheme, deleteTheme } from '../../services/themes';
import { listAllTags, findOrCreateTag, deleteTag } from '../../services/tags';
import type { Theme, Tag } from '../../types/database.types';

export default function AdminThemesTags() {
  const { isAdmin } = useAuth();

  const [themes, setThemes] = useState<Theme[]>([]);
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [themeParent, setThemeParent] = useState('');
  const [creatingTheme, setCreatingTheme] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);

  const [tags, setTags] = useState<Tag[]>([]);
  const [tagName, setTagName] = useState('');
  const [creatingTag, setCreatingTag] = useState(false);
  const [tagError, setTagError] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  async function reload() {
    const [t, tg] = await Promise.all([listAllThemesFlat(), listAllTags()]);
    setThemes(t);
    setTags(tg);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  const topLevelThemes = themes.filter((t) => !t.parent_id);
  const themeName_ = (id: string | null) => themes.find((t) => t.id === id)?.name ?? '—';

  async function handleCreateTheme(e: React.FormEvent) {
    e.preventDefault();
    if (!themeName.trim()) return;
    setThemeError(null);
    setCreatingTheme(true);
    try {
      await createTheme({ name: themeName, description: themeDescription || undefined, parent_id: themeParent || null });
      setThemeName('');
      setThemeDescription('');
      setThemeParent('');
      await reload();
    } catch (err: any) {
      setThemeError(err.message);
    } finally {
      setCreatingTheme(false);
    }
  }

  async function handleDeleteTheme(id: string) {
    if (!window.confirm('Apagar este tema? Artigos ligados a ele ficam sem tema.')) return;
    try {
      await deleteTheme(id);
      await reload();
    } catch (err: any) {
      alert(`Não foi possível apagar: ${err.message}`);
    }
  }

  async function handleCreateTag(e: React.FormEvent) {
    e.preventDefault();
    if (!tagName.trim()) return;
    setTagError(null);
    setCreatingTag(true);
    try {
      await findOrCreateTag(tagName);
      setTagName('');
      await reload();
    } catch (err: any) {
      setTagError(err.message);
    } finally {
      setCreatingTag(false);
    }
  }

  async function handleDeleteTag(id: string) {
    if (!window.confirm('Apagar esta palavra-chave? Ela some de todos os artigos que a usam.')) return;
    try {
      await deleteTag(id);
      await reload();
    } catch (err: any) {
      alert(`Não foi possível apagar: ${err.message}`);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">Carregando...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold mb-8">Temas e palavras-chave</h1>

      {/* TEMAS */}
      <section>
        <h2 className="font-display text-lg font-semibold mb-3">Temas</h2>

        <form onSubmit={handleCreateTheme} className="border border-dashed border-ink-100 rounded-sm p-3 grid grid-cols-2 gap-2 mb-4">
          <input
            placeholder="Nome do tema *"
            value={themeName}
            onChange={(e) => setThemeName(e.target.value)}
            className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm col-span-2"
          />
          <input
            placeholder="Descrição (opcional)"
            value={themeDescription}
            onChange={(e) => setThemeDescription(e.target.value)}
            className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm col-span-2"
          />
          <select
            value={themeParent}
            onChange={(e) => setThemeParent(e.target.value)}
            className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm col-span-2 bg-white"
          >
            <option value="">Tema principal (sem pai)</option>
            {topLevelThemes.map((t) => (
              <option key={t.id} value={t.id}>Subtema de: {t.name}</option>
            ))}
          </select>
          {themeError && <p className="col-span-2 text-xs text-red-600">{themeError}</p>}
          <button
            disabled={creatingTheme}
            className="col-span-2 flex items-center justify-center gap-1.5 text-sm text-brass-600 hover:text-brass-500 py-1.5 disabled:opacity-50"
          >
            <Plus size={14} /> {creatingTheme ? 'Criando...' : 'Criar tema'}
          </button>
        </form>

        <div className="border border-ink-100 rounded-sm bg-paper-50 divide-y divide-ink-100">
          {themes.length === 0 ? (
            <p className="text-sm text-ink-500 p-4 text-center">Nenhum tema criado ainda.</p>
          ) : (
            themes.map((t) => (
              <div key={t.id} className="flex items-center justify-between px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-ink-500">
                    {t.parent_id ? `Subtema de ${themeName_(t.parent_id)}` : 'Tema principal'}
                  </p>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDeleteTheme(t.id)} className="text-ink-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* TAGS */}
      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold mb-3">Palavras-chave (tags)</h2>

        <form onSubmit={handleCreateTag} className="flex gap-2 mb-4">
          <input
            placeholder="Nova palavra-chave"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            className="flex-1 border border-ink-100 rounded-sm px-2 py-1.5 text-sm"
          />
          <button disabled={creatingTag} className="text-sm text-brass-600 hover:text-brass-500 disabled:opacity-50">
            {creatingTag ? 'Criando...' : 'Adicionar'}
          </button>
        </form>
        {tagError && <p className="text-xs text-red-600 mb-2">{tagError}</p>}

        <div className="flex flex-wrap gap-2">
          {tags.length === 0 ? (
            <p className="text-sm text-ink-500">Nenhuma palavra-chave criada ainda.</p>
          ) : (
            tags.map((tag) => (
              <span key={tag.id} className="specimen-tag !normal-case">
                {tag.name}
                {isAdmin && (
                  <button onClick={() => handleDeleteTag(tag.id)} className="ml-1">
                    <X size={12} />
                  </button>
                )}
              </span>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
