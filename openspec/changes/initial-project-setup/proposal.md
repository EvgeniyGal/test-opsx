## Why

We need to establish the foundational infrastructure and development environment for the HR Agency CRM. This initial setup creates the project scaffolding, configures core dependencies, and establishes conventions that all future features will build upon. Without this foundation, we cannot begin implementing any of the planned features (auth, candidate pipeline, CV storage, etc.).

## What Changes

- **Next.js 15 Setup**: Initialize Next.js 15 project with App Router configuration
- **Database & ORM**: Configure Prisma 7 with PostgreSQL connection and initial schema setup
- **Authentication Foundation**: Install and configure NextAuth.js with basic setup (no roles yet)
- **Styling System**: Set up Tailwind CSS v4 and integrate shadcn/ui component library
- **Project Structure**: Establish folder organization following Next.js App Router conventions
- **Environment Configuration**: Create environment variable templates and configuration files
- **Development Tooling**: Configure TypeScript, ESLint, Prettier, and basic development scripts
- **CI/CD Foundation**: Set up basic GitHub Actions workflow for testing and deployment checks

## Capabilities

### New Capabilities

- `development-environment`: Development environment setup, tooling configuration, and local development workflow
- `project-structure`: Project folder organization, file naming conventions, and architectural patterns
- `database-foundation`: Prisma schema setup, database connection management, and migration workflow

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- **New Dependencies**: Next.js 15, Prisma 7, NextAuth.js, Tailwind CSS v4, shadcn/ui, TypeScript, and related tooling packages
- **Project Structure**: Creates the entire application directory structure (`app/`, `components/`, `lib/`, `prisma/`, etc.)
- **Configuration Files**: Adds `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `prisma/schema.prisma`, `.env.example`, and other config files
- **Build System**: Establishes Next.js build pipeline and development server
- **Database**: Requires PostgreSQL database instance (local or remote) for development
- **No Breaking Changes**: This is a greenfield project, so no existing code is affected
