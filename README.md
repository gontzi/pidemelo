# Pidemelo.app - Open Source Feedback Management

<div align="center">
  <img src="https://pidemelo.app/og-image.png" alt="Pidemelo.app" width="100%" style="border-radius: 2.5rem; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);" />
  <p align="center">
    <strong>100% Free • Unlimited • Open Source</strong>
  </p>
  <p align="center">
    The feedback management platform built for speed, transparency, and high-fidelity product design.
  </p>
</div>

---

## ✦ Who it's for

Pidemelo.app is built for **makers, indie hackers, creators and small SaaS teams** — usually one person who checks in a couple of times a week and wants three answers fast: *what's new, what's most requested, and how do I reply?*

* **Inbox, not project management:** the admin panel is a single list of ideas with status filters ("To review" first), a side panel to reply and change status, and a "new since your last visit" marker.
* **Everything about a board lives inside the board:** *Ideas · Share (public link + embeddable widget) · Settings (name, URL, notifications, tags)*.
* **Friendly in public, clear in the panel:** playful copy on the landing page and public boards; plain labels where you get work done.

## 🚀 Features

-   **🎯 Public Feedback Boards:** Create unlimited boards for your products or projects.
-   **🔼 Community Voting:** Anonymous voting (device cookie + IP fingerprint). Voters see which ideas they already voted.
-   **📥 Ideas Inbox:** Triage new ideas, reply publicly and move them through *To review → Planned → In progress → Done*, or close them (visible or hidden).
-   **🗺️ Public Roadmap:** Planned, in-progress and done ideas, generated automatically.
-   **🔌 Embeddable Widget:** Customizable iframe (form or voting board) with live preview, inside each board's *Share* tab.
-   **🏷️ Tags:** Optional categories with custom colors.
-   **📸 Image Uploads:** Attach screenshots to suggestions via ImageKit.
-   **🌐 Multi-language (i18n):** English and Spanish out of the box.
-   **📩 Email notifications:** Optional alerts via Resend when new suggestions arrive.

## 🛠️ Tech Stack

Built with the most modern and scalable technologies:

-   **Framework:** [Next.js 14](https://nextjs.org/) (App Router & Server Actions)
-   **Database:** PostgreSQL with [Neon](https://neon.tech/) (Serverless)
-   **ORM:** [Drizzle ORM](https://orm.drizzle.team/) (Neon HTTP driver, sin WebSockets)
-   **Auth:** [Clerk](https://clerk.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Email:** [Resend](https://resend.com/)
-   **Storage:** [ImageKit](https://imagekit.io/)
-   **Deploy:** [Cloudflare Workers](https://workers.cloudflare.com/) con [@opennextjs/cloudflare](https://opennext.js.org/cloudflare)

## 🏁 Getting Started

### 1. Requirements
- Node.js 22 LTS (ver `.nvmrc`) y [pnpm 10](https://pnpm.io/) (`corepack enable` o `npm i -g pnpm`)
- A Neon PostgreSQL instance
- A Clerk account
- A Resend API key
- An ImageKit account

### 2. Installation
```bash
git clone https://github.com/gontzi/pidemelo.git
cd pidemelo
pnpm install
```

> ⚠️ **Este proyecto usa pnpm en exclusiva.** No ejecutes `npm install`: npm no
> entiende el layout de `node_modules` de pnpm (junctions/`pnpm-lock.yaml`) y
> además **borra** el contenido de paquetes como `next` antes de fallar, dejando
> el árbol roto. Si ya lo hiciste, recupera con `pnpm install` (o borra
> `node_modules` y vuelve a ejecutarlo).

### 3. Environment Setup
Copy the `.env.example` file to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

### 4. Database Setup
Push the schema to your Neon database:
```bash
npx drizzle-kit push
```

### 5. Run it
```bash
pnpm dev
```

## ☁️ Build & Deploy (Cloudflare Workers)

La app se ejecuta como un **Cloudflare Worker** mediante el adaptador oficial
[`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare), con el runtime
**Node** de Next.js habilitado por el flag `nodejs_compat`
(ver `wrangler.jsonc`). Este adaptador sustituye a `@cloudflare/next-on-pages`,
que está deprecado y no puede empaquetar Next.js 14.2 (usa `AsyncLocalStorage`
vía `node:async_hooks`, incompatible con su bundler Edge-only).

### Comandos

| Comando | Qué hace |
| --- | --- |
| `pnpm build` | Build estándar de Next.js (`.next`) |
| `pnpm build:worker` | Genera el Worker de producción con OpenNext (`.open-next`) |
| `pnpm deploy:worker` | Publica el artefacto ya generado con Wrangler |
| `pnpm preview` | Build OpenNext + sirve el Worker en local (`http://127.0.0.1:8787`) en el runtime real de Workers |
| `pnpm deploy` | Ejecuta `build:worker` y después `deploy:worker` (despliegue manual completo) |

> ⚠️ **`preview` y `deploy` deben ejecutarse en Linux o macOS.** El propio adaptador
> advierte de que Windows no está soportado: el artefacto embebe rutas Windows en
> `required-server-files.json` y el Worker falla con
> `Dynamic require of "/.next/server/middleware-manifest.json"`.
> En Windows usa [WSL](https://learn.microsoft.com/windows/wsl/) o deja que
> Cloudflare construya desde el repositorio (Workers Builds).

### Validación en CI

El workflow de GitHub Actions `.github/workflows/build.yml` reproduce el pipeline
completo en Linux con versiones fijadas (Node 20, pnpm 10.34.6):
`pnpm install --frozen-lockfile` → typecheck → lint → tests → build OpenNext →
`wrangler deploy --dry-run` (tamaño del bundle) → verificación de artefactos.

### Variables de entorno en producción

Los mismos nombres que en `.env.example` se configuran en el dashboard de
Cloudflare (Workers → *pidemelo* → Settings → Variables) o con
`wrangler secret put <NOMBRE>` para los secretos. **No** se versionan en
`wrangler.jsonc`.

En local, `pnpm preview` las lee de `.dev.vars`:

```bash
cp .dev.vars.example .dev.vars   # y rellena los valores (o cp .env .dev.vars)
```

### Pasos manuales en Cloudflare (una sola vez)

1. Crear el Worker `pidemelo-app` (el nombre `pidemelo` está ocupado por Pages; el dominio `pidemelo.app` se mantiene independiente).
2. Activar el plan adecuado: el bundle pesa ~1.6 MiB gzip (límite Free: 3 MiB).
3. Configurar las variables/secretos del apartado anterior.
4. Conectar el repositorio con [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/).
   Configurar Build command `pnpm build:worker` y Deploy command
   `pnpm deploy:worker`. Workers Builds instala las dependencias desde
   `pnpm-lock.yaml`; `.nvmrc` fija Node 22 y `packageManager` fija pnpm 10.34.6.
   Para las ramas de vista previa (PRs), en *Compilaciones → Base de vistas previas*
   usar `npx wrangler versions upload` como comando de vista previa: crea una
   versión con URL propia sin desplegarla a producción. (`wrangler preview` está
   en beta, exige un bloque `previews` y no admite el service binding
   `WORKER_SELF_REFERENCE` que usa OpenNext).
   También se puede desplegar a mano con `pnpm deploy` desde Linux/macOS.
5. Añadir el dominio `pidemelo.app` al Worker y ajustar DNS.

La integración antigua de Cloudflare Pages no debe compilar este proyecto:
su comando `next-on-pages` ya no forma parte de la aplicación. Mantén Pages
publicado hasta que el Worker pase las comprobaciones en su URL `workers.dev`;
el traspaso del dominio personalizado es el último paso.

## ☕ Support & Sponsorship

This project is maintained entirely by [Gontzi](https://ka0s.site/me) as a gift to the open-source community. It has no monthly fees, no "Pro" plans, and no limits.

If this tool saves you time or money, consider supporting its maintenance:

[![Buy me a coffee](https://img.shields.io/badge/Support_Project-FF5C00?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://buymeacoffee.com/gontzi)

---

## 📄 License
Licensed under the MIT License. Feel free to fork, modify, and distribute.

---

[![Made with Preamble](https://img.shields.io/badge/Made_by-PREAMBLE-FF0000?style=flat-square)](https://preamble.pages.dev)
