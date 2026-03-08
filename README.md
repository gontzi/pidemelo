# gontzi/pidemelo
![Next.js](https://img.shields.io/badge/Next.js-20232A?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwind-css)

## Introduction
This is a Next.js project, a web application for managing boards and ideas. The project utilizes TypeScript, React, and Tailwind CSS for styling.

## Project Structure
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