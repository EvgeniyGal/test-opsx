## Context

The current authentication system uses hardcoded credentials in the NextAuth route handler. There's no user model, no role system, and no way to manage users. This change establishes the foundation for secure, role-based access control that all future CRM features will depend on.

**Current State:**
- NextAuth.js configured with Credentials provider
- Hardcoded authentication (returns user with id "1" for any credentials)
- No database models
- No role system
- No user management

**Constraints:**
- Must use Next.js 15 App Router patterns
- Must use Prisma 7 for database access
- Must use NextAuth.js (already configured)
- Must use shadcn/ui for UI components
- Must follow RBAC best practices

## Goals / Non-Goals

**Goals:**
- Implement hierarchical role system (Owner > Manager > Admin)
- Create database-backed authentication with secure password hashing
- Enable self-registration with approval workflow
- Build RBAC utilities for role-based access checks
- Create protected routes and components
- Build user management UI for Owners/Managers
- Extend NextAuth session with role information

**Non-Goals:**
- Email verification (defer to later)
- Password reset flow (defer to later)
- OAuth providers (Credentials only for now)
- Two-factor authentication (defer to later)
- User profile editing (basic management only)
- Audit logging of auth events (separate feature)

## Decisions

### Password Hashing: bcrypt with 10 rounds
**Decision**: Use `bcryptjs` (pure JavaScript) with 10 salt rounds for password hashing.

**Rationale:**
- `bcryptjs` works in all environments (including edge functions)
- 10 rounds provides good security/performance balance
- Standard industry practice
- Compatible with Next.js serverless environments

**Alternatives Considered:**
- `bcrypt` (native): Requires native bindings, may not work in all deployment environments
- `argon2`: More secure but slower, overkill for this use case
- `scrypt`: Good alternative but bcrypt is more widely adopted

### Role Model: Hierarchical Enum
**Decision**: Use Prisma enum for roles with hierarchical permission checks.

**Rationale:**
- Simple to implement and understand
- Type-safe with TypeScript
- Easy to extend if needed
- Hierarchical checks are straightforward

**Alternatives Considered:**
- Permission-based system: More flexible but more complex, not needed yet
- Role table with permissions: Over-engineered for three roles
- JSON permissions field: Less type-safe, harder to query

### User Status: Enum with PENDING/ACTIVE/REJECTED/SUSPENDED
**Decision**: Use enum for user status to track registration approval state.

**Rationale:**
- Clear state machine for user lifecycle
- Easy to query and filter
- Type-safe
- Supports future states (e.g., SUSPENDED)

**Alternatives Considered:**
- Boolean `approved` field: Less flexible, can't track rejection reason
- Status table: Over-engineered for simple states

### Session Strategy: Minimal Data with Role
**Decision**: Store minimal user data in NextAuth session (id, email, name, role).

**Rationale:**
- Keeps session tokens small
- Reduces security risk (no sensitive data)
- Role is sufficient for RBAC checks
- Can refresh session if role changes

**Alternatives Considered:**
- Full user object: Too much data, security risk
- Permissions array: Derive from role instead, simpler

### RBAC Implementation: Helper Functions
**Decision**: Create utility functions in `lib/auth.ts` for role checks.

**Rationale:**
- Centralized logic
- Reusable across routes and components
- Easy to test
- Type-safe

**Functions:**
- `hasRoleOrHigher(userRole, requiredRole)` - Hierarchical check
- `canApproveRegistrations(role)` - Check if can approve
- `canManageUsers(userRole, targetRole)` - Check if can manage user

### Route Protection: Middleware + Component Checks
**Decision**: Use Next.js middleware for route-level protection, component-level checks for UI.

**Rationale:**
- Middleware runs before page load (better UX)
- Component checks for fine-grained UI control
- Server-side enforcement in API routes
- Follows Next.js best practices

**Alternatives Considered:**
- HOC wrapper: Less flexible, harder to use with App Router
- Route-level checks only: Can't hide UI elements

### Approval Flow: Owner/Manager Only
**Decision**: Only Owners and Managers can approve registrations.

**Rationale:**
- Prevents privilege escalation (Admin can't approve)
- Clear responsibility
- Matches hierarchical model

**Alternatives Considered:**
- Owner only: Too restrictive, Managers should help
- All roles: Security risk, Admins shouldn't approve

### First Owner: Database Seed
**Decision**: Create first Owner via Prisma seed script.

**Rationale:**
- Simple and secure
- No special registration flow needed
- Can be removed after first setup
- Standard practice

**Alternatives Considered:**
- Special registration endpoint: More complex, security risk
- Manual database insert: Less developer-friendly

## Risks / Trade-offs

**[Risk]**: Password hashing performance in serverless → **Mitigation**: Use 10 rounds (good balance), consider caching if needed

**[Risk]**: Session refresh on role change → **Mitigation**: Force re-login or implement session refresh endpoint

**[Risk]**: Self-registration spam → **Mitigation**: Add rate limiting, email verification (future), CAPTCHA (future)

**[Risk]**: Role escalation vulnerabilities → **Mitigation**: Server-side checks always, never trust client, validate in API routes

**[Risk]**: Password requirements too strict/loose → **Mitigation**: Start with reasonable defaults (8+ chars), can adjust

**[Trade-off]**: Hierarchical roles less flexible → **Benefit**: Simpler to implement and understand, can add permissions later if needed

**[Trade-off]**: Approval workflow adds friction → **Benefit**: Security and control, prevents unauthorized access

## Migration Plan

**Deployment Steps:**
1. Create User model in Prisma schema
2. Run migration: `npx prisma migrate dev --name add_user_model`
3. Generate Prisma Client: `npx prisma generate`
4. Update NextAuth route to use database
5. Create RBAC utilities
6. Add middleware for route protection
7. Build auth pages (sign-in, sign-up)
8. Build user management UI
9. Seed first Owner user
10. Test authentication flow

**Rollback Strategy:**
- Keep old NextAuth route as backup
- Migration can be rolled back: `npx prisma migrate reset` (development)
- Database backup before production migration

**Verification:**
- Test login with seeded Owner
- Test registration → approval flow
- Test role-based access to protected routes
- Test user management UI
- Verify password hashing works
- Verify session includes role

## Open Questions

- Password requirements: Minimum 8 characters? Complexity rules? (Start with 8+ chars, no complexity)
- Email verification: Required before approval or after? (Defer, not in scope)
- Rejection handling: Allow re-registration? Store rejection reason? (Allow re-registration, no reason stored)
- Owner creation: Single Owner via seed, or allow multiple? (Single via seed, can add more manually)
- Session expiration: Use NextAuth defaults or custom? (Use defaults for now)
