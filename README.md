<div align="center">
  <img src="https://github.com/sirrryasir/Pomora/blob/main/web/public/images/logo-bg.png?raw=true" alt="Pomora Logo" width="120" />
  <h1>Pomora Ecosystem</h1>
  <p><strong>The Unified Productivity Suite for Discord Communities and Solo Developers.</strong></p>

  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Discord](https://img.shields.io/discord/1467251658718445758?color=5865F2&logo=discord&logoColor=white)](https://discord.gg/pomora)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
</div>

---

## ⚡ Overview

Pomora is a **high-performance, open-source productivity bot** designed to turn Discord servers into focused study hubs. It combines a **Voice-Automated Timer** with a **Real-time Web Dashboard**, treating productivity as a collaborative experience.

Unlike generic timers, Pomora is:
- **Zero-Friction**: No commands needed to start. Just join a voice channel.
- **Presence-Aware**: Tracks "Deep Work" time based on voice activity and presence checks.
- **Unified**: Discord activity syncs instantly to your personal web dashboard.

## 🏗️ Ecosystem Architecture

The project is a monorepo containing two distinct but interconnected applications:

```mermaid
graph TD
    User((User))
    Discord[Discord Client]
    Web[Web Dashboard]
    
    subgraph "Pomora Ecosystem"
        Bot[Discord Bot Service]
        DB[(PostgreSQL Sync)]
    end

    User -->|Voice Join| Discord
    Discord <-->|Gateway| Bot
    Bot <-->|Read/Write| DB
    Web <-->|Read Only| DB
    User -->|View Analytics| Web
```

### 📂 Directory Structure

```bash
pomora/
├── bot/                # Discord Bot Application (TypeScript)
│   ├── src/            # Core Logic (Timer, Voice, Commands)
│   └── README.md       # Bot-Specific Documentation
├── web/                # Web Dashboard (Next.js 14)
│   ├── app/            # App Router & Docs
│   └── README.md       # Web-Specific Documentation
└── README.md           # You are here
```

## ✨ Key Features

### 🤖 Discord Bot
*See [bot/README.md](bot/README.md) for full details.*
- **Automated Sessions**: Detects voice channel activity to start/stop timers automatically.
- **Smart Transitions**: seamless flow between Focus (50m) and Break (10m) modes.
- **Presence Verification**: "Check-in" buttons ensure users are actually present at their desks.
- **Dynamic Leaderboards**: Generates high-quality weekly/daily ranking cards in chat.

### 🌐 Web Dashboard
*See [web/README.md](web/README.md) for full details.*
- **Live Sync**: Watch your Discord timer tick in real-time on the browser.
- **Personal Analytics**: Historical data graphs and session logs.
- **Documentation**: Integrated documentation site for user guides.

## 🚀 Quick Start (Development)

This guide assumes you want to run the **entire stack** locally.

### Prerequisites
- [Bun](https://bun.sh) (Required runtime)
- [PostgreSQL](https://www.postgresql.org/) (or a hosted instance like Neon)
- [Discord Bot Token](https://discord.com/developers/applications)

### 1. Clone & Install
```bash
git clone https://github.com/sirrryasir/pomora.git
cd pomora
bun install
```

### 2. Configure Environment
You need to set up environment variables for both the bot and web apps.

**Bot (`bot/.env`):**
```env
DISCORD_TOKEN=your_token
DATABASE_URL=postgres://user:pass@host:5432/db
```

**Web (`web/.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### 3. Run Locally

**To run the Bot:**
```bash
cd bot
bun run dev
```

**To run the Web Dashboard:**
```bash
cd web
bun run dev
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  **Fork the repo** and create your branch (`git checkout -b feature/amazing-feature`).
2.  **Commit your changes** (`git commit -m 'feat: Add amazing feature'`).
3.  **Push to the branch** (`git push origin feature/amazing-feature`).
4.  **Open a Pull Request**.

Please ensure your code follows the existing style (ESLint/Prettier) and includes comments where necessary.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---
<div align="center">
  <sub>Built with ❤️ by Sirr Yasir & the Open Source Community</sub>
</div>
