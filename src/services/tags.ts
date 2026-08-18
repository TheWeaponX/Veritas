import { supabase } from '../lib/supabase';
import type { Tag } from '../types/database.types';

export async function listAllTags() {
  const { data, error } = await supabase.from('tags').select('*').order('name');
  if (error) throw error;
  return data as Tag[];
}

export async function findOrCreateTag(name: string) {
  const slug = name.trim().toLowerCase().replace(/\s+/g, '-');
  const { data: existing } = await supabase.from('tags').select('*').eq('slug', slug).maybeSingle();
  if (existing) return existing as Tag;
  const { data, error } = await supabase.from('tags').insert({ name: name.trim(), slug }).select().single();
  if (error) throw error;
  return data as Tag;
}

export async function setArticleTags(articleId: string, tagIds: string[]) {
  await supabase.from('article_tags').delete().eq('article_id', articleId);
  if (tagIds.length === 0) return;
  const { error } = await supabase.from('article_tags').insert(tagIds.map((tag_id) => ({ article_id: articleId, tag_id })));
  if (error) throw error;
}

export async function getArticleTags(articleId: string) {
  const { data, error } = await supabase.from('article_tags').select('tag_id, tags(*)').eq('article_id', articleId);
  if (error) throw error;
  return (data ?? []).map((row: any) => row.tags as Tag);
}

export async function deleteTag(id: string) {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}
