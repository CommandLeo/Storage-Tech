# Storage Tech

A Next.js-powered web application for Storage Tech, featuring Discord bot integration and archive management.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm, pnpm, yarn, or bun
- Discord Application with Bot configured
- Discord Server (Guild) for testing

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Discord Bot Configuration
GUILD_ID=your_discord_guild_id
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_PUBLIC_KEY=your_discord_public_key

# NextAuth Configuration
AUTH_SECRET=your_nextauth_secret_min_32_chars
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CommandLeo/Storage-Tech.git
cd "Storage Tech"
```

2. Install dependencies:
```bash
npm install
```

3. Set up Discord bot commands:
```bash
npm run commands:register
```

4. Initialize the archive structure (optional):
```bash
npm run setup-archive
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.