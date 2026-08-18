-- =========================================================
-- Dados de demonstração — rode depois de criar seu primeiro
-- usuário admin (veja README, seção "Criar o primeiro admin")
-- =========================================================

insert into public.themes (name, slug, description) values
  ('Astronomia', 'astronomia', 'O estudo dos astros, do sistema solar às galáxias mais distantes.'),
  ('Biologia', 'biologia', 'A ciência da vida, dos genes aos ecossistemas.')
on conflict (slug) do nothing;

insert into public.themes (name, slug, description, parent_id)
select 'Cosmologia', 'cosmologia', 'A origem e evolução do universo.', id from public.themes where slug = 'astronomia'
on conflict (slug) do nothing;

insert into public.themes (name, slug, description, parent_id)
select 'Buracos Negros', 'buracos-negros-subtema', 'Regiões do espaço-tempo de gravidade extrema.', id from public.themes where slug = 'astronomia'
on conflict (slug) do nothing;

-- Os artigos de demonstração exigem um author_id existente.
-- Troque 'SEU_USER_ID_AQUI' pelo id do seu usuário (public.users.id)
-- depois de criar sua conta pelo app. Veja instruções no README.

-- Exemplo (descomente e ajuste o UUID antes de rodar):
-- insert into public.articles (title, slug, summary, content, status, author_id, theme_id, is_demo, published_at)
-- select
--   'Buracos Negros',
--   'buracos-negros',
--   'Este é um artigo de demonstração. Regiões do espaço-tempo onde a gravidade é tão intensa que nada, nem a luz, escapa.',
--   '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Conteúdo de demonstração."}]}]}'::jsonb,
--   'published',
--   'SEU_USER_ID_AQUI',
--   t.id,
--   true,
--   now()
-- from public.themes t where t.slug = 'astronomia';
