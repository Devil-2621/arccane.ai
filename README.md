<div align="center">
  <img src="./public/Arccane_logo_dark.svg" alt="Arccane AI Logo" width="120" height="120" />
  
# Arccane.ai
  
### 🚀 Your Vibe Co-Pilot for Coding
  
  **An intelligent AI-powered development platform that creates full-stack web applications through natural language conversations.**
  
  [![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://reactjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-6.13-2D3748?logo=prisma)](https://www.prisma.io/)
  [![License](https://img.shields.io/badge/License-Private-red)](LICENSE)

</div>

---

## 📖 Table of Contents

- [About The Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Usage](#-usage)
- [Development](#-development)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About The Project

<div align="center">
  <img src="./public/Arccane_logo.svg" alt="Arccane AI Hero" width="600" />
</div>

**Arccane.ai** is a next-generation AI-powered development platform that revolutionizes how developers build web applications. Through natural language conversations, Arccane.ai understands your requirements and generates production-ready, full-stack applications using modern technologies.

### What Makes Arccane.ai Special?

- 🤖 **AI-Driven Development**: Leverages advanced AI agents (OpenAI, Gemini) with the Inngest Agent Kit to understand and execute complex development tasks
- 🏗️ **Automated Code Generation**: Creates complete Next.js applications with proper project structure, routing, and components
- 🔄 **Real-time Sandboxing**: Uses E2B sandboxes to execute and preview code in isolated, secure environments
- 📦 **Smart Project Management**: Tracks projects, messages, and code fragments with full version history
- 🎨 **Beautiful UI**: Built with shadcn/ui and Tailwind CSS for a modern, responsive interface
- 🔐 **Secure Authentication**: Integrated Clerk authentication for user management
- 📊 **Usage Analytics**: Built-in usage tracking and rate limiting system

---

## 🛠️ Tech Stack

### Core Framework

- **[Next.js 15.3.4](https://nextjs.org/)** - React framework with App Router and Turbopack
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### UI & Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible component primitives
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VS Code editor for the web
- **[Motion](https://motion.dev/)** - Modern animation library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Backend & Database

- **[Prisma 6.13](https://www.prisma.io/)** - Next-generation ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[tRPC 11](https://trpc.io/)** - End-to-end typesafe APIs
- **[TanStack Query 5](https://tanstack.com/query)** - Powerful data synchronization

### AI & Agents

- **[@inngest/agent-kit](https://www.inngest.com/)** - Multi-agent orchestration framework
- **[OpenAI](https://openai.com/)** - GPT models for code generation
- **[Inngest 3](https://www.inngest.com/)** - Durable workflow engine
- **[@e2b/code-interpreter](https://e2b.dev/)** - Secure code execution sandboxes

### Authentication & Security

- **[Clerk](https://clerk.com/)** - Complete authentication solution
- **[rate-limiter-flexible](https://www.npmjs.com/package/rate-limiter-flexible)** - Rate limiting and DDoS protection

### Form Handling & Validation

- **[React Hook Form](https://react-hook-form.com/)** - Performant form library
- **[Zod 4](https://zod.dev/)** - TypeScript-first schema validation

### Development Tools

- **[ESLint 9](https://eslint.org/)** - Code linting
- **[dotenv](https://www.npmjs.com/package/dotenv)** - Environment variable management
- **[tsx](https://www.npmjs.com/package/tsx)** - TypeScript execution
- **[Prisma CLI](https://www.prisma.io/docs/orm/tools/prisma-cli)** - Database management

---

## ✨ Features

### 🎨 AI-Powered Development

- Natural language to full-stack application conversion
- Intelligent code generation with context awareness
- Multi-agent system for complex task breakdown
- Real-time progress tracking during generation

### 🔧 Project Management

- Create and manage multiple projects
- Message history with code fragments
- Project-specific sandboxes for testing
- Usage tracking and quota management

### 🎯 Code Execution

- Secure E2B sandbox environments
- Live preview of generated applications
- File system management within sandboxes
- Support for Next.js application templates

### 👤 User Experience

- Dark/Light theme support
- Responsive design for all devices
- Beautiful UI with smooth animations
- Real-time notifications with Sonner
- Comprehensive error handling

### 🔒 Security & Authentication

- Clerk-based user authentication
- Protected routes with middleware
- Rate limiting on API endpoints
- Secure database access with Prisma

---

## 📁 Project Structure

```
arccane.ai/
├── prisma/                          # Database schema and migrations
│   ├── schema.prisma               # Prisma schema definition
│   └── migrations/                 # Database migration history
│       ├── 20250917173723_message_fragment/
│       ├── 20250919065118_projects/
│       ├── 20250930105751_user_id/
│       ├── 20251001132752_usage/
│       └── 20251117094609_add_sandbox_id_to_fragment/
│
├── public/                          # Static assets
│   ├── Arccane_logo.svg           # Brand logos
│   ├── Arccane_logo_dark.svg
│   └── *.svg                       # Icon assets
│
├── sandbox-templates/               # E2B sandbox configurations
│   └── nextjs/                     # Next.js template for sandboxes
│       ├── build.ts
│       ├── e2b.toml
│       └── template.ts
│
├── src/                            # Source code
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx             # Root layout with providers
│   │   ├── globals.css            # Global styles
│   │   ├── (home)/                # Home page route group
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── pricing/           # Pricing page
│   │   │   ├── sign-in/           # Sign-in page
│   │   │   └── sign-up/           # Sign-up page
│   │   ├── api/                   # API routes
│   │   │   ├── inngest/           # Inngest webhook handler
│   │   │   └── trpc/              # tRPC API endpoint
│   │   └── projects/              # Project management pages
│   │       └── [projectId]/       # Dynamic project route
│   │
│   ├── components/                 # React components
│   │   ├── ui/                    # shadcn/ui components (48+ components)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...                # All shadcn components
│   │   ├── code-view/             # Code editor component
│   │   │   ├── index.tsx
│   │   │   └── code-theme.css
│   │   ├── file-explorer.tsx      # File browser component
│   │   ├── logo.tsx               # Brand logo component
│   │   └── user-control.tsx       # User menu component
│   │
│   ├── generated/                  # Auto-generated code
│   │   └── prisma/                # Prisma client
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-current-theme.ts   # Theme management
│   │   ├── use-mobile.ts          # Mobile detection
│   │   ├── use-scroll.ts          # Scroll utilities
│   │   └── useJobProgress.ts      # Job progress tracking
│   │
│   ├── inngest/                    # Inngest functions
│   │   ├── client.ts              # Inngest client setup
│   │   ├── functions.ts           # Agent functions
│   │   ├── progress.ts            # Progress tracking
│   │   ├── types.ts               # Type definitions
│   │   └── utils.ts               # Utility functions
│   │
│   ├── lib/                        # Shared libraries
│   │   ├── db.ts                  # Prisma client instance
│   │   ├── usage.ts               # Usage tracking logic
│   │   └── utils.ts               # Utility functions
│   │
│   ├── modules/                    # Feature modules
│   │   ├── home/                  # Home page features
│   │   ├── messages/              # Message management
│   │   ├── projects/              # Project features
│   │   ├── sandbox/               # Sandbox management
│   │   └── usage/                 # Usage analytics
│   │
│   ├── trpc/                       # tRPC configuration
│   │   ├── init.ts                # tRPC initialization
│   │   ├── client.tsx             # Client-side setup
│   │   ├── server.tsx             # Server-side setup
│   │   ├── query-client.ts        # Query client config
│   │   └── routers/               # API route definitions
│   │
│   ├── middleware.ts               # Next.js middleware (auth)
│   ├── prompt.ts                   # AI prompts
│   └── types.ts                    # Global type definitions
│
├── components.json                 # shadcn/ui configuration
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.mjs              # PostCSS configuration
├── eslint.config.mjs               # ESLint configuration
├── package.json                    # Dependencies and scripts
├── pnpm-lock.yaml                  # Lock file
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.x ([Download](https://nodejs.org/))
- **pnpm** >= 9.x (or npm/yarn/bun)
- **PostgreSQL** >= 14.x ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Devil-2621/arccane.ai.git
   cd arccane.ai
   ```

2. **Install dependencies**

   Choose your preferred package manager:

   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Using npm
   npm install

   # Using yarn
   yarn install

   # Using bun
   bun install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section below):

   ```bash
   cp .env.example .env
   ```

4. **Set up the database**

   ```bash
   # Using pnpm
   pnpm prisma generate
   pnpm prisma db push

   # Using npm
   npm run prisma generate
   npm run prisma db push

   # Using yarn
   yarn prisma generate
   yarn prisma db push

   # Using bun
   bun prisma generate
   bun prisma db push
   ```

5. **Start the development server**

   ```bash
   # Using pnpm (with Turbopack)
   pnpm dev

   # Using npm
   npm run dev

   # Using yarn
   yarn dev

   # Using bun
   bun dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/arccane_db?schema=public"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_your_clerk_key"
CLERK_SECRET_KEY="sk_test_your_clerk_secret"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"

# E2B Sandboxes
E2B_API_KEY="your-e2b-api-key"

# Inngest
INNGEST_EVENT_KEY="your-inngest-event-key"
INNGEST_SIGNING_KEY="your-inngest-signing-key"

# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
APP_ORIGIN="http://localhost:3000"

# Optional: Vercel Deployment
VERCEL_URL=""
VERCEL_PROJECT_PRODUCTION_URL=""
VERCEL_BRANCH_URL=""

# Optional: OpenRouter (alternative AI provider)
# OPENROUTER_API_KEY="your-openrouter-api-key"
```

#### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key for authentication | ✅ Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI models | ✅ Yes |
| `E2B_API_KEY` | E2B API key for code sandboxes | ✅ Yes |
| `INNGEST_EVENT_KEY` | Inngest event key for workflows | ✅ Yes |
| `INNGEST_SIGNING_KEY` | Inngest signing key | ✅ Yes |
| `NEXT_PUBLIC_APP_URL` | Public application URL | ✅ Yes |
| `APP_ORIGIN` | Application origin for CORS | ✅ Yes |
| `OPENROUTER_API_KEY` | Optional alternative AI provider | ❌ No |

---

### Database Setup

This project uses **PostgreSQL** with **Prisma ORM**.

#### Option 1: Local PostgreSQL

1. **Install PostgreSQL** ([Download](https://www.postgresql.org/download/))

2. **Create a database**

   ```sql
   CREATE DATABASE arccane_db;
   ```

3. **Update `DATABASE_URL` in `.env`**

   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/arccane_db?schema=public"
   ```

#### Option 2: Cloud PostgreSQL (Recommended)

Use a cloud provider like:

- [Supabase](https://supabase.com/) (Free tier available)
- [Neon](https://neon.tech/) (Free tier available)
- [Railway](https://railway.app/)
- [PlanetScale](https://planetscale.com/)

Then update `DATABASE_URL` with your connection string.

#### Run Migrations

```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema to database
pnpm prisma db push

# (Optional) Open Prisma Studio to view data
pnpm prisma studio
```

---

## 💻 Usage

### Creating Your First Project

1. **Sign in** to your account (or create a new one)
2. **Enter your project description** in natural language
   - Example: "Create a modern todo app with dark mode"
3. **Watch the magic happen** as AI agents build your application
4. **Preview and interact** with your generated application
5. **View the code** using the built-in Monaco editor

### Managing Projects

- **View all projects** from the home dashboard
- **Click on a project** to see its message history
- **Generate new features** by chatting with the AI
- **Track usage** and remaining quota

### Sandbox Environments

- Each project runs in an isolated E2B sandbox
- Sandboxes provide a secure Node.js environment
- Real-time preview of generated applications
- File system access for code inspection

---

## 🔧 Development

### Available Scripts

```bash
# Development server (with Turbopack for fast refresh)
pnpm dev

# Start Inngest development server (run in separate terminal)
pnpm inngest-dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Generate Prisma Client (runs automatically after install)
pnpm postinstall
```

#### Package Manager Commands

All commands support multiple package managers:

| Command | pnpm | npm | yarn | bun |
|---------|------|-----|------|-----|
| Install | `pnpm install` | `npm install` | `yarn install` | `bun install` |
| Dev | `pnpm dev` | `npm run dev` | `yarn dev` | `bun dev` |
| Build | `pnpm build` | `npm run build` | `yarn build` | `bun build` |
| Start | `pnpm start` | `npm start` | `yarn start` | `bun start` |
| Lint | `pnpm lint` | `npm run lint` | `yarn lint` | `bun lint` |

### Database Commands

```bash
# Generate Prisma Client
pnpm prisma generate

# Push schema changes to database
pnpm prisma db push

# Create a new migration
pnpm prisma migrate dev --name migration_name

# Open Prisma Studio (Database GUI)
pnpm prisma studio

# Reset database (destructive - dev only)
pnpm prisma migrate reset

# View migration status
pnpm prisma migrate status
```

### Adding shadcn/ui Components

```bash
# Add a new component
npx shadcn@latest add button

# Add multiple components
npx shadcn@latest add button dialog card
```

### Development Workflow

1. **Make changes** to the code
2. **Hot reload** automatically updates the browser
3. **Check types** with TypeScript
4. **Lint code** with ESLint
5. **Test database changes** with Prisma Studio
6. **Commit changes** with meaningful messages

---

## 🏗️ Architecture

### High-Level Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │◄───────►│  Next.js API │◄───────►│  Database   │
│  (React)    │  tRPC   │   (tRPC)     │ Prisma  │ (PostgreSQL)│
└─────────────┘         └──────────────┘         └─────────────┘
       │                        │
       │                        ▼
       │                ┌──────────────┐
       │                │   Inngest    │
       │                │   (Agents)   │
       │                └──────────────┘
       │                        │
       │                        ▼
       │                ┌──────────────┐         ┌─────────────┐
       └───────────────►│  E2B Sandbox │◄───────►│  OpenAI API │
                        │  (Execution) │         │  (AI Model) │
                        └──────────────┘         └─────────────┘
```

### Key Components

#### 1. **Frontend (React + Next.js)**

- Server and client components
- tRPC integration for type-safe API calls
- shadcn/ui for consistent design system
- TanStack Query for data management

#### 2. **API Layer (tRPC)**

- End-to-end type safety
- Automatic TypeScript inference
- Protected procedures with authentication
- Input validation with Zod

#### 3. **AI Agent System (Inngest)**

- Multi-agent orchestration
- Durable workflow execution
- Real-time progress updates
- Error handling and retries

#### 4. **Code Execution (E2B)**

- Secure isolated sandboxes
- File system operations
- Network access for package installation
- Real-time code preview

#### 5. **Database (Prisma + PostgreSQL)**

- Type-safe database access
- Automatic migrations
- Relation management
- Connection pooling

### Authentication Flow

```
User → Clerk Sign In → Middleware Check → Protected Route
                           ↓
                      Auth Context
                           ↓
                    tRPC Context (userId)
                           ↓
                  Database Queries (user-scoped)
```

### AI Generation Flow

```
User Input → tRPC Endpoint → Inngest Event
                                   ↓
                          Agent System (Planning)
                                   ↓
                          Tool Execution (Code Gen)
                                   ↓
                          E2B Sandbox (Testing)
                                   ↓
                          Database (Save Fragment)
                                   ↓
                          Progress Updates (WebSocket)
                                   ↓
                          Client (Display Results)
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode
- Use ESLint configuration
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📄 License

This project is private and proprietary. All rights reserved.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment Platform
- [shadcn/ui](https://ui.shadcn.com/) - Component Library
- [Clerk](https://clerk.com/) - Authentication
- [Prisma](https://www.prisma.io/) - Database ORM
- [Inngest](https://www.inngest.com/) - Workflow Engine
- [E2B](https://e2b.dev/) - Code Sandboxes
- [OpenAI](https://openai.com/) - AI Models

---

## 📞 Contact & Support

- **Project Link**: [https://github.com/Devil-2621/arccane.ai](https://github.com/Devil-2621/arccane.ai)
- **Issues**: [https://github.com/Devil-2621/arccane.ai/issues](https://github.com/Devil-2621/arccane.ai/issues)

---

<div align="center">
  <p>Built with ❤️ by the Arccane.ai Team</p>
  <p>
    <a href="#-table-of-contents">Back to Top ↑</a>
  </p>
</div>
