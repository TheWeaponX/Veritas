import { supabase } from '../lib/supabase';
import type { Review } from '../types/database.types';

export async function createReview(
  articleId: string,
  reviewerId: string,
  status: Review['status'],
  comment?: string | null
) {
  const { data, error } = await supabase
    .from('reviews')
    .insert({ article_id: articleId, reviewer_id: reviewerId, status, comment: comment || null })
    .select()
    .single();
  if (error) throw error;
  return data as Review;
}

export async function listArticleReviews(articleId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select('*, users:reviewer_id(name)')
    .eq('article_id', articleId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}
