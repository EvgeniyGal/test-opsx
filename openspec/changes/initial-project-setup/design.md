## Context

This is a greenfield project for an HR Agency CRM. We're establishing the foundational infrastructure that all future features will build upon. The project uses modern Next.js 15 with App Router, Prisma 7 for database management, and Tailwind v4 for styling. This initial setup creates the development environment, project structure, and database foundation.

**Current State**: Empty project directory with only OpenSpec configuration files.

**Constraints**:

- Must use Next.js 15 App Router (not Pages Router)
- Must use Prisma 7 (latest version)
- Must use Tailwind CSS v4 (not v3)
- Must support TypeScript from the start
- PostgreSQL database required (no SQLite fallback for production)

## Goals / Non-Goals

**Goals:**

- Establish a production-ready development environment with all core tooling configured
- Create a scalable project structure following Next.js App Router conventions
- Set up Prisma with PostgreSQL connection and migration workflow
- Configure NextAuth.js foundation (basic setup, no role implementation yet)
- Integrate Tailwind v4 and shadcn/ui for consistent UI development
- Set up TypeScript, ESLint, and Prettier for code quality
- Create basic CI/CD workflow for automated testing and checks

**Non-Goals:**

- Implementing actual authentication flows or role-based access control (that's a separate change)
- Creating any business logic or domain models (just foundation)
- Setting up production deployment infrastructure (just CI/CD checks)
- Configuring Google Cloud Storage (that comes later with CV storage feature)
- Creating any UI components beyond shadcn/ui installation

## Decisions

### Next.js 15 App Router Structure

**Decision**: Use App Router with `app/` directory structure, not Pages Router.

**Rationale**:

- App Router is the recommended approach for Next.js 15
- Better support for Server Components, Server Actions, and React Server Components
- Improved data fetching patterns and layouts
- Better TypeScript support

**Alternatives Considered**:

- Pages Router: Older pattern, less optimal for modern React patterns
- Remix/Other frameworks: Would require different tech stack decision

### Prisma 7 with PostgreSQL

**Decision**: Use Prisma 7 as ORM with PostgreSQL database.

**Rationale**:

- Prisma provides type-safe database access
- Excellent migration system
- Strong TypeScript integration
- PostgreSQL offers robust features needed for HR CRM (JSON support, full-text search, etc.)

**Alternatives Considered**:

- TypeORM: Less type-safe, more verbose
- Drizzle: Newer, less mature ecosystem
- Raw SQL: Too low-level, loses type safety benefits

### NextAuth.js v5 (Auth.js)

**Decision**: Use NextAuth.js (Auth.js) for authentication foundation.

**Rationale**:

- Native Next.js integration
- Flexible provider system
- Good TypeScript support
- Industry standard for Next.js apps

**Alternatives Considered**:

- Clerk: Third-party service, adds dependency and cost
- Supabase Auth: Would require Supabase infrastructure
- Custom auth: Too much security risk and development time

### Tailwind CSS v4 with shadcn/ui

**Decision**: Use Tailwind CSS v4 with shadcn/ui component library.

**Rationale**:

- Tailwind v4 offers improved performance and new features
- shadcn/ui provides high-quality, customizable components
- Copy-paste component model allows full control
- Excellent TypeScript support

**Alternatives Considered**:

- Material-UI: More opinionated, harder to customize
- Chakra UI: Good but shadcn/ui better fits Next.js ecosystem
- Custom CSS: Too much development overhead

### Project Structure

**Decision**: Follow Next.js App Router conventions with organized subdirectories.

**Structure**:

```
app/              # Next.js App Router routes
components/       # Reusable React components
lib/              # Utility functions, helpers
prisma/           # Prisma schema and migrations
public/           # Static assets
.env.example      # Environment variable template
```

**Rationale**: Standard Next.js patterns ensure maintainability and team familiarity.

### TypeScript Configuration

**Decision**: Strict TypeScript configuration from the start.

**Rationale**: Catch errors early, improve developer experience, better IDE support.

### CI/CD: GitHub Actions

**Decision**: Use GitHub Actions for CI/CD checks (linting, type checking, build verification).

**Rationale**: Native GitHub integration, no additional services needed, free for public repos.

**Alternatives Considered**:

- CircleCI/Jenkins: More complex setup, external dependency
- Vercel: Would be added later for deployment, but CI checks can run independently

## Risks / Trade-offs

**[Risk]**: Tailwind v4 is relatively new → **Mitigation**: Use stable release, monitor for breaking changes, can downgrade to v3 if critical issues arise

**[Risk]**: Prisma migrations can be complex → **Mitigation**: Start with simple schema, document migration workflow, use Prisma Studio for debugging

**[Risk]**: NextAuth.js v5 (Auth.js) has breaking changes from v4 → **Mitigation**: Use latest stable version, follow official migration guide, test auth flows thoroughly

**[Risk]**: PostgreSQL setup complexity for developers → **Mitigation**: Provide clear setup instructions, consider Docker Compose for local development, document connection string format

**[Risk]**: shadcn/ui components may need customization → **Mitigation**: This is expected and by design - components are meant to be customized

**[Trade-off]**: Strict TypeScript may slow initial development → **Benefit**: Catches errors early, improves long-term maintainability

## Migration Plan

**Deployment Steps**:

1. Initialize Next.js project with TypeScript
2. Install and configure Prisma with PostgreSQL connection
3. Set up NextAuth.js with basic configuration
4. Install and configure Tailwind v4
5. Initialize shadcn/ui
6. Configure ESLint and Prettier
7. Create project folder structure
8. Set up environment variable templates
9. Create GitHub Actions workflow
10. Document setup process in README

**Rollback Strategy**: N/A - this is initial setup, no existing system to rollback from.

**Verification**:

- Run `npm run dev` - development server starts successfully
- Run `npm run build` - production build succeeds
- Run `npx prisma migrate dev` - database migrations work
- Run `npm run lint` - linting passes
- CI/CD workflow runs successfully on push

## Open Questions

- Should we use Docker Compose for local PostgreSQL setup? (Recommended but not required)
- Which NextAuth.js providers to configure initially? (At minimum: Credentials provider for development)
- Should we set up Storybook for component development? (Defer to later if needed)
- What's the preferred deployment target? (Vercel is likely but not decided yet)
