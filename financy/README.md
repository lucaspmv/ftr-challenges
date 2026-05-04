# Financy

Personal-finance management app — full-stack TypeScript with GraphQL.

Part of the Rocketseat post-graduation phase-3 challenge.

## Structure

- `backend/` — Apollo Server v4 + Prisma (SQLite) + JWT auth via httpOnly cookie
- `frontend/` — Vite + React + Apollo Client + Tailwind v4 + Shadcn

## Run locally

Start the backend first (the frontend's codegen introspects it):

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev
```

Then in another terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run codegen
npm run dev
```

Backend on `http://localhost:4000/graphql`, frontend on `http://localhost:5173`.
