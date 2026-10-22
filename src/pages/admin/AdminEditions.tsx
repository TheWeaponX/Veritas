import { useEffect, useState } from 'react';
import { Star, X, Send, GripVertical, Image as ImageIcon, Loader2 } from 'lucide-react';
import {
  listDraftEditions,
  createEdition,
  listApprovedUnassignedArticles,
  assignArticleToEdition,
  removeArticleFromEdition,
  setCoverArticle,
  closeAndPublishEdition,
  reorderArticlesInEdition,
} from '../../services/editions';
import { supabase } from '../../lib/supabase';
import type { Edition } from '../../types/database.types';

export default function AdminEditions() {
  const [drafts, setDrafts] = useState<Edition[]>([]);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [assignedByEdition, setAssignedByEdition] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [uploadingCover, setUploadingCover] = useState<string | null>(null);

  async function reload() {
    const [d, u] = await Promise.all([listDraftEditions(), listApprovedUnassignedArticles()]);
    setDrafts(d);
    setUnassigned(u);

    const map: Record<string, any[]> = {};
    for (const ed of d) {
      const { data } = await supabase.from('articles').select('*, users:author_id(name)').eq('edition_id', ed.id).order('position');
      map[ed.id] = data ?? [];
    }
    setAssignedByEdition(map);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleCreateEdition(e: React.FormEvent) {
    e.preventDefault();
    if (!newDate) return;
    setCreating(true);
    try {
      await createEdition({ title: newTitle || undefined, description: newDescription || undefined, publish_date: newDate });
      setNewTitle('');
      setNewDate('');
      setNewDescription('');
      await reload();
    } finally {
      setCreating(false);
    }
  }

  async function handleAssign(articleId: string, editionId: string) {
    await assignArticleToEdition(articleId, editionId);
    await reload();
  }

  async function handleRemove(articleId: string) {
    await removeArticleFromEdition(articleId);
    await reload();
  }

  async function handleSetCover(editionId: string, articleId: string) {
    await setCoverArticle(editionId, articleId);
    await reload();
  }

  async function handleClose(editionId: string) {
    if (!window.confirm('Fechar e publicar esta edição? Todos os artigos atribuídos a ela vão ao ar imediatamente, de uma vez.')) return;
    await closeAndPublishEdition(editionId);
    await reload();
  }

  // ---------- Upload de Capa ----------
  async function handleUploadCover(editionId: string, file: File) {
    if (!file) return;
    setUploadingCover(editionId);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${editionId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('editions')
        .update({ cover_url: publicUrl })
        .eq('id', editionId);

      if (updateError) throw updateError;

      await reload();
    } catch (error) {
      console.error("Erro no upload da capa:", error);
      alert("Erro ao enviar a imagem. Verifique se o bucket 'covers' é público.");
    } finally {
      setUploadingCover(null);
    }
  }

  // ---------- Arrastar e soltar pra reordenar ----------
  const [dragEditionId, setDragEditionId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDragStart(editionId: string, index: number) {
    setDragEditionId(editionId);
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, editionId: string, overIndex: number) {
    e.preventDefault();
    if (dragEditionId !== editionId || dragIndex === null || dragIndex === overIndex) return;
    setAssignedByEdition((prev) => {
      const list = [...(prev[editionId] ?? [])];
      const [moved] = list.splice(dragIndex, 1);
      list.splice(overIndex, 0, moved);
      return { ...prev, [editionId]: list };
    });
    setDragIndex(overIndex);
  }

  async function handleDragEnd(editionId: string) {
    setDragEditionId(null);
    setDragIndex(null);
    const orderedIds = (assignedByEdition[editionId] ?? []).map((a) => a.id);
    await reorderArticlesInEdition(orderedIds);
  }

  if (loading) return <p className="text-sm text-ink-500">Carregando...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold mb-1">Edições</h1>
      <p className="text-sm text-ink-500 mb-8">Monte a próxima edição e publique tudo de uma vez.</p>

      <section className="mb-10">
        <h2 className="font-display text-lg font-semibold mb-3">Nova edição</h2>
        <form onSubmit={handleCreateEdition} className="border border-dashed border-ink-100 rounded-sm p-3 grid grid-cols-2 gap-2">
          <input placeholder="Título (opcional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="input col-span-2" />
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="input" required />
          <input placeholder="Descrição (opcional)" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="input" />
          <button disabled={creating} className="col-span-2 bg-ink-900 text-paper-50 text-sm font-medium py-2 rounded-sm disabled:opacity-50">
            {creating ? 'Criando...' : 'Criar edição (rascunho)'}
          </button>
        </form>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-lg font-semibold mb-3">Aprovados aguardando edição</h2>
        {unassigned.length === 0 ? (
          <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-4 text-center">
            Nenhum artigo aprovado esperando entrar em uma edição.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {unassigned.map((a) => (
              <div key={a.id} className="flex items-center justify-between border border-ink-100 rounded-sm px-3 py-2 bg-paper-50 text-sm">
                <span>{a.title} <span className="text-ink-500">— {a.users?.name}</span></span>
                {drafts.length > 0 && (
                  <select
                    defaultValue=""
                    onChange={(e) => e.target.value && handleAssign(a.id, e.target.value)}
                    className="border border-ink-100 rounded-sm px-2 py-1 text-xs bg-white"
                  >
                    <option value="" disabled>Atribuir a...</option>
                    {drafts.map((d) => (
                      <option key={d.id} value={d.id}>Edição #{d.number}</option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
        {drafts.length === 0 && unassigned.length > 0 && (
          <p className="text-xs text-ink-500 mt-2">Crie uma edição acima para poder atribuir estes artigos.</p>
        )}
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold mb-3">Edições em montagem</h2>
        {drafts.length === 0 ? (
          <p className="text-sm text-ink-500 border border-dashed border-ink-100 rounded-sm p-4 text-center">Nenhuma edição em rascunho.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {drafts.map((ed) => (
              <div key={ed.id} className="border border-ink-100 rounded-sm bg-paper-50 p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-4 items-center">
                    {ed.cover_url ? (
                      <img src={ed.cover_url} alt="Capa da edição" className="w-16 h-20 object-cover rounded-sm border border-ink-200" />
                    ) : (
                      <div className="w-16 h-20 bg-ink-50 border border-dashed border-ink-200 rounded-sm flex items-center justify-center">
                        <ImageIcon size={20} className="text-ink-300" />
                      </div>
                    )}
                    
                    <div>
                      <p className="font-display text-lg font-medium">
                        Edição #{ed.number}{ed.title && ` — ${ed.title}`}
                      </p>
                      <p className="text-xs text-ink-500 mt-1">
                        Data prevista: {ed.publish_date && new Date(ed.publish_date).toLocaleDateString('pt-BR')}
                      </p>
                      
                      <div className="mt-2">
                        <label className="cursor-pointer inline-flex items-center gap-1 text-xs font-medium text-brass-600 hover:text-brass-700 transition-colors">
                          {uploadingCover === ed.id ? (
                            <><Loader2 size={12} className="animate-spin" /> Enviando...</>
                          ) : (
                            <>{ed.cover_url ? 'Alterar capa' : 'Adicionar capa'}</>
                          )}
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            disabled={uploadingCover === ed.id}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadCover(ed.id, file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClose(ed.id)}
                    disabled={(assignedByEdition[ed.id]?.length ?? 0) === 0}
                    className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-3 py-1.5 rounded-sm disabled:opacity-50"
                  >
                    <Send size={14} /> Fechar e publicar
                  </button>
                </div>

                <div className="border-t border-ink-100 pt-3 flex flex-col gap-2">
                  <p className="text-xs text-ink-500 mb-1">Arraste os artigos abaixo para reordenar:</p>
                  {(assignedByEdition[ed.id] ?? []).length === 0 ? (
                    <p className="text-xs text-ink-500 italic">Nenhum artigo atribuído ainda.</p>
                  ) : (
                    assignedByEdition[ed.id].map((a, index) => (
                      <div
                        key={a.id}
                        draggable
                        onDragStart={() => handleDragStart(ed.id, index)}
                        onDragOver={(e) => handleDragOver(e, ed.id, index)}
                        onDragEnd={() => handleDragEnd(ed.id)}
                        className="flex items-center justify-between text-sm border border-ink-100 rounded-sm px-3 py-1.5 bg-white cursor-grab active:cursor-grabbing"
                      >
                        <span className="flex items-center gap-1.5">
                          <GripVertical size={14} className="text-ink-300 shrink-0" />
                          {ed.cover_article_id === a.id && <Star size={13} className="text-brass-500 fill-brass-500" />}
                          {a.title} <span className="text-ink-500">— {a.users?.name}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleSetCover(ed.id, a.id)} className="text-xs text-brass-600 hover:text-brass-500">
                            Destacar
                          </button>
                          <button onClick={() => handleRemove(a.id)} className="text-ink-400 hover:text-red-600">
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
