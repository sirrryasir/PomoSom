# Pomora Bot 🤖

**The Core Intelligence of the Pomora Ecosystem.**

The Pomora Bot is a high-performance Discord application built with **TypeScript**, **Discord.js**, and **Bun**. It manages the state of productivity sessions, synchronizes data with the cloud, and provides auditory and visual feedback to users.

---

## 🌟 Core Capabilities

### 🧠 Intelligent State Management
The bot doesn't just run a timer; it manages a **Session State Machine**.
- **Voice Automation**: Detects when users join specific channels to auto-start sessions.
- **Ghost Sessions**: If all users leave a channel, the session enters a "Ghost" state. The timer continues running until the current phase ends, allowing users to rejoin without breaking the flow.
- **Smart Breaks**: Automatically transitions between Focus (e.g., 25m) and Break (e.g., 5m) states.

### 🎨 Dynamic Visuals
- **Status Cards**: Real-time canvas-generated images embedded in chat.
- **Leaderboards**: High-fidelity ranking cards generated on the fly.
- **Channel Renaming**: Modifies voice channel names to reflect status: `🟢 Lounge | 04:59 REMAINING`.

---

## 🛠️ Command Reference

In `v1.0.0`, all commands are **Slash Commands**.

| Command | Description | Permission |
| :--- | :--- | :--- |
| `/config` | The admin control panel (Channels, Welcome settings). | `Administrator` |
| `/config channels study` | Set the target Voice Channel for tracking. | `Administrator` |
| `/config channels reports` | Set the Text Channel for logs/status cards. | `Administrator` |
| `/status` | Force-sync the status card to the bottom of chat. | Public |
| `/stats` | View your personal daily/weekly focus stats. | Public |
| `/leaderboard` | Show the server's top 10 users (Daily/Weekly/Monthly). | `Administrator` |
| `/help` | View a guide of all available commands. | `Administrator` |

---

## 🚀 Development Guide

### Prerequisites
- **Node/Bun**: This project uses `bun` as the package manager and runtime.
- **PostgreSQL**: A connection string is required.
- **Discord Bot Token**: Create one at the [Discord Developer Portal](https://discord.com/developers/applications).

### Local Setup

1.  **Navigate to the bot directory**:
    ```bash
    cd bot
    ```

2.  **Install dependencies**:
    ```bash
    bun install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the `bot` directory:
    ```env
    DISCORD_TOKEN=your_discord_bot_token
    DATABASE_URL=postgres://user:pass@host:5432/db_name
    
    # Defaults
    FOCUS_TIME=25
    SHORT_BREAK=5
    LONG_BREAK=15
    ```

4.  **Start in Development Mode**:
    ```bash
    bun run dev
    ```
    *This runs with hot-reloading enabled.*

### Architecture Overview

- **`src/services/`**: Core logic providers (Timer, Database, Voice).
- **`src/commands/`**: Slash command definitions and handlers.
- **`src/events/`**: Discord event listeners (`interactionCreate`, `voiceStateUpdate`).
- **`src/utils/canvas/`**: Image generation logic using `@napi-rs/canvas`.

---

## 🧪 Testing

We use manual verification for Discord interactions.
- **Simulate Join**: Use a secondary Discord account to join/leave voice channels.
- **Ghost Mode Test**: Leave the channel while the timer is running. Wait 1 minute. Rejoin. The timer should have continued decrementing.

---

*[Back to Project Root](../README.md)*
