import { supabase } from '../lib/supabase';
import { slugify } from '../utils/slugify';
import type { Article, ArticleStatus } from '../types/database.types';

export async function listPublishedArticles(limit = 6) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, themes:theme_id(name, slug), users:author_id(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, themes:theme_id(name, slug), users:author_id(name, biography, profile_image), references:references(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getArticleById(id: string) {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Article;
}

export async function listPublishedByAuthor(authorId: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, themes:theme_id(name, slug)')
    .eq('author_id', authorId)
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function listMyArticles(authorId: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('author_id', authorId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data as Article[];
}

export async function createDraft(authorId: string, title: string) {
  const slug = slugify(title) + '-' + Math.random().toString(36).slice(2, 7);
  const { data, error } = await supabase
    .from('articles')
    .insert({ title, slug, author_id: authorId, status: 'draft' as ArticleStatus, content: {} })
    .select()
    .single();
  if (error) throw error;
  return data as Article;
}

export async function saveArticle(articleId: string, patch: Partial<Article>) {
  const { data, error } = await supabase.from('articles').update(patch).eq('id', articleId).select().single();
  if (error) throw error;
  return data as Article;
}

export async function submitForReview(articleId: string) {
  return saveArticle(articleId, { status: 'submitted' });
}

export async function listSubmittedArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*, users:author_id(name, email), themes:theme_id(name)')
    .eq('status', 'submitted')
    .order('updated_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function approveArticle(articleId: string) {
  // Não publica direto: só move para a fila de "aprovado, aguardando
  // edição". Quem publica é o fechamento da edição (services/editions.ts).
  return saveArticle(articleId, { status: 'approved' });
}

export async function rejectArticle(articleId: string) {
  return saveArticle(articleId, { status: 'rejected' });
}

export async function requestChangesOnArticle(articleId: string) {
  return saveArticle(articleId, { status: 'changes_requested' });
}

export async function listRejectedArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*, users:author_id(name), themes:theme_id(name)')
    .eq('status', 'rejected')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteArticlePermanently(articleId: string) {
  const { error } = await supabase.from('articles').delete().eq('id', articleId);
  if (error) throw error;
}

export async function searchArticles(query: string) {
  // Busca por título/resumo, e também por tema ou palavra-chave — mas tema
  // e tag nunca aparecem como filtro visível na UI, só influenciam quais
  // resultados voltam (a "tag escondida" que você pediu).
  const q = query.trim();
  if (!q) return [];

  const [themeMatches, tagMatches] = await Promise.all([
    supabase.from('themes').select('id').ilike('name', `%${q}%`),
    supabase.from('tags').select('id').ilike('name', `%${q}%`),
  ]);

  let articleIdsFromMeta: string[] = [];
  if (tagMatches.data && tagMatches.data.length > 0) {
    const { data: viaTags } = await supabase
      .from('article_tags')
      .select('article_id')
      .in('tag_id', tagMatches.data.map((t) => t.id));
    articleIdsFromMeta.push(...(viaTags ?? []).map((r) => r.article_id));
  }

  const themeIds = (themeMatches.data ?? []).map((t) => t.id);

  let orParts = [`title.ilike.%${q}%`, `summary.ilike.%${q}%`];
  if (themeIds.length > 0) orParts.push(`theme_id.in.(${themeIds.join(',')})`, `subtheme_id.in.(${themeIds.join(',')})`);
  if (articleIdsFromMeta.length > 0) orParts.push(`id.in.(${[...new Set(articleIdsFromMeta)].join(',')})`);

  const { data, error } = await supabase
    .from('articles')
    .select('*, themes:theme_id(name), users:author_id(name)')
    .eq('status', 'published')
    .or(orParts.join(','))
    .limit(20);
  if (error) throw error;
  return data ?? [];
}
