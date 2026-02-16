## 1. Database Schema

- [x] 1.1 Install bcryptjs: `npm install bcryptjs` and `npm install -D @types/bcryptjs`
- [x] 1.2 Define Role enum (OWNER, MANAGER, ADMIN) in Prisma schema
- [x] 1.3 Define UserStatus enum (PENDING, ACTIVE, REJECTED, SUSPENDED) in Prisma schema
- [x] 1.4 Create User model in Prisma schema with fields: id, email (unique), password, name, role, status, emailVerified, createdAt, updatedAt, lastLoginAt
- [x] 1.5 Add indexes to User model: email index, status index
- [x] 1.6 Run migration: `npx prisma migrate dev --name add_user_model`
- [x] 1.7 Generate Prisma Client: `npx prisma generate`

## 2. Password Utilities

- [x] 2.1 Create `lib/auth/password.ts` with hashPassword function using bcryptjs (10 rounds)
- [x] 2.2 Create verifyPassword function in `lib/auth/password.ts`
- [x] 2.3 Test password hashing and verification

## 3. RBAC Utilities

- [x] 3.1 Create `lib/auth/rbac.ts` with Role type and hierarchy constants
- [x] 3.2 Implement hasRoleOrHigher function
- [x] 3.3 Implement canApproveRegistrations function
- [x] 3.4 Implement canManageUsers function
- [x] 3.5 Export all RBAC functions from `lib/auth.ts`

## 4. NextAuth Integration

- [x] 4.1 Update NextAuth types to include role in session (create `types/next-auth.d.ts`)
- [x] 4.2 Update NextAuth authorize function to query User from database
- [x] 4.3 Update authorize to verify password using bcrypt
- [x] 4.4 Update authorize to check user status (only ACTIVE users can login)
- [x] 4.5 Add callbacks to NextAuth config: jwt callback to include role
- [x] 4.6 Add callbacks to NextAuth config: session callback to include role in session
- [x] 4.7 Remove hardcoded authentication logic
- x] 4.8 Test login flow with database user

## 5. Registration API

- [x] 5.1 Create `app/api/auth/register/route.ts` API route
- [x] 5.2 Implement registration validation (email format, password 8+ chars, name required)
- [x] 5.3 Check for duplicate email in database
- [x] 5.4 Hash password using password utility
- [x] 5.5 Create user with PENDING status
- [x] 5.6 Return success response or validation errors
- [x] 5.7 Test registration endpoint

## 6. Route Protection Middleware

- [x] 6.1 Create `middleware.ts` at project root
- [x] 6.2 Implement authentication check for protected routes
- [x] 6.3 Implement role-based route protection
- [x] 6.4 Protect `/admin/**` routes (require authentication)
- [x] 6.5 Protect `/admin/users/**` routes (require OWNER or MANAGER role)
- [x] 6.6 Redirect unauthenticated users to `/auth/signin`
- [x] 6.7 Test middleware protection

## 7. Auth Pages - Sign In

- [x] 7.1 Create `app/auth/signin/page.tsx` route
- [x] 7.2 Install shadcn/ui form components: `npx shadcn@latest add form input label button card`
- [x] 7.3 Create SignInForm component with email and password fields
- [x] 7.4 Integrate form with NextAuth signIn function
- [x] 7.5 Add form validation and error handling
- [x] 7.6 Add loading states during authentication
- [x] 7.7 Test sign-in page

## 8. Auth Pages - Sign Up

- [x] 8.1 Create `app/auth/signup/page.tsx` route
- [x] 8.2 Create SignUpForm component with email, password, and name fields
- [x] 8.3 Add password confirmation field
- [x] 8.4 Integrate form with registration API endpoint
- [x] 8.5 Add form validation (email format, password match, password length)
- [x] 8.6 Add error handling for duplicate email
- [x] 8.7 Redirect to pending approval page after successful registration
- [X] 8.8 Test sign-up page

## 9. Pending Approval Page

- [x] 9.1 Create `app/auth/pending/page.tsx` route
- [x] 9.2 Display message that registration is pending approval
- [x] 9.3 Add link back to sign-in page
- [X] 9.4 Test pending approval page

## 10. User Management API - List Users

- [x] 10.1 Create `app/api/admin/users/route.ts` GET endpoint
- [x] 10.2 Check authentication and role (OWNER or MANAGER)
- [x] 10.3 Query users from database with filters (status, role)
- [x] 10.4 Return user list (exclude password field)
- [X] 10.5 Test user list API

## 11. User Management API - Approve User

- [x] 11.1 Create `app/api/admin/users/[id]/approve/route.ts` POST endpoint
- [x] 11.2 Check requester has OWNER or MANAGER role
- [x] 11.3 Update user status to ACTIVE
- [x] 11.4 Return success response
- [X] 11.5 Test approve endpoint

## 12. User Management API - Reject User

- [x] 12.1 Create `app/api/admin/users/[id]/reject/route.ts` POST endpoint
- [x] 12.2 Check requester has OWNER or MANAGER role
- [x] 12.3 Update user status to REJECTED
- [x] 12.4 Return success response
- [X] 12.5 Test reject endpoint

## 13. User Management API - Update Role

- [x] 13.1 Create `app/api/admin/users/[id]/role/route.ts` PATCH endpoint
- [x] 13.2 Check requester can manage target user (using canManageUsers)
- [x] 13.3 Validate new role is valid
- [x] 13.4 Update user role
- [x] 13.5 Return success response
- [X] 13.6 Test role update endpoint

## 14. User Management API - Suspend User

- [x] 14.1 Create `app/api/admin/users/[id]/suspend/route.ts` POST endpoint
- [x] 14.2 Check requester is OWNER
- [x] 14.3 Update user status to SUSPENDED
- [x] 14.4 Return success response
- [X] 14.5 Test suspend endpoint

## 15. User Management UI - Pending Users Page

- [x] 15.1 Create `app/admin/users/pending/page.tsx` route
- [x] 15.2 Install shadcn/ui table component: `npx shadcn@latest add table`
- [x] 15.3 Create PendingUsersTable component
- [x] 15.4 Fetch pending users from API
- [x] 15.5 Display users in table with email, name, registration date
- [x] 15.6 Add approve and reject buttons for each user
- [x] 15.7 Implement approve action (call API, refresh list)
- [x] 15.8 Implement reject action (call API, refresh list)
- [x] 15.9 Add loading and error states
- [X] 15.10 Test pending users page

## 16. User Management UI - All Users Page

- [x] 16.1 Create `app/admin/users/page.tsx` route
- [x] 16.2 Create UsersTable component
- [x] 16.3 Fetch all users from API
- [x] 16.4 Display users in table with email, name, role, status, last login
- [x] 16.5 Add role filter dropdown
- [x] 16.6 Add status filter dropdown
- [x] 16.7 Add role change functionality (for Owners/Managers)
- [x] 16.8 Add suspend button (for Owners only)
- [X] 16.9 Test all users page

## 17. Protected Route Components

- [x] 17.1 Create `components/auth/RequireAuth.tsx` wrapper component
- [x] 17.2 Create `components/auth/RequireRole.tsx` wrapper component
- [x] 17.3 Implement redirect to sign-in if not authenticated
- [x] 17.4 Implement redirect or error if role insufficient
- [X] 17.5 Test protected components

## 18. Database Seeding

- [x] 18.1 Update `prisma/seed.ts` to create first Owner user
- [x] 18.2 Hash password for seeded user
- [x] 18.3 Set user status to ACTIVE
- [x] 18.4 Test seed script: `npx tsx prisma/seed.ts`

## 19. Testing & Verification

- [X] 19.1 Test complete registration → approval → login flow
- [X] 19.2 Test role-based access to protected routes
- [X] 19.3 Test user management UI with different roles
- [X] 19.4 Test password hashing and verification
- [X] 19.5 Test session includes role information
- [X] 19.6 Verify middleware protects routes correctly
- [X] 19.7 Test error handling (duplicate email, invalid credentials, etc.)

## 20. Documentation

- [x] 20.1 Update README with authentication setup instructions
- [x] 20.2 Document RBAC utility functions in code comments
- [x] 20.3 Document user roles and permissions
- [x] 20.4 Add environment variable documentation for AUTH_SECRET
