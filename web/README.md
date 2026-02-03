# Pomora Web Dashboard 🌐

**The Visual Interface for the Pomora Ecosystem.**

The Web Dashboard serves two primary purposes:
1.  **Real-Time Dashboard**: Allows users to watch their active Discord timer, view analytics, and manage settings.
2.  **Documentation Site**: Hosts the public documentation for the Pomora Bot (`/bot/docs`).

Built with **Next.js 14**, **TailwindCSS**, and **TypeScript**.

---

## ⚡ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: TailwindCSS + Framer Motion (for animations)
- **Database/Auth**: Supabase (PostgreSQL + Discord OAuth)
- **Runtime**: Bun

---

## 📂 Project Structure

```bash
web/
├── app/                  # App Router Routes
│   ├── page.tsx          # Main Landing Page
│   ├── bot/              
│   │   ├── page.tsx      # Bot Showcase Page
│   │   └── docs/         # Documentation Routes
│   ├── timer/            # Authenticated Web Timer
│   └── layout.tsx        # Root Layout
├── components/           # React Components
│   ├── bot/              # Bot-specific UI (Navbar, Footer)
│   ├── ui/               # Reusable UI primitives
│   └── ...
├── lib/                  # Utilities (Supabase client, helpers)
└── public/               # Static Assets
```

---

## 🚀 Development Guide

### Prerequisites
- **Supabase Project**: You need a Supabase project for Auth and Database.
- **Discord OAuth**: Configure a Discord Application for "Login with Discord".

### Environment Setup

Create a `.env.local` file in the `web` directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# App URL (for Auth redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running Locally

1.  **Navigate to web directory**:
    ```bash
    cd web
    ```

2.  **Install Dependencies**:
    ```bash
    bun install
    ```

3.  **Start Dev Server**:
    ```bash
    bun run dev
    ```

4.  **Visit**: [http://localhost:3000](http://localhost:3000)

---

## 📖 Documentation Section

The documentation pages are located in `app/bot/docs`.
- The layout is handled by `app/bot/docs/layout.tsx`.
- Content is written in standard React/JSX within `page.tsx`.

To update the docs, simply edit the corresponding file in that directory. The site uses standard Tailwind typography for formatting.

---

*[Back to Project Root](../README.md)*
