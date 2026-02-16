## 1. Next.js Project Initialization

- [x] 1.1 Initialize Next.js 15 project with TypeScript using `npx create-next-app@latest` with App Router option
- [x] 1.2 Verify `app/` directory structure exists with `app/layout.tsx` and `app/page.tsx`
- [x] 1.3 Verify `package.json` includes Next.js 15 and React dependencies
- [x] 1.4 Test development server starts with `npm run dev` on port 3000

## 2. TypeScript Configuration

- [x] 2.1 Configure `tsconfig.json` with strict type checking enabled
- [x] 2.2 Set up path aliases (`@/*` pointing to project root) in `tsconfig.json`
- [x] 2.3 Verify TypeScript path aliases work for `@/components` and `@/lib` imports
- [x] 2.4 Test TypeScript compilation errors are displayed in IDE and terminal

## 3. Prisma Setup

- [x] 3.1 Install Prisma 7 CLI and client: `npm install prisma @prisma/client`
- [x] 3.2 Initialize Prisma with `npx prisma init` to create `prisma/` directory
- [x] 3.3 Configure `prisma/schema.prisma` with PostgreSQL provider
- [x] 3.4 Set up `DATABASE_URL` environment variable format in `.env`
- [x] 3.5 Create `lib/prisma.ts` with Prisma Client singleton pattern for Server Components
- [x] 3.6 Generate Prisma Client with `npx prisma generate` and verify types are available
- [ ] 3.7 Create initial empty migration with `npx prisma migrate dev --name init`
- [x] 3.8 Create `prisma/seed.ts` file for database seeding
- [x] 3.9 Add seed script to `package.json`: `"prisma": { "seed": "tsx prisma/seed.ts" }`

## 4. NextAuth.js Setup

- [x] 4.1 Install NextAuth.js (Auth.js): `npm install next-auth`
- [x] 4.2 Create `app/api/auth/[...nextauth]/route.ts` with basic NextAuth configuration
- [x] 4.3 Configure `AUTH_SECRET` environment variable in `.env`
- [x] 4.4 Set up basic Credentials provider for development (minimal implementation)
- [ ] 4.5 Verify NextAuth route is accessible at `/api/auth/signin`

## 5. Tailwind CSS v4 Setup

- [x] 5.1 Install Tailwind CSS v4: `npm install -D tailwindcss@next`
- [x] 5.2 Initialize Tailwind config with `npx tailwindcss init -ts` to create `tailwind.config.ts`
- [x] 5.3 Configure Tailwind content paths in `tailwind.config.ts` for `app/` and `components/` directories
- [x] 5.4 Create or update `app/globals.css` with Tailwind directives (`@tailwind base`, `@tailwind components`, `@tailwind utilities`)
- [x] 5.5 Verify Tailwind classes work in a test component

## 6. shadcn/ui Setup

- [x] 6.1 Install shadcn/ui CLI: `npx shadcn@latest init`
- [x] 6.2 Configure shadcn/ui with TypeScript, Tailwind CSS, and App Router options
- [x] 6.3 Verify `components/ui/` directory is created
- [x] 6.4 Install a test component (e.g., Button) with `npx shadcn@latest add button`
- [x] 6.5 Verify component can be imported and used in `app/page.tsx`

## 7. Code Quality Tooling

- [x] 7.1 Install ESLint and Next.js ESLint config: `npm install -D eslint eslint-config-next`
- [x] 7.2 Configure ESLint rules in `.eslintrc.json` or extend Next.js config
- [x] 7.3 Install Prettier: `npm install -D prettier eslint-config-prettier`
- [x] 7.4 Create `.prettierrc` configuration file with project formatting rules
- [x] 7.5 Create `.prettierignore` file to exclude build artifacts
- [x] 7.6 Add format script to `package.json`: `"format": "prettier --write ."`
- [x] 7.7 Add lint script to `package.json`: `"lint": "next lint"`
- [x] 7.8 Test linting with `npm run lint` and verify it reports issues
- [x] 7.9 Test formatting with `npm run format` and verify code is formatted

## 8. Project Structure

- [x] 8.1 Create `components/` directory at project root
- [x] 8.2 Create `components/ui/` subdirectory for shadcn/ui components
- [x] 8.3 Create `lib/` directory at project root
- [x] 8.4 Create `lib/utils.ts` with common utility functions (e.g., `cn()` for className merging)
- [x] 8.5 Create `public/` directory for static assets
- [x] 8.6 Add `public/favicon.ico` placeholder file
- [x] 8.7 Verify all directories follow Next.js App Router conventions

## 9. Environment Configuration

- [x] 9.1 Create `.env.example` file with all required environment variables
- [x] 9.2 Document `DATABASE_URL` format in `.env.example`
- [x] 9.3 Document `AUTH_SECRET` in `.env.example`
- [x] 9.4 Add `.env.local` to `.gitignore` (should already be there)
- [x] 9.5 Verify environment variables are accessible in application code
- [x] 9.6 Create TypeScript types for environment variables in `lib/env.ts` (optional but recommended)

## 10. CI/CD Setup

- [x] 10.1 Create `.github/workflows/` directory
- [x] 10.2 Create `.github/workflows/ci.yml` workflow file
- [x] 10.3 Configure workflow to run on pull requests to main branch
- [x] 10.4 Add step to install dependencies: `npm ci`
- [x] 10.5 Add step to run linting: `npm run lint`
- [x] 10.6 Add step to run type checking: `npx tsc --noEmit`
- [x] 10.7 Add step to run build: `npm run build`
- [ ] 10.8 Verify workflow runs successfully on push to repository

## 11. Build and Verification

- [x] 11.1 Run production build: `npm run build` and verify it succeeds
- [ ] 11.2 Test production build locally: `npm start` and verify app runs
- [x] 11.3 Verify all TypeScript types compile without errors
- [ ] 11.4 Verify ESLint passes with no errors: `npm run lint`
- [x] 11.5 Verify Prisma Client generates correctly: `npx prisma generate`
- [ ] 11.6 Test database connection (if PostgreSQL is available): `npx prisma migrate dev`

## 12. Documentation

- [x] 12.1 Create `README.md` with project description and tech stack
- [x] 12.2 Document setup instructions in README (prerequisites, installation steps)
- [x] 12.3 Document environment variable setup process
- [x] 12.4 Document available npm scripts (`dev`, `build`, `start`, `lint`, `format`)
- [x] 12.5 Document Prisma workflow (migrations, seeding)
- [x] 12.6 Add project structure overview to README
