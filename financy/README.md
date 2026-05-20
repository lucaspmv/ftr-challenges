# Financy

Personal-finance management app — full-stack TypeScript with GraphQL.

Built for the Rocketseat post-graduation phase-3 challenge ([brief](https://ftr.rocketseat.com.br/projects/td-360-desafio-pratico-da-fase-3-financy), [Figma](https://www.figma.com/design/lzfoo8Tv84laehxq9TEocU/Financy--Community-)).

## Stack

**Backend** — TypeScript · Apollo Server v5 · Express · Prisma 6 · SQLite · JWT em cookie `HttpOnly` + `SameSite=Strict` · Vitest

**Frontend** — TypeScript · Vite · React 19 · Apollo Client v4 · react-router v7 · Tailwind v4 · Shadcn · react-hook-form + Zod · graphql-codegen client preset (`gql()` tipado)

## Structure

```
financy/
├── backend/   Apollo Server + Prisma + SQLite, GraphQL schema-first
└── frontend/  Vite + React + Apollo Client, Tailwind v4 + Shadcn
```

## Run locally

Pré-requisitos: Node 20+ e npm.

### Backend (`http://localhost:4000/graphql`)

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npm run dev
```

`npm run dev` já roda o codegen do GraphQL antes do `tsx watch` via `predev`.

### Frontend (`http://localhost:5173`)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`predev` roda o codegen lendo o schema direto de `../backend/src/schema.graphql`, então **não é necessário ter o backend em execução** para tipar as queries — só pra fazer requests.

## Tests + build

Backend:

```bash
cd backend
npm test           # vitest, pretest migra prisma/test.db
npm run build      # gera src/generated/ e compila para dist/
```

Frontend:

```bash
cd frontend
npm run build      # gera src/generated/ e roda vite build
```

## Variáveis de ambiente

### `backend/.env`
- `DATABASE_URL` — caminho do banco SQLite, ex. `file:./dev.db`
- `JWT_SECRET` — segredo do JWT
- `PORT` — porta do Apollo Server (default `4000`)
- `CORS_ORIGIN` — origem permitida no CORS (default `http://localhost:5173`)
- `NODE_ENV` — `development` ou `production` (controla `Secure` no cookie)

### `frontend/.env`
- `VITE_BACKEND_URL` — URL do `/graphql` do backend (default `http://localhost:4000/graphql`)

## Features

### Auth
- Sign up / sign in / sign out
- JWT armazenado em cookie `HttpOnly` + `SameSite=Strict` (não acessível via JavaScript no client)
- AuthGuard no front impede acesso a rotas autenticadas
- Editar nome do próprio usuário em `/perfil`

### Categorias
- CRUD com 16 ícones (lucide) e 7 cores
- Bloqueio de exclusão se houver transações associadas
- Cards com contagem de itens

### Transações
- CRUD com despesa/receita, categoria, data, valor
- Input de valor com auto-format BRL (digita só os centavos)
- Tabela com paginação client-side (10/página) e janela de páginas centrada na atual
- Filtros: busca por descrição, tipo, categoria, período (24 meses)

### Dashboard
- KPIs: saldo total, receitas e despesas do mês
- 5 transações mais recentes
- Top categorias com contagem e total

### Outros
- Cache reativo: cada mutation invalida os campos do cache via `cache.evict` + `cache.gc` e força refetch das queries ativas; nenhuma tela precisa de F5
- Codegen schema-first: backend gera `Resolvers` tipados, frontend gera `gql()` tipado a partir do mesmo `schema.graphql`
- Telas mobile-responsivas via classes utilitárias do Tailwind

## GraphQL playground

Com o backend rodando, abra `http://localhost:4000/graphql` no navegador → "Query your server" abre o Apollo Sandbox. Em **Connection settings** marque **Include cookies** antes de rodar queries autenticadas.

## Páginas (rotas do front)

| Rota | Descrição |
|---|---|
| `/` | Login (redireciona pra `/dashboard` se já autenticado) |
| `/cadastro` | Criar conta |
| `/dashboard` | KPIs + recentes + top categorias |
| `/transacoes` | Lista com filtros e paginação |
| `/categorias` | CRUD em grid de cards |
| `/perfil` | Editar nome + sair |
