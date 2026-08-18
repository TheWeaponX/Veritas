import { supabase } from '../lib/supabase';
import type { Edition } from '../types/database.types';

export async function getCurrentEdition() {
  const { data, error } = await supabase
    .from('editions')
    .select('*, cover:cover_article_id(id, title, slug, summary, featured_image)')
    .eq('status', 'published')
    .order('publish_date', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listPublishedEditions() {
  const { data, error } = await supabase
    .from('editions')
    .select('*')
    .eq('status', 'published')
    .order('number', { ascending: false });
  if (error) throw error;
  return data as Edition[];
}

export async function getEditionByNumber(number: number) {
  const { data, error } = await supabase
    .from('editions')
    .select('*, cover:cover_article_id(id, title, slug, summary)')
    .eq('number', number)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listArticlesInEdition(editionId: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, themes:theme_id(name), users:author_id(name)')
    .eq('edition_id', editionId)
    .eq('status', 'published')
    .order('title');
  if (error) throw error;
  return data ?? [];
}

// ---------- Gestão (só admin) ----------

export async function listDraftEditions() {
  const { data, error } = await supabase.from('editions').select('*').eq('status', 'draft').order('number', { ascending: false });
  if (error) throw error;
  return data as Edition[];
}

export async function nextEditionNumber() {
  const { data, error } = await supabase.from('editions').select('number').order('number', { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return (data?.number ?? 0) + 1;
}

export async function createEdition(input: { title?: string; description?: string; publish_date: string }) {
  const number = await nextEditionNumber();
  const { data, error } = await supabase
    .from('editions')
    .insert({ number, title: input.title || null, description: input.description || null, publish_date: input.publish_date, status: 'draft' })
    .select()
    .single();
  if (error) throw error;
  return data as Edition;
}

export async function listApprovedUnassignedArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*, users:author_id(name), themes:theme_id(name)')
    .eq('status', 'approved')
    .is('edition_id', null)
    .order('updated_at');
  if (error) throw error;
  return data ?? [];
}

export async function assignArticleToEdition(articleId: string, editionId: string) {
  const { error } = await supabase.from('articles').update({ edition_id: editionId }).eq('id', articleId);
  if (error) throw error;
}

export async function removeArticleFromEdition(articleId: string) {
  const { error } = await supabase.from('articles').update({ edition_id: null }).eq('id', articleId);
  if (error) throw error;
}

export async function setCoverArticle(editionId: string, articleId: string | null) {
  const { error } = await supabase.from('editions').update({ cover_article_id: articleId }).eq('id', editionId);
  if (error) throw error;
}

export async function closeAndPublishEdition(editionId: string, publishDate?: string) {
  const publish_date = publishDate ?? new Date().toISOString();

  const { data: articlesInEdition, error: fetchError } = await supabase
    .from('articles')
    .select('id')
    .eq('edition_id', editionId);
  if (fetchError) throw fetchError;

  if (articlesInEdition && articlesInEdition.length > 0) {
    const { error: updateError } = await supabase
      .from('articles')
      .update({ status: 'published', published_at: publish_date })
      .eq('edition_id', editionId);
    if (updateError) throw updateError;
  }

  const { data, error } = await supabase
    .from('editions')
    .update({ status: 'published', publish_date })
    .eq('id', editionId)
    .select()
    .single();
  if (error) throw error;
  return data as Edition;
}
