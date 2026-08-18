# Encyclios — Enciclopédia Científica Digital

Fundação do projeto: schema de banco, autenticação e páginas públicas (home,
tema, artigo, pesquisa, login/cadastro) já funcionais e ligadas ao Supabase.
Editor rico, dashboard completo, fluxo de revisão e painel admin entram na
próxima etapa.

## 1. Criar o projeto no Supabase

1. Crie uma conta grátis em https://supabase.com e um novo projeto.
2. No painel do projeto, vá em **SQL Editor** → **New query**.
3. Cole e rode o conteúdo de `supabase/migrations/0001_schema.sql`.
4. Em **Project Settings → API**, copie a **Project URL** e a **anon public
   key**.

## 2. Configurar o frontend

```bash
cp .env.example .env
# edite .env com a URL e a anon key copiadas acima
npm install
npm run dev
```

Abra http://localhost:5173.

## 3. Criar o primeiro usuário admin

1. Crie sua conta normalmente pelo site (`/cadastro`) — por padrão todo
   cadastro novo vira `author`.
2. No Supabase, vá em **Table Editor → users**, encontre sua linha e mude a
   coluna `role` para `admin`.

## 4. Dados de demonstração (opcional)

Rode `supabase/migrations/0002_seed.sql` no SQL Editor. Ele cria os temas
"Astronomia" e "Biologia". Para os artigos de exemplo, siga o comentário no
próprio arquivo (é preciso ter um `author_id` real).

## 5. Deploy

- **Frontend:** Cloudflare Pages ou Vercel — comando de build `npm run build`,
  pasta de saída `dist`. Configure as mesmas variáveis `VITE_SUPABASE_URL` e
  `VITE_SUPABASE_ANON_KEY` no painel de variáveis de ambiente da plataforma.
- **Backend:** já está no ar assim que você criou o projeto Supabase — não
  precisa de deploy separado.

## O que já funciona

- Cadastro/login/logout reais via Supabase Auth (senha nunca fica em texto
  puro — isso é responsabilidade do próprio Supabase Auth).
- Sessão persistida pela lib do Supabase — funciona ao logar em outro
  dispositivo, sem depender de localStorage seu.
- RLS no banco: cada autor só edita os próprios artigos; admin edita tudo;
  visitante só vê artigos publicados.
- Home, página de tema, página de artigo e pesquisa já leem dados reais do
  Postgres (não há array estático nem dado fake no frontend).
- Dashboard do autor já cria rascunhos reais (`createDraft`) e lista os
  artigos do usuário logado.

## Próxima etapa

1. Página de autores e perfil editável — feito
2. Histórico de versões (`article_versions`)
3. Deploy em produção (Cloudflare Pages/Vercel) — em andamento

## Modelo de edição (periódico semanal)

O fluxo de publicação não é mais "aprovar = publicar na hora". Agora:

`draft → submitted → approved (fila) → [admin monta a edição] → published (em lote)`

- Editor/admin aprova um artigo em `/admin/revisoes` → ele fica esperando, aparece em "Aprovados aguardando edição"
- Só **admin** cria edições e atribui artigos a elas, em `/admin/edicoes`
- Ao clicar em "Fechar e publicar", todos os artigos daquela edição vão ao ar juntos, de uma vez, com a mesma data de publicação
- Temas e tags continuam existindo no banco, mas não aparecem mais como navegação — só influenciam os resultados da busca (`/pesquisa`)
