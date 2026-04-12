# gontzi/pidemelo
![Next.js](https://img.shields.io/badge/Next.js-20232A?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwind-css)

## Introduction
Pídemelo is a **100% Free, Unlimited, and Open Source** web application for managing boards and collecting feedback/ideas from your users. It embraces "Fintech Minimalism" to deliver a stunning experience.
The project utilizes Next.js, TypeScript, React, and Tailwind CSS.

## ☕ Support the Project (Sponsor)
This project is maintained completely free of charge. If you find it useful for your business, consider supporting its development:

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-FF5C00?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://buymeacoffee.com/gontzi)

## 📂 Project Structure
```markdown
.
├── 📁 components
│   ├── 📄 ClientWrapper.tsx
│   ├── 📄 ImageLightbox.tsx
│   ├── 📄 ImageUploadDropzone.tsx
│   ├── 📄 LanguageSwitcher.tsx
│   └── ...
├── 📁 src
│   ├── 📁 app
│   │   ├── 📁 api
│   │   │   ├── 📄 webhooks
│   │   │   │   ├── 📄 polar
│   │   │   │   │   ├── 📄 route.ts
│   │   │   │   │   └── ...
│   │   ├── 📁 board
│   │   │   ├── 📁 [slug]
│   │   │   │   ├── 📄 PublicBoardClient.tsx
│   │   │   │   ├── 📄 SubmitIdeaForm.tsx
│   │   │   │   ├── 📄 actions.ts
│   │   │   │   ├── 📄 page.tsx
│   │   │   │   ├── 📄 uploadAction.ts
│   │   │   │   └── ...
│   │   ├── 📁 dashboard
│   │   │   ├── 📁 billing
│   │   │   │   ├── 📄 PricingSwitcher.tsx
│   │   │   │   ├── 📄 SubscriptionButton.tsx
│   │   │   │   ├── 📄 actions.ts
│   │   │   │   ├── 📄 page.tsx
│   │   │   │   └── ...
│   │   ├── 📁 layout.tsx
│   │   ├── 📄 globals.css
│   │   ├── 📄 layout.tsx
│   │   ├── 📄 not-found.tsx
│   │   ├── 📄 page.tsx
│   │   ├── 📄 robots.ts
│   │   ├── 📄 sitemap.ts
│   │   └── ...
│   ├── 📁 db
│   │   ├── 📄 schema.ts
│   │   └── ...
│   ├── 📁 i18n
│   │   ├── 📄 getDictionary.ts
│   │   └── ...
│   └── ...
├── 📄 .eslintrc.json
├── 📄 components.json
├── 📄 drizzle.config.ts
├── 📄 package.json
└── 📄 README.md
```

## Tech Stack
This project uses the following technologies:

* Next.js as the web framework
* TypeScript as the programming language
* React for building user interfaces
* Tailwind CSS for styling
* Drizzle for database management
* Clerk for authentication

## Setup
To set up the project, follow these steps:

1. Clone the repository
2. Install dependencies with `npm install` or `yarn install`
3. Start the development server with `npm run dev` or `yarn dev`

## Deployment
The easiest way to deploy the application is to use the Vercel Platform. For more information, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

[![Made with Preamble](https://img.shields.io/badge/Made_by-PREAMBLE-FF0000?style=flat-square)](https://preamble.pages.dev)