-- Faltavam políticas de UPDATE e DELETE em tags (só existia INSERT/SELECT).
-- Editor e admin podem editar; apagar fica restrito a admin (evita apagar
-- uma tag que outro autor ainda está usando sem querer).

drop policy if exists "Editor e admin atualizam tags" on public.tags;
create policy "Editor e admin atualizam tags"
  on public.tags for update using (public.is_editor());

drop policy if exists "Só admin apaga tags" on public.tags;
create policy "Só admin apaga tags"
  on public.tags for delete using (public.is_admin());
