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
-   **ORM:** [Drizzle ORM](https://orm.drizzle.team/) (Edge compatible)
-   **Auth:** [Clerk](https://clerk.com/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)
-   **Email:** [Resend](https://resend.com/)
-   **Storage:** [ImageKit](https://imagekit.io/)

## 🏁 Getting Started

### 1. Requirements
- Node.js 18+
- A Neon PostgreSQL instance
- A Clerk account
- A Resend API key
- An ImageKit account

### 2. Installation
```bash
git clone https://github.com/gontzi/pidemelo.git
cd pidemelo
npm install
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
npm run dev
```

## ☕ Support & Sponsorship

This project is maintained entirely by [Gontzi](https://ka0s.site/me) as a gift to the open-source community. It has no monthly fees, no "Pro" plans, and no limits.

If this tool saves you time or money, consider supporting its maintenance:

[![Buy me a coffee](https://img.shields.io/badge/Support_Project-FF5C00?style=for-the-badge&logo=buymeacoffee&logoColor=white)](https://buymeacoffee.com/gontzi)

---

## 📄 License
Licensed under the MIT License. Feel free to fork, modify, and distribute.

---

[![Made with Preamble](https://img.shields.io/badge/Made_by-PREAMBLE-FF0000?style=flat-square)](https://preamble.pages.dev)
