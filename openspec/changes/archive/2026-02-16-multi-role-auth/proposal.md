## Why

The current authentication system uses hardcoded credentials and has no role-based access control. We need a proper multi-role authentication system with hierarchical roles (Owner, Manager, Admin) and RBAC enforcement to enable secure, role-appropriate access to CRM features. This is foundational - all other features (client management, candidate pipeline, analytics) require knowing who the user is and what they're allowed to do.

## What Changes

- **User Model**: Create Prisma User model with email, password (bcrypt hashed), name, role, and status fields
- **Role System**: Implement hierarchical role enum (OWNER, MANAGER, ADMIN) with role-based permissions
- **Database Authentication**: Replace hardcoded auth with database-backed authentication using Prisma
- **Password Security**: Implement bcrypt password hashing with strong security standards
- **Session Enhancement**: Extend NextAuth session to include user role and status
- **RBAC Utilities**: Create helper functions for role-based access checks (hasRoleOrHigher, canManageUsers, etc.)
- **Route Protection**: Add middleware and utilities for protecting routes based on authentication and roles
- **Self-Registration**: Implement user registration flow with pending approval status
- **Approval System**: Create approval workflow where Owners/Managers can approve/reject registrations
- **User Status Management**: Implement suspend/reactivate functionality for Owners to manage user access
- **Auth Pages**: Build sign-in and sign-up pages using shadcn/ui components with responsive design
- **User Management UI**: Create admin interface for viewing pending users, approving/rejecting, managing active users, and reactivating suspended users
- **BREAKING**: Remove hardcoded authentication logic from NextAuth route

## Capabilities

### New Capabilities

- `user-authentication`: User registration, login, password management, and session handling with role-based access
- `role-based-access-control`: Hierarchical role system (Owner > Manager > Admin) with permission checks and route protection
- `user-management`: Admin interface for managing users, approving registrations, role assignment, and status management (suspend/reactivate)

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- **Database**: New User model with migrations, requires PostgreSQL database setup
- **Dependencies**: Add `bcryptjs` for password hashing, `@prisma/adapter-pg` and `pg` for Prisma 7 adapter pattern
- **NextAuth Configuration**: Update `app/api/auth/[...nextauth]/route.ts` to use database authentication with JWT and session callbacks
- **Session Provider**: Add client-side SessionProvider wrapper component for Next.js App Router compatibility
- **New Routes**: 
  - `/auth/signin` - Sign-in page (responsive design)
  - `/auth/signup` - Registration page (responsive design)
  - `/auth/pending` - Pending approval page
  - `/admin/users` - User management (protected, OWNER/MANAGER only)
  - `/admin/users/pending` - Pending approvals (protected, OWNER/MANAGER only)
- **New API Endpoints**:
  - `POST /api/auth/register` - User registration
  - `GET /api/admin/users` - List users with filters
  - `POST /api/admin/users/[id]/approve` - Approve pending user
  - `POST /api/admin/users/[id]/reject` - Reject pending user
  - `PATCH /api/admin/users/[id]/role` - Update user role
  - `POST /api/admin/users/[id]/suspend` - Suspend active user (OWNER only)
  - `POST /api/admin/users/[id]/reactivate` - Reactivate suspended user (OWNER only)
- **New Components**: Auth forms, user tables, approval actions, protected route wrappers, SessionProvider
- **Middleware**: Add authentication/authorization middleware for route protection with role-based access
- **Utilities**: New RBAC helper functions in `lib/auth.ts` and password utilities in `lib/auth/password.ts`
- **Type Definitions**: TypeScript types for User, Role, UserStatus enums extended in `types/next-auth.d.ts`
- **UI Enhancements**: Responsive design for mobile and desktop, improved styling with Tailwind v4, shadcn/ui components, and lucide-react icons
