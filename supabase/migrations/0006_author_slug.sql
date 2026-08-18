-- =========================================================
-- Adiciona slug ao usuário (para /autores/:slug) e gera slug
-- automaticamente em cadastros novos e para usuários existentes.
-- =========================================================

-- Tenta habilitar unaccent (remove acentos do slug). Se der erro de
-- permissão, vá em Database → Extensions no painel do Supabase e habilite
-- "unaccent" manualmente, depois rode o resto deste arquivo.
create extension if not exists unaccent;

alter table public.users add column if not exists slug text unique;

create or replace function public.generate_user_slug(base_name text)
returns text as $$
declare
  candidate text;
  base text;
begin
  base := lower(regexp_replace(unaccent(coalesce(base_name, 'usuario')), '[^a-zA-Z0-9]+', '-', 'g'));
  base := trim(both '-' from base);
  if base = '' then base := 'usuario'; end if;
  candidate := base || '-' || substr(md5(random()::text), 1, 5);
  return candidate;
end;
$$ language plpgsql;

-- Atualiza o trigger de novo usuário para já gerar o slug
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role, slug)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    new.email,
    'reader',
    public.generate_user_slug(coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Backfill: usuários que já existiam e ainda não têm slug
update public.users
set slug = public.generate_user_slug(name)
where slug is null;
