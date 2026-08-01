# anageek.github.io

Portfolio pessoal de Ana Neiva. O painel de administração permite criar e editar projetos com seções, blocos de conteúdo e galeria de imagens. O banco de dados e as imagens ficam versionados junto ao código — um simples `git push` é suficiente para publicar novos conteúdos na Vercel.

---

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** + shadcn/ui
- **SQLite** via `better-sqlite3` + **Drizzle ORM** — banco em `data/portfolio.db`
- **Vercel** para deploy contínuo a partir do GitHub

---

## 1. Rodando localmente

### Pré-requisitos

- Node.js ≥ 20
- npm (incluso com o Node.js)

### Passos

```bash
# Instalar dependências
npm install

# Copiar e preencher as variáveis de ambiente
cp .env.example .env.local
```

Edite `.env.local` com os valores reais:

```env
SESSION_SECRET=chave-secreta-com-pelo-menos-32-caracteres
ADMIN_EMAIL=seu@email.com
ADMIN_PASSWORD_HASH=hash-sha256-da-sua-senha
```

Para gerar o `ADMIN_PASSWORD_HASH`:
```bash
npm run hash-password -- sua-senha
```

```bash
# Iniciar o servidor de desenvolvimento
npm run dev
```

- Site público: `http://localhost:3000`
- Painel de administração: `http://localhost:3000/admin`

---

## 2. Publicando novos conteúdos

Todo conteúdo é gerenciado pelo painel `/admin` e persiste localmente em dois lugares:

| O que muda | Onde fica |
|---|---|
| Projetos, seções e blocos de texto | `data/portfolio.db` |
| Imagens enviadas pelo painel | `public/images/uploads/` |

Ambos são versionados no Git. O fluxo completo para publicar é:

```bash
# 1. Iniciar o ambiente local
npm run dev

# 2. Acessar /admin e fazer as alterações desejadas

# 3. Commitar banco de dados e imagens
git add data/portfolio.db public/images/uploads/
git commit -m "conteúdo: descrição do que foi adicionado"

# 4. Enviar para o GitHub — a Vercel faz o deploy automaticamente
git push origin main
```

> A Vercel usa o `data/portfolio.db` do repositório como banco de dados de produção. Por isso, **todas as edições de conteúdo devem ser feitas localmente** pelo painel — nunca diretamente em produção.

---

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run db:studio` | Abre o Drizzle Studio (inspetor visual do banco) |
| `npm run db:push` | Aplica mudanças de schema no banco local |
| `npm run hash-password -- <senha>` | Gera o hash SHA-256 de uma senha para o `.env.local` |
