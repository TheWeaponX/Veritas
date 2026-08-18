import { supabase } from '../lib/supabase';
import type { ArticleReference } from '../types/database.types';

export async function listReferences(articleId: string) {
  const { data, error } = await supabase.from('references').select('*').eq('article_id', articleId);
  if (error) throw error;
  return data as ArticleReference[];
}

export async function addReference(articleId: string, ref: Omit<ArticleReference, 'id' | 'article_id'>) {
  const { data, error } = await supabase
    .from('references')
    .insert({ ...ref, article_id: articleId })
    .select()
    .single();
  if (error) throw error;
  return data as ArticleReference;
}

export async function removeReference(id: string) {
  const { error } = await supabase.from('references').delete().eq('id', id);
  if (error) throw error;
}
