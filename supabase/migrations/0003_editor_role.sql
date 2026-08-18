-- =========================================================
-- Adiciona o papel "editor" (gestão de conteúdo: revisão,
-- publicação, temas e tags) separado de "admin" (gestão de
-- conteúdo + usuários).
--
-- IMPORTANTE: rode a PARTE 1 sozinha primeiro (Run), espere
-- terminar, e só depois rode a PARTE 2. O Postgres não deixa
-- usar um valor de enum recém-criado na mesma transação em
-- que ele foi criado.
-- =========================================================

-- ---------- PARTE 1 (rode e espere terminar) ----------
alter type user_role add value if not exists 'editor';


-- ---------- PARTE 2 (rode depois, em uma nova query) ----------

-- helper: é editor OU admin (ambos gerenciam conteúdo)
create or replace function public.is_editor()
returns boolean as $$
  select exists (
    select 1 from public.users where id = auth.uid() and role in ('editor', 'admin')
  );
$$ language sql stable security definer;

-- THEMES: editor e admin podem criar/editar; apagar continua só admin
drop policy if exists "Só admin gerencia temas" on public.themes;
create policy "Editor e admin criam temas"
  on public.themes for insert with check (public.is_editor());

drop policy if exists "Só admin atualiza temas" on public.themes;
create policy "Editor e admin atualizam temas"
  on public.themes for update using (public.is_editor());

-- TAGS: editor e admin podem gerenciar
drop policy if exists "Só admin gerencia tags" on public.tags;
create policy "Editor e admin gerenciam tags"
  on public.tags for insert with check (public.is_editor());

-- ARTICLES: editor e admin podem editar qualquer artigo (necessário para
-- revisar/publicar), além do próprio autor
drop policy if exists "Autor edita seus artigos, admin edita todos" on public.articles;
create policy "Autor, editor e admin editam artigos"
  on public.articles for update using (author_id = auth.uid() or public.is_editor());

drop policy if exists "Artigos publicados são públicos" on public.articles;
create policy "Artigos publicados, próprios, ou visíveis a editor/admin"
  on public.articles for select
  using (status = 'published' or author_id = auth.uid() or public.is_editor());

-- REFERENCES / ARTICLE_TAGS: acompanham quem pode editar o artigo
drop policy if exists "Autor gerencia referências do próprio artigo" on public."references";
create policy "Autor, editor e admin gerenciam referências"
  on public."references" for all using (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_editor()))
  );

drop policy if exists "Autor gerencia tags do próprio artigo" on public.article_tags;
create policy "Autor, editor e admin gerenciam tags do artigo"
  on public.article_tags for insert with check (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_editor()))
  );

drop policy if exists "Autor remove tags do próprio artigo" on public.article_tags;
create policy "Autor, editor e admin removem tags do artigo"
  on public.article_tags for delete using (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_editor()))
  );

-- ARTICLE_VERSIONS
drop policy if exists "Autor e admin veem versões do artigo" on public.article_versions;
create policy "Autor, editor e admin veem versões"
  on public.article_versions for select using (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_editor()))
  );

drop policy if exists "Autor e admin criam versões" on public.article_versions;
create policy "Autor, editor e admin criam versões"
  on public.article_versions for insert with check (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_editor()))
  );

-- REVIEWS: editor e admin decidem revisões
drop policy if exists "Só admin cria revisões" on public.reviews;
create policy "Editor e admin criam revisões"
  on public.reviews for insert with check (public.is_editor());

drop policy if exists "Autor vê revisões do próprio artigo, admin vê todas" on public.reviews;
create policy "Autor vê as próprias, editor/admin veem todas"
  on public.reviews for select using (
    exists (select 1 from public.articles a where a.id = article_id and (a.author_id = auth.uid() or public.is_editor()))
  );

-- USERS: só admin (não editor) pode mudar o role/dados de outra pessoa —
-- necessário para a futura tela de gestão de usuários.
create policy "Admin gerencia qualquer usuário"
  on public.users for update using (public.is_admin());
