-- =========================================================
-- Modelo de "Edição" (periódico semanal) — publicação em lote.
--
-- Fluxo novo:
--   draft -> submitted -> approved (fila, aguardando edição)
--   -> [admin monta a edição e atribui edition_id]
--   -> [admin "fecha" a edição] -> published (em lote, todos juntos)
-- =========================================================

create type edition_status as enum ('draft', 'published');

create table public.editions (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique,
  title text,
  description text,
  cover_article_id uuid references public.articles(id) on delete set null,
  status edition_status not null default 'draft',
  publish_date timestamptz,
  created_at timestamptz not null default now()
);

alter table public.articles add column if not exists edition_id uuid references public.editions(id) on delete set null;

alter table public.editions enable row level security;

create policy "Edições publicadas são públicas, rascunho só admin"
  on public.editions for select using (status = 'published' or public.is_admin());

create policy "Só admin cria edições"
  on public.editions for insert with check (public.is_admin());

create policy "Só admin atualiza edições"
  on public.editions for update using (public.is_admin());

create policy "Só admin apaga edições"
  on public.editions for delete using (public.is_admin());

-- Trigger de reforço: só admin pode mudar edition_id de um artigo ou
-- publicá-lo. Editor continua podendo aprovar/pedir mudanças/rejeitar
-- (isso não mexe em edition_id nem em status='published').
create or replace function public.restrict_edition_assignment()
returns trigger as $$
declare
  actor_role user_role;
begin
  select role into actor_role from public.users where id = auth.uid();
  if (new.edition_id is distinct from old.edition_id or (new.status = 'published' and old.status <> 'published'))
     and coalesce(actor_role, 'reader') <> 'admin' then
    raise exception 'Somente admin monta e publica edições.';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists restrict_edition_assignment_trigger on public.articles;
create trigger restrict_edition_assignment_trigger
  before update on public.articles
  for each row execute procedure public.restrict_edition_assignment();

create index idx_articles_edition on public.articles(edition_id);
create index idx_editions_status on public.editions(status);
