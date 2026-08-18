-- =========================================================
-- 1) Cadastro novo vira 'reader' (não mais 'author' automaticamente)
-- 2) Coluna is_super_admin — o admin supremo não pode ser
--    rebaixado nem ter seu status de admin removido por outros admins
-- 3) Só usuários com role author/editor/admin podem criar artigos
-- =========================================================

-- ---------- 1) Trigger de novo usuário: default 'reader' ----------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email, 'reader');
  return new;
end;
$$ language plpgsql security definer;
-- (o trigger em si, on_auth_user_created, já existe e não precisa ser recriado)

-- ---------- 2) Admin supremo ----------
alter table public.users add column if not exists is_super_admin boolean not null default false;

-- Trigger de proteção: ninguém (além do próprio usuário) pode mudar o role
-- ou o status is_super_admin de uma linha marcada como admin supremo.
create or replace function public.protect_super_admin()
returns trigger as $$
begin
  if old.is_super_admin = true and old.id <> auth.uid() then
    if new.role is distinct from old.role or new.is_super_admin is distinct from old.is_super_admin then
      raise exception 'Não é possível alterar o admin supremo.';
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists protect_super_admin_trigger on public.users;
create trigger protect_super_admin_trigger
  before update on public.users
  for each row execute procedure public.protect_super_admin();

-- ---------- 3) Só author/editor/admin criam artigos ----------
drop policy if exists "Autor cria seus artigos" on public.articles;
create policy "Author, editor e admin criam artigos"
  on public.articles for insert
  with check (
    author_id = auth.uid()
    and exists (select 1 from public.users u where u.id = auth.uid() and u.role in ('author', 'editor', 'admin'))
  );

-- =========================================================
-- ÚLTIMO PASSO (rode manualmente, uma vez): marque SEU usuário
-- como admin supremo. Troque o e-mail abaixo pelo seu.
-- =========================================================
-- update public.users set is_super_admin = true where email = 'seu-email-aqui@exemplo.com';
