import { supabase } from '../lib/supabase';
import { slugify } from '../utils/slugify';
import type { Theme } from '../types/database.types';

export async function listTopLevelThemes(): Promise<Theme[]> {
  const { data, error } = await supabase.from('themes').select('*').is('parent_id', null).order('name');
  if (error) throw error;
  return data ?? [];
}

export async function getThemeBySlug(slug: string): Promise<Theme | null> {
  const { data, error } = await supabase.from('themes').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listSubthemes(parentId: string): Promise<Theme[]> {
  const { data, error } = await supabase.from('themes').select('*').eq('parent_id', parentId).order('name');
  if (error) throw error;
  return data ?? [];
}

// ---------- Gestão (admin/editor) ----------

export async function listAllThemesFlat(): Promise<Theme[]> {
  const { data, error } = await supabase.from('themes').select('*').order('name');
  if (error) throw error;
  return data ?? [];
}

export async function createTheme(input: { name: string; description?: string; parent_id?: string | null }) {
  const slug = slugify(input.name) + '-' + Math.random().toString(36).slice(2, 6);
  const { data, error } = await supabase
    .from('themes')
    .insert({ name: input.name, slug, description: input.description || null, parent_id: input.parent_id || null })
    .select()
    .single();
  if (error) throw error;
  return data as Theme;
}

export async function updateTheme(id: string, patch: Partial<Pick<Theme, 'name' | 'description' | 'parent_id'>>) {
  const { data, error } = await supabase.from('themes').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data as Theme;
}

export async function deleteTheme(id: string) {
  const { error } = await supabase.from('themes').delete().eq('id', id);
  if (error) throw error;
}
