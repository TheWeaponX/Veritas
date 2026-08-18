// Tipos manuais espelhando o schema do supabase/migrations/0001_schema.sql.
// Depois que o projeto Supabase estiver no ar, você pode gerar tipos
// automaticamente com: npx supabase gen types typescript --project-id SEU_ID
// e substituir este arquivo.

export type UserRole = 'reader' | 'author' | 'editor' | 'admin';

export type ArticleStatus =
  | 'draft'
  | 'submitted'
  | 'changes_requested'
  | 'approved'
  | 'published'
  | 'archived'
  | 'rejected';

export interface UserProfile {
  id: string;
  name: string;
  slug: string;
  email: string;
  role: UserRole;
  is_super_admin: boolean;
  profile_image: string | null;
  biography: string | null;
  interests: string[] | null;
  institution: string | null;
  professional_links: { label: string; url: string }[];
  created_at: string;
  updated_at: string;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parent_id: string | null;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface ArticleReference {
  id: string;
  article_id: string;
  author: string | null;
  title: string;
  publication: string | null;
  year: number | null;
  url: string | null;
  doi: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: Record<string, unknown>; // documento Tiptap (JSON)
  status: ArticleStatus;
  author_id: string;
  theme_id: string | null;
  subtheme_id: string | null;
  edition_id: string | null;
  featured_image: string | null;
  is_demo: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
}

export interface Review {
  id: string;
  article_id: string;
  reviewer_id: string;
  status: 'approved' | 'rejected' | 'changes_requested';
  comment: string | null;
  created_at: string;
}

export type EditionStatus = 'draft' | 'published';

export interface Edition {
  id: string;
  number: number;
  title: string | null;
  description: string | null;
  cover_article_id: string | null;
  status: EditionStatus;
  publish_date: string | null;
  created_at: string;
}

// Placeholder simples para o tipo genérico usado pelo supabase-js.
// Ao rodar `supabase gen types`, este tipo é substituído pelo real.
export type Database = any;
