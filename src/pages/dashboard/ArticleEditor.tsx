import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import RichTextEditor from '../../components/editor/RichTextEditor';
import { getArticleById, saveArticle, submitForReview } from '../../services/articles';
import { listTopLevelThemes, listSubthemes } from '../../services/themes';
import { listReferences, addReference, removeReference } from '../../services/references';
import { getArticleTags, setArticleTags, findOrCreateTag } from '../../services/tags';
import { useAutosave } from '../../hooks/useAutosave';
import type { Article, ArticleReference, Theme } from '../../types/database.types';

const STATUS_LABEL: Record<string, string> = {
  draft: 'Rascunho',
  submitted: 'Em revisão',
  changes_requested: 'Alterações solicitadas',
  approved: 'Aprovado, aguardando edição',
  published: 'Publicado',
  archived: 'Arquivado',
  rejected: 'Rejeitado',
};

export default function ArticleEditor() {
  const { id } = useParams();

  const [article, setArticle] = useState<Article | null>(null);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [themeId, setThemeId] = useState('');
  const [subthemeId, setSubthemeId] = useState('');
  const [themes, setThemes] = useState<Theme[]>([]);
  const [subthemes, setSubthemes] = useState<Theme[]>([]);

  const [tagNames, setTagNames] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const [references, setReferences] = useState<ArticleReference[]>([]);
  const [newRef, setNewRef] = useState({ title: '', author: '', publication: '', year: '', url: '', doi: '' });

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setLoadError(null);
    (async () => {
      try {
        const [a, allThemes] = await Promise.all([getArticleById(id), listTopLevelThemes()]);
        setArticle(a);
        setTitle(a.title);
        setSummary(a.summary ?? '');
        setContent(a.content ?? {});
        setThemeId(a.theme_id ?? '');
        setSubthemeId(a.subtheme_id ?? '');
        setThemes(allThemes);

        const [refs, tags] = await Promise.all([listReferences(id), getArticleTags(id)]);
        setReferences(refs);
        setTagNames(tags.map((t) => t.name));
      } catch (e: any) {
        setLoadError(e.message ?? 'Erro desconhecido ao carregar o artigo.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (themeId) listSubthemes(themeId).then(setSubthemes);
    else setSubthemes([]);
  }, [themeId]);

  const canEdit = article && (article.status === 'draft' || article.status === 'changes_requested');

  const autosavePayload = { title, summary, content, themeId, subthemeId };
  const { status, secondsAgo, saveNow } = useAutosave(
    autosavePayload,
    useCallback(
      async (data) => {
        if (!id) return;
        await saveArticle(id, {
          title: data.title,
          summary: data.summary,
          content: data.content,
          theme_id: data.themeId || null,
          subtheme_id: data.subthemeId || null,
        });
      },
      [id]
    ),
    1500
  );

  async function handleAddTag() {
    const name = tagInput.trim();
    if (!name || !id) return;
    const tag = await findOrCreateTag(name);
    const updated = [...new Set([...tagNames, tag.name])];
    setTagNames(updated);
    setTagInput('');
    const allTags = await Promise.all(updated.map((n) => findOrCreateTag(n)));
    await setArticleTags(id, allTags.map((t) => t.id));
  }

  async function handleRemoveTag(name: string) {
    if (!id) return;
    const updated = tagNames.filter((t) => t !== name);
    setTagNames(updated);
    const allTags = await Promise.all(updated.map((n) => findOrCreateTag(n)));
    await setArticleTags(id, allTags.map((t) => t.id));
  }

  async function handleAddReference() {
    if (!id || !newRef.title.trim()) return;
    const ref = await addReference(id, {
      title: newRef.title,
      author: newRef.author || null,
      publication: newRef.publication || null,
      year: newRef.year ? Number(newRef.year) : null,
      url: newRef.url || null,
      doi: newRef.doi || null,
    });
    setReferences((prev) => [...prev, ref]);
    setNewRef({ title: '', author: '', publication: '', year: '', url: '', doi: '' });
  }

  async function handleRemoveReference(refId: string) {
    await removeReference(refId);
    setReferences((prev) => prev.filter((r) => r.id !== refId));
  }

  async function handleSubmitForReview() {
    if (!id) return;
    setSubmitting(true);
    try {
      await saveNow();
      const updated = await submitForReview(id);
      setArticle(updated);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-sm text-ink-500">Carregando artigo...</p>;
  if (loadError) return <p className="text-sm text-red-600">Erro ao carregar o artigo: {loadError}</p>;
  if (!article) return <p className="text-sm text-red-600">Artigo não encontrado.</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-1">
        <Link to="/dashboard" className="text-xs text-ink-500 hover:text-brass-600">
          ← Voltar aos meus artigos
        </Link>
        <span className="text-xs font-mono uppercase tracking-wider text-ink-500">{STATUS_LABEL[article.status]}</span>
      </div>

      {!canEdit && (
        <div className="mt-4 flex items-center gap-2 bg-ink-50 border border-ink-100 rounded-sm px-3 py-2 text-sm text-ink-700">
          <AlertCircle size={16} />
          Este artigo está em <strong>{STATUS_LABEL[article.status]}</strong> e não pode ser editado agora.
        </div>
      )}

      <label className="text-xs font-mono uppercase tracking-wider text-ink-500 mt-6 block">Título</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={!canEdit}
        placeholder="Título do artigo"
        className="w-full font-display text-2xl font-semibold mt-1.5 outline-none bg-white border border-ink-200 rounded-sm px-3 py-2.5 focus:border-brass-500 disabled:opacity-60"
      />

      <label className="text-xs font-mono uppercase tracking-wider text-ink-500 mt-4 block">Resumo</label>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        disabled={!canEdit}
        placeholder="Resumo do artigo (aparece na listagem e no início da página)"
        rows={2}
        className="w-full mt-1.5 text-ink-600 outline-none bg-white border border-ink-200 rounded-sm px-3 py-2.5 focus:border-brass-500 resize-none disabled:opacity-60"
      />

      <div className="grid grid-cols-2 gap-3 mt-4">
        <select
          value={themeId}
          disabled={!canEdit}
          onChange={(e) => {
            setThemeId(e.target.value);
            setSubthemeId('');
          }}
          className="border border-ink-100 rounded-sm px-3 py-2 text-sm bg-paper-50 disabled:opacity-60"
        >
          <option value="">Tema...</option>
          {themes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <select
          value={subthemeId}
          disabled={!canEdit || subthemes.length === 0}
          onChange={(e) => setSubthemeId(e.target.value)}
          className="border border-ink-100 rounded-sm px-3 py-2 text-sm bg-paper-50 disabled:opacity-60"
        >
          <option value="">Subtema...</option>
          {subthemes.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        {canEdit ? (
          <RichTextEditor content={content} onChange={setContent} />
        ) : (
          <div className="border border-ink-100 rounded-sm bg-white p-4 text-sm text-ink-500">
            Conteúdo bloqueado enquanto o artigo está em {STATUS_LABEL[article.status]}.
          </div>
        )}
      </div>

      {/* TAGS */}
      <div className="mt-8">
        <h3 className="font-display text-lg font-semibold mb-2">Palavras-chave</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {tagNames.map((name) => (
            <span key={name} className="specimen-tag !normal-case">
              {name}
              {canEdit && (
                <button onClick={() => handleRemoveTag(name)} className="ml-1">
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
        {canEdit && (
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Adicionar palavra-chave"
              className="border border-ink-100 rounded-sm px-3 py-1.5 text-sm bg-paper-50"
            />
            <button onClick={handleAddTag} className="text-sm text-brass-600 hover:text-brass-500">
              Adicionar
            </button>
          </div>
        )}
      </div>

      {/* REFERÊNCIAS */}
      <div className="mt-8">
        <h3 className="font-display text-lg font-semibold mb-2">Referências</h3>
        <ul className="flex flex-col gap-2 mb-3">
          {references.map((r) => (
            <li key={r.id} className="flex items-center justify-between text-sm border border-ink-100 rounded-sm px-3 py-2 bg-paper-50">
              <span>
                {r.author && `${r.author}. `}
                {r.title}
                {r.year && ` (${r.year})`}
              </span>
              {canEdit && (
                <button onClick={() => handleRemoveReference(r.id)}>
                  <X size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
        {canEdit && (
          <div className="border border-dashed border-ink-100 rounded-sm p-3 grid grid-cols-2 gap-2">
            <input placeholder="Título *" value={newRef.title} onChange={(e) => setNewRef({ ...newRef, title: e.target.value })} className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm col-span-2" />
            <input placeholder="Autor" value={newRef.author} onChange={(e) => setNewRef({ ...newRef, author: e.target.value })} className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm" />
            <input placeholder="Ano" value={newRef.year} onChange={(e) => setNewRef({ ...newRef, year: e.target.value })} className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm" />
            <input placeholder="Publicação/Revista" value={newRef.publication} onChange={(e) => setNewRef({ ...newRef, publication: e.target.value })} className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm" />
            <input placeholder="DOI" value={newRef.doi} onChange={(e) => setNewRef({ ...newRef, doi: e.target.value })} className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm" />
            <input placeholder="URL" value={newRef.url} onChange={(e) => setNewRef({ ...newRef, url: e.target.value })} className="border border-ink-100 rounded-sm px-2 py-1.5 text-sm col-span-2" />
            <button onClick={handleAddReference} className="col-span-2 flex items-center justify-center gap-1.5 text-sm text-brass-600 hover:text-brass-500 py-1.5">
              <Plus size={14} /> Adicionar referência
            </button>
          </div>
        )}
      </div>

      {/* RODAPÉ FIXO: status do autosave + ações */}
      <div className="sticky bottom-0 mt-10 bg-paper border-t border-ink-100 py-4 flex items-center justify-between">
        <span className="text-xs text-ink-500 flex items-center gap-1.5">
          {status === 'saving' && 'Salvando...'}
          {status === 'saved' && secondsAgo !== null && (
            <>
              <CheckCircle2 size={13} className="text-teal-600" /> Salvo automaticamente há {secondsAgo}s
            </>
          )}
          {status === 'error' && <span className="text-red-600">Erro ao salvar. Tentando de novo...</span>}
        </span>

        {canEdit && (
          <button
            onClick={handleSubmitForReview}
            disabled={submitting}
            className="flex items-center gap-1.5 bg-ink-900 text-paper-50 text-sm font-medium px-4 py-2 rounded-sm hover:bg-ink-700 disabled:opacity-50"
          >
            <Send size={15} /> {submitting ? 'Enviando...' : 'Enviar para revisão'}
          </button>
        )}
      </div>
    </div>
  );
}
