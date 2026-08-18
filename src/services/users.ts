import { supabase } from '../lib/supabase';
import type { UserProfile, UserRole } from '../types/database.types';

export async function listAllUsers() {
  const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data as UserProfile[];
}

export async function updateUserRole(userId: string, role: UserRole) {
  const { data, error } = await supabase.from('users').update({ role }).eq('id', userId).select().single();
  if (error) throw error;
  return data as UserProfile;
}

// ---------- Perfil público de autor ----------

export async function listPublicAuthors() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .in('role', ['author', 'editor', 'admin'])
    .order('name');
  if (error) throw error;
  return data as UserProfile[];
}

export async function getUserBySlug(slug: string) {
  const { data, error } = await supabase.from('users').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as UserProfile | null;
}

// ---------- Edição do próprio perfil ----------

export async function updateOwnProfile(
  userId: string,
  patch: Partial<Pick<UserProfile, 'name' | 'biography' | 'interests' | 'institution' | 'professional_links' | 'profile_image'>>
) {
  const { data, error } = await supabase.from('users').update(patch).eq('id', userId).select().single();
  if (error) throw error;
  return data as UserProfile;
}
