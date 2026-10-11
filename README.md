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

## ✦ The Vision: Modern B2B Clarity

Pidemelo.app is built under the **"Modern B2B Clarity"** design philosophy, where visual structure and strategic use of color create a professional, intuitive, and data-driven interface.

* **Defined Visual Hierarchy:** Goodbye to clutter. We use tactile cards with rounded corners and soft drop-shadows to clearly separate each piece of feedback. As seen in our dashboard, the organized columns allow for quick scanning, making feedback management a frictionless process.
* **Monochrome Precision with a Punch:** The interface maintains a clean, high-contrast aesthetic, reserving our signature **Orange (#FF6600)** exclusively for critical actions (CTAs) and memorable messaging. This color naturally guides the user's eye to what truly matters.
* **User Voice-First Design:** Every pixel has a purpose: prioritizing feedback. Through crisp typography and generous spacing, we remove all distractions so that votes, tags, and the users' ideas take center stage.

## 🚀 Features

-   **🎯 Public Feedback Boards:** Create unlimited boards for your products or projects.
-   **🔼 Community Voting:** Anonymous and authenticated voting system (fingerprint-authenticated) to identify real priorities.
-   **🔌 Widget Studio:** Fully customizable iframe widgets to embed feedback forms or boards directly into your own website.
-   **🏷️ Smart Tagging:** Categorize ideas using custom tags with precise visual indicators.
-   **📸 High-Fidelity Uploads:** Support for image attachments in every suggestion via ImageKit integration.
-   **⚙️ Admin Dashboard:** A premium kanban-style management interface to move ideas from "Review" to "Completed".
-   **🌐 Multi-language (i18n):** Support for English and Spanish out of the box.
-   **📩 Auto-notifications:** Real-time email alerts via Resend when new suggestions arrive.

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
- Node.js 20+ y [pnpm 10](https://pnpm.io/) (`corepack enable` o `npm i -g pnpm`)
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
| `pnpm preview` | Build OpenNext + sirve el Worker en local (`http://127.0.0.1:8787`) en el runtime real de Workers |
| `pnpm deploy` | Build OpenNext + despliega el Worker a Cloudflare |

> ⚠️ **`preview` y `deploy` deben ejecutarse en Linux o macOS.** El propio adaptador
> advierte de que Windows no está soportado: el artefacto embebe rutas Windows en
> `required-server-files.json` y el Worker falla con
> `Dynamic require of "/.next/server/middleware-manifest.json"`.
> En Windows usa [WSL](https://learn.microsoft.com/windows/wsl/) o deja que
> Cloudflare construya desde el repositorio (Workers Builds).

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

1. Crear el Worker `pidemelo` (o renombrar el `name` de `wrangler.jsonc`).
2. Activar el plan adecuado: el bundle pesa ~1.6 MiB gzip (límite Free: 3 MiB).
3. Configurar las variables/secretos del apartado anterior.
4. Conectar el repositorio con [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/)
   (Build command: `pnpm build`, Deploy command: `pnpm deploy`) **o** desplegar
   a mano con `pnpm deploy` desde un runner Linux/macOS.
5. Añadir el dominio `pidemelo.app` al Worker y ajustar DNS.

## ☕ Support & Sponsorship

This project is maintained entirely by [Gontzi](https://ka0s.site/me) as a gift to the open-source community. It has no monthly fees, no "Pro" plans, and no limits.

If this tool saves you time or money, consider supporting its maintenance:

[![Buy me a coffee](https://img.shields.io/badge/Support_Project-FF5C00?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://buymeacoffee.com/gontzi)

---

## 📄 License
Licensed under the MIT License. Feel free to fork, modify, and distribute.

---

[![Made with Preamble](https://img.shields.io/badge/Made_by-PREAMBLE-FF0000?style=flat-square)](https://preamble.pages.dev)
