## Arquitetura Geral

**Stack:**
- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Drizzle ORM** + **SQLite** (better-sqlite3) — banco local em `data/portfolio.db`
- **shadcn/ui** + **Tailwind CSS**
- **JWT** (jose) para autenticação via cookie HTTP-only
- **Vitest** (unit/integration) + **Playwright** (e2e)

**Estrutura de pastas** — padrão "Bulletproof React" adaptado para App Router:

```
src/
├── app/              # Roteamento thin (pages, layouts, API routes)
│   ├── (marketing)/  # Site público: home + /project/[slug]
│   ├── (auth)/       # /login
│   ├── (dashboard)/  # /admin/* (protegido por middleware)
│   └── api/          # GET público: /projects, /categories, /site
├── features/         # Domínios de negócio
│   ├── projects/     # queries, actions, components, types, hooks
│   ├── categories/   # queries, actions, components, types
│   ├── auth/         # actions, components, types
│   ├── site-config/  # queries, actions, types
│   ├── hero/         # VideoHero
│   ├── about/        # AboutSection
│   └── contact/      # ContactSection
├── lib/
│   ├── db/           # cliente Drizzle + schema + seed
│   └── auth/         # JWT (jwt.ts) + session (session.ts) + guards
├── components/       # Shared UI (shadcn/ui + forms + layouts + common)
└── config/           # env.ts, site.ts, navigation.ts
```

---

## Gerência de Conteúdo (Admin Panel)

O painel em `/admin` usa **Server Actions** (sem API REST para mutações) — tudo protegido pelo `withAuth` guard:

| Seção | Rota | O que faz |
|---|---|---|
| Projetos | `/admin/projects` | Lista com busca, toggle visible/featured, delete |
| Novo projeto | `/admin/projects/new` | Form com 3 abas: Overview, Content, Section |
| Editar projeto | `/admin/projects/[id]/edit` | Mesmo form, pré-populado |
| Categorias | `/admin/categories` | Lista + dialog para criar/editar |
| Configurações | `/admin/settings` | URL do vídeo hero |

O form de projeto tem:
- **Overview**: cover estático + animado (GIF), metadados (título, role, empresa, tools, plataforma, etc.)
- **Content**: galeria de imagens + lista de sections
- **Section**: editor de seções com blocos (heading, paragraph, list, image, video)

**Uploads** vão para `/api/admin/upload` e ficam em uploads.

**Database** — 6 tabelas SQLite:
```
categories → projects → project_images
                      → project_sections → section_blocks
site_config
```

---

## Para rodar localmente

**1. Instalar dependências:**
```bash
npm install
# ou yarn install
```

**2. Criar `.env.local`** na raiz:
```env
SESSION_SECRET=uma-chave-secreta-com-no-minimo-32-caracteres-aqui
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD_HASH=<sha256 hex da sua senha>
```

Para gerar o hash da senha (Node.js):
```js
const crypto = require('crypto')
console.log(crypto.createHash('sha256').update('SUA_SENHA').digest('hex'))
```

**3. Popular o banco (primeira vez):**
```bash
npm run db:seed
```
Isso lê os arquivos `data/categories.json`, `data/projects.json` e `data/site.json` e popula o SQLite em `data/portfolio.db`.

**4. Rodar:**
```bash
npm run dev
# → http://localhost:3000  (site público)
# → http://localhost:3000/admin  (painel admin)
```

---

**Com Docker** (alternativa):
```bash
# criar .env com as 3 vars acima, depois:
docker compose up --build
```
Os dados do SQLite e uploads ficam em volumes Docker persistentes.

**Outros scripts úteis:**
```bash
npm run db:studio   # Drizzle Studio (UI do banco no browser)
npm run test        # Testes unitários
npm run test:e2e    # Testes E2E (precisa do app rodando)
```