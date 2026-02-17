## Context

The application currently has a minimal root layout (`app/layout.tsx`) that only wraps children with a SessionProvider. There is no navigation structure, header, footer, or sidebar. Users navigate directly to routes without visual navigation aids. The application uses Next.js 15 App Router with Server Components, NextAuth.js for authentication, Tailwind CSS v4, and shadcn/ui components.

**Current State:**
- Basic root layout with no navigation
- Pages exist for: `/clients`, `/admin/users`, `/admin/approvals`, `/auth/signin`, etc.
- RBAC is enforced via middleware and route protection
- No consistent layout wrapper for authenticated pages
- No dashboard page exists

**Constraints:**
- Must work with Next.js 15 App Router (Server Components by default)
- Must integrate with NextAuth session for user info and role-based rendering
- Must use existing shadcn/ui component patterns
- Must be responsive across mobile, tablet, and desktop
- Must respect RBAC (Owner/Manager/Admin roles)
- Sidebar CSS variables already exist in `globals.css` (suggesting planned sidebar support)

## Goals / Non-Goals

**Goals:**
- Create a consistent navigation layout system with sidebar, header, and footer
- Implement responsive design that works seamlessly on mobile (< 768px), tablet (768px - 1024px), and desktop (> 1024px)
- Provide role-based menu visibility (different menu items for Owner/Manager/Admin)
- Create a dashboard page as the main landing page for authenticated users
- Implement mobile hamburger menu that opens/closes sidebar
- Add active route highlighting in navigation
- Integrate user menu in sidebar with sign-out functionality
- Ensure all authenticated pages use the new layout structure

**Non-Goals:**
- User profile page (user menu can link to placeholder or future route)
- Dashboard content beyond basic welcome/overview (detailed dashboard features are separate)
- Breadcrumb navigation (can be added later)
- Notification system integration (can be added later)
- Search functionality in header (can be added later)
- Customizable sidebar preferences (fixed structure for now)

## Decisions

### 1. Layout Structure: Sidebar + Header + Footer Pattern

**Decision:** Use a sidebar-left layout with header at top and footer at bottom.

**Rationale:**
- Sidebar provides persistent navigation and better for CRM applications with multiple sections
- Header provides branding and user context
- Footer provides minimal legal/branding info
- This pattern is common in admin/CRM interfaces

**Alternatives Considered:**
- Top navigation only: Rejected - too many menu items would clutter top nav
- Bottom navigation: Rejected - not suitable for desktop, poor UX for CRM
- Collapsible sidebar: Considered but deferred - can add collapse feature later

**Implementation:**
```
┌─────────────────────────────────────────┐
│ Header (full width, fixed top)          │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │ Main Content Area            │
│ (fixed)  │ (scrollable)                 │
│          │                              │
│          │                              │
├──────────┴──────────────────────────────┤
│ Footer (full width)                     │
└─────────────────────────────────────────┘
```

### 2. Responsive Strategy: Mobile Drawer, Desktop Persistent Sidebar

**Decision:** On mobile (< 768px), sidebar becomes a drawer/sheet that opens from left. On desktop (≥ 768px), sidebar is persistent and visible.

**Rationale:**
- Mobile screens need space for content - drawer pattern is standard
- Desktop has space for persistent sidebar - better UX for navigation
- Uses Tailwind `md:` breakpoint (768px) as the transition point

**Alternatives Considered:**
- Always drawer: Rejected - wastes screen space on desktop
- Always persistent: Rejected - takes too much space on mobile
- Bottom sheet on mobile: Considered but rejected - sidebar from left is more standard

**Implementation:**
- Use shadcn/ui `Sheet` component for mobile drawer
- Use conditional rendering: `md:block hidden` for desktop sidebar, `md:hidden` for mobile hamburger button
- Hamburger button in header opens/closes drawer

### 3. Component Architecture: Server Components with Client Interactivity

**Decision:** Use Next.js 15 Server Components for layout structure, with Client Components only where needed (mobile menu state, active route detection).

**Rationale:**
- Server Components reduce client bundle size
- Layout structure doesn't need client-side state except for mobile menu
- NextAuth session can be accessed server-side via `getServerSession`
- Active route can be detected server-side using `headers()` from `next/headers`

**Alternatives Considered:**
- Fully client-side layout: Rejected - unnecessary JavaScript, worse performance
- Fully server-side: Rejected - mobile menu needs client state

**Implementation:**
- `app/layout.tsx`: Server Component that wraps with navigation
- `components/layout/AppLayout.tsx`: Server Component wrapper
- `components/layout/Sidebar.tsx`: Server Component (reads session server-side)
- `components/layout/Header.tsx`: Server Component (reads session server-side)
- `components/layout/MobileMenu.tsx`: Client Component (manages drawer state)
- `components/layout/Footer.tsx`: Server Component

### 4. Active Route Detection: Server-Side Pathname Reading

**Decision:** Use `headers()` from `next/headers` to read pathname server-side and pass as prop to navigation components.

**Rationale:**
- Server Components can't use `usePathname()` hook
- `headers()` provides access to request URL
- Avoids client-side JavaScript for route detection
- Works with App Router

**Alternatives Considered:**
- Client Component wrapper: Rejected - adds unnecessary client JS
- URL search params: Rejected - not needed, pathname is sufficient
- Context provider: Considered but rejected - overkill for this use case

**Implementation:**
```typescript
import { headers } from 'next/headers';

const headersList = headers();
const pathname = headersList.get('x-pathname') || '/';
```

Note: May need middleware to set `x-pathname` header, or use alternative approach.

### 5. RBAC Menu Visibility: Server-Side Role Checking

**Decision:** Filter menu items server-side based on user role from NextAuth session.

**Rationale:**
- Security: Don't expose hidden routes to client
- Performance: No client-side filtering needed
- Simplicity: Role is available in server component via session

**Alternatives Considered:**
- Client-side filtering: Rejected - security risk, exposes routes
- Separate menu configs: Considered but rejected - more complex, same result

**Implementation:**
- Define menu structure with role requirements
- Filter menu items in Server Component based on `session.user.role`
- Render only visible items

### 6. Dashboard Route Strategy: Redirect vs Replace Home

**Decision:** Keep `/` as public landing page, create `/dashboard` as authenticated landing page, redirect authenticated users from `/` to `/dashboard`.

**Rationale:**
- Preserves `/` for potential marketing/public use
- Clear separation: public vs authenticated areas
- Standard pattern: `/dashboard` is common for authenticated apps

**Alternatives Considered:**
- Replace `/` with dashboard: Considered but rejected - loses public landing option
- No redirect: Rejected - confusing UX, users don't know where to go

**Implementation:**
- Create `app/dashboard/page.tsx` as Server Component
- Update `app/page.tsx` to redirect authenticated users to `/dashboard`
- Dashboard shows welcome message and quick links (can be enhanced later)

### 7. Footer Content: Minimal Approach

**Decision:** Footer contains only copyright, app name, and year. No links or complex content.

**Rationale:**
- Proposal specifies "minimal footer"
- Keeps footer unobtrusive
- Can be enhanced later if needed

**Alternatives Considered:**
- Full footer with links: Rejected - not in scope
- No footer: Considered but rejected - footer provides closure to layout

### 8. shadcn/ui Components: Add Sheet and Avatar

**Decision:** Add `sheet` component for mobile drawer and `avatar` component for user display in sidebar.

**Rationale:**
- Sheet provides accessible drawer/sidebar component
- Avatar provides user display pattern
- Both are standard shadcn/ui components, fit the design system

**Alternatives Considered:**
- Custom drawer: Rejected - reinventing wheel, accessibility concerns
- Text-only user display: Considered but rejected - avatar is better UX

**Implementation:**
- Run `npx shadcn@latest add sheet` and `npx shadcn@latest add avatar`
- Use Sheet for mobile menu drawer
- Use Avatar in sidebar for user display

### 9. Layout Wrapper: Conditional Rendering for Auth Pages

**Decision:** Only show navigation layout for authenticated pages. Auth pages (`/auth/*`) render without navigation.

**Rationale:**
- Auth pages (signin, signup) shouldn't have navigation
- Cleaner UX for authentication flow
- Matches common pattern

**Alternatives Considered:**
- Always show navigation: Rejected - confusing on auth pages
- Separate auth layout: Considered but rejected - overkill, conditional is simpler

**Implementation:**
- Check pathname in root layout
- Conditionally render navigation wrapper
- Auth routes render without sidebar/header/footer

## Risks / Trade-offs

### [Risk] Server Component Pathname Detection Complexity
**Mitigation:** If `headers()` approach is complex, use a Client Component wrapper for navigation that uses `usePathname()`. Trade-off: slightly more client JS, but simpler implementation.

### [Risk] Mobile Menu State Management
**Mitigation:** Use React state in Client Component (`MobileMenu`). Keep state local to component. Consider using URL state if needed for deep linking.

### [Risk] Layout Shift on Page Load
**Mitigation:** Ensure sidebar has fixed width, header has fixed height. Use CSS to prevent layout shift. Consider skeleton loading for user info.

### [Risk] RBAC Menu Filtering Logic Complexity
**Mitigation:** Create a simple menu configuration object with role requirements. Use helper function to filter. Keep logic centralized and testable.

### [Risk] Breaking Existing Pages
**Mitigation:** Test all existing pages render correctly in new layout. Ensure padding/margins account for sidebar. Use CSS Grid or Flexbox for proper layout.

### [Trade-off] Server vs Client Components
**Trade-off:** Using Server Components reduces bundle size but adds complexity for interactive features. **Decision:** Accept complexity for performance benefit. Use Client Components only where necessary (mobile menu).

### [Trade-off] Dashboard Content
**Trade-off:** Creating basic dashboard now vs waiting for full dashboard features. **Decision:** Create basic dashboard now to establish route and layout. Can enhance later.

## Migration Plan

### Phase 1: Add Required shadcn/ui Components
1. Run `npx shadcn@latest add sheet`
2. Run `npx shadcn@latest add avatar`
3. Verify components are added correctly

### Phase 2: Create Layout Components
1. Create `components/layout/AppLayout.tsx` (Server Component wrapper)
2. Create `components/layout/Header.tsx` (Server Component)
3. Create `components/layout/Sidebar.tsx` (Server Component)
4. Create `components/layout/MobileMenu.tsx` (Client Component)
5. Create `components/layout/Footer.tsx` (Server Component)

### Phase 3: Update Root Layout
1. Modify `app/layout.tsx` to conditionally wrap with navigation
2. Add logic to detect auth routes vs authenticated routes
3. Test layout renders correctly

### Phase 4: Create Dashboard Page
1. Create `app/dashboard/page.tsx`
2. Add basic welcome content
3. Add redirect logic in `app/page.tsx` for authenticated users

### Phase 5: Testing
1. Test responsive behavior (mobile, tablet, desktop)
2. Test RBAC menu visibility (Owner, Manager, Admin)
3. Test active route highlighting
4. Test mobile menu open/close
5. Test sign-out functionality
6. Verify all existing pages still work

### Rollback Strategy
- Keep old `app/layout.tsx` in git history
- Can revert to minimal layout if issues arise
- No database changes, so rollback is simple file revert

## Open Questions

1. **Pathname Detection:** What's the best way to get pathname in Server Components? Should we use middleware to set header, or use a different approach?

2. **Dashboard Content:** What should the basic dashboard show? Just welcome message, or include quick stats/links?

3. **Logo/Branding:** What should go in the header? Text logo, image logo, or just app name?

4. **Sidebar Width:** What's the ideal sidebar width? Standard is 256px (16rem) or 240px (15rem).

5. **User Menu Actions:** Besides sign-out, what else should user menu include? Profile link? Settings? (Can be placeholder for now)

6. **Footer Year:** Should footer show current year dynamically or hardcoded?
