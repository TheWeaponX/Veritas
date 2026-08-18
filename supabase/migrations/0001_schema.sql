-- =========================================================
-- Enciclopédia Científica Digital — schema inicial
-- Rode este arquivo no SQL Editor do seu projeto Supabase
-- =========================================================

-- ---------- ENUMS ----------
create type user_role as enum ('reader', 'author', 'admin');

create type article_status as enum (
  'draft',
  'submitted',
  'changes_requested',
  'approved',
  'published',
  'archived',
  'rejected'
);

create type review_status as enum ('approved', 'rejected', 'changes_requested');

-- ---------- USERS ----------
-- Espelha auth.users (Supabase Auth) com dados de perfil públicos.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  role user_role not null default 'reader',
  profile_image text,
  biography text,
  interests text[],
  institution text,
  professional_links jsonb default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- THEMES ----------
create table public.themes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image text,
  parent_id uuid references public.themes(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- TAGS ----------
create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

-- ---------- ARTICLES ----------
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  content jsonb not null default '{}'::jsonb, -- documento rico (Tiptap JSON)
  status article_status not null default 'draft',
  author_id uuid not null references public.users(id) on delete cascade,
  theme_id uuid references public.themes(id) on delete set null,
  subtheme_id uuid references public.themes(id) on delete set null,
  featured_image text,
  is_demo boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- ---------- REFERENCES ----------
create table public."references" (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  author text,
  title text not null,
  publication text,
  year int,
  url text,
  doi text
);

-- ---------- FAVORITES ----------
create table public.favorites (
  user_id uuid references public.users(id) on delete cascade,
  article_id uuid references public.articles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, article_id)
);

-- ---------- ARTICLE VERSIONS ----------
create table public.article_versions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  editor_id uuid not null references public.users(id),
  content jsonb not null,
  title text not null,
  created_at timestamptz not null default now()
);

-- ---------- REVIEWS ----------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.articles(id) on delete cascade,
  reviewer_id uuid not null references public.users(id),
  status review_status not null,
  comment text,
  created_at timestamptz not null default now()
);

-- ---------- Trigger: cria linha em public.users ao registrar ----------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email, 'author');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Trigger: updated_at automático ----------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_users before update on public.users
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at_articles before update on public.articles
  for each row execute procedure public.set_updated_at();

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================
alter table public.users enable row level security;
alter table public.themes enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;
alter table public."references" enable row level security;
alter table public.favorites enable row level security;
alter table public.article_versions enable row level security;
alter table public.reviews enable row level security;

-- helper: é admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
$$ language sql stable security definer;

-- USERS
create policy "Perfis públicos são visíveis a todos"
  on public.users for select using (true);
create policy "Usuário edita o próprio perfil"
  on public.users for update using (auth.uid() = id);

-- THEMES / TAGS: leitura pública, escrita só admin
create policy "Temas visíveis a todos" on public.themes for select using (true);
create policy "Só admin gerencia temas" on public.themes for insert with check (public.is_admin());
create policy "Só admin atualiza temas" on public.themes for update using (public.is_admin());
create policy "Só admin apaga temas" on public.themes for delete using (public.is_admin());

create policy "Tags visíveis a todos" on public.tags for select using (true);
create policy "Só admin gerencia tags" on public.tags for insert with check (public.is_admin());

-- ARTICLES
create policy "Artigos publicados são públicos"
  on public.articles for select
  using (status = 'published' or author_id = auth.uid() or public.is_admin());

create policy "Autor cria seus artigos"
  on public.articles for insert
  with check (author_id = auth.uid());

create policy "Autor edita seus artigos, admin edita todos"
  on public.articles for update
  using (author_id = auth.uid() or public.is_admin());

create policy "Autor apaga seus rascunhos, admin apaga qualquer um"
  on public.articles for delete
  using ((author_id = auth.uid() and status = 'draft') or public.is_admin());

-- ARTICLE_TAGS / REFERENCES: seguem o artigo
create policy "Tags do artigo visíveis conforme o artigo"
  on public.article_tags for select using (true);
create policy "Autor gerencia tags do próprio artigo"
  on public.article_tags for insert with check (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_admin()))
  );
create policy "Autor remove tags do próprio artigo"
  on public.article_tags for delete using (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_admin()))
  );

create policy "Referências visíveis a todos" on public."references" for select using (true);
create policy "Autor gerencia referências do próprio artigo"
  on public."references" for all using (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_admin()))
  );

-- FAVORITES
create policy "Usuário vê e gerencia os próprios favoritos"
  on public.favorites for all using (auth.uid() = user_id);

-- ARTICLE_VERSIONS
create policy "Autor e admin veem versões do artigo"
  on public.article_versions for select using (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_admin()))
  );
create policy "Autor e admin criam versões"
  on public.article_versions for insert with check (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_admin()))
  );

-- REVIEWS
create policy "Autor vê revisões do próprio artigo, admin vê todas"
  on public.reviews for select using (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_admin()))
  );
create policy "Só admin cria revisões"
  on public.reviews for insert with check (public.is_admin());

-- ---------- Índices úteis ----------
create index idx_articles_status on public.articles(status);
create index idx_articles_theme on public.articles(theme_id);
create index idx_articles_author on public.articles(author_id);
create index idx_articles_slug on public.articles(slug);
create index idx_themes_parent on public.themes(parent_id);
