## 1. Setup and Dependencies

- [x] 1.1 Add shadcn/ui Sheet component (`npx shadcn@latest add sheet`)
- [x] 1.2 Add shadcn/ui Avatar component (`npx shadcn@latest add avatar`)
- [x] 1.3 Verify Sheet and Avatar components are added correctly to `components/ui/`
- [x] 1.4 Create `components/layout/` directory structure

## 2. Menu Configuration and Utilities

- [x] 2.1 Create menu configuration file (`lib/menu-config.ts`) with menu items structure
- [x] 2.2 Define menu items: Dashboard, Clients, Users, Pending Users, Approvals with routes and role requirements
- [x] 2.3 Create helper function to filter menu items based on user role (Owner/Manager/Admin)
- [x] 2.4 Create helper function to determine active route for highlighting (handles nested routes)

## 3. Footer Component

- [x] 3.1 Create `components/layout/Footer.tsx` as Server Component
- [x] 3.2 Implement footer with application name, copyright symbol, and year
- [x] 3.3 Style footer with minimal design (full width, appropriate padding, muted colors)
- [x] 3.4 Ensure footer displays current year dynamically

## 4. Header Component

- [x] 4.1 Create `components/layout/Header.tsx` as Server Component
- [x] 4.2 Implement header with application name/logo branding
- [x] 4.3 Add fixed positioning and consistent height styling
- [x] 4.4 Add hamburger menu button that shows only on mobile viewport (< 768px)
- [x] 4.5 Style hamburger button with appropriate icon (Menu from lucide-react)
- [x] 4.6 Pass mobile menu open handler as prop (will connect to MobileMenu component)

## 5. Mobile Menu Component

- [x] 5.1 Create `components/layout/MobileMenu.tsx` as Client Component ("use client")
- [x] 5.2 Implement Sheet component wrapper for mobile drawer
- [x] 5.3 Add state management for drawer open/close (useState)
- [x] 5.4 Implement open/close handlers
- [x] 5.5 Configure Sheet to open from left side
- [x] 5.6 Add close button or overlay click to close drawer
- [x] 5.7 Pass Sidebar component content into Sheet
- [x] 5.8 Ensure drawer closes on route navigation (optional enhancement)

## 6. Sidebar Component

- [x] 6.1 Create `components/layout/Sidebar.tsx` as Server Component
- [x] 6.2 Get user session server-side using `getServerSession` from NextAuth
- [x] 6.3 Get current pathname server-side (using headers or alternative approach)
- [x] 6.4 Filter menu items based on user role using menu config helper
- [x] 6.5 Render menu items as navigation links (using Next.js Link component)
- [x] 6.6 Implement active route highlighting (compare pathname with menu item routes)
- [x] 6.7 Handle nested routes (e.g., `/clients/123` highlights "Clients" menu item)
- [x] 6.8 Style sidebar with fixed width (256px/16rem), appropriate spacing, and active state styling
- [x] 6.9 Add user information section at bottom of sidebar (name, email/avatar)
- [x] 6.10 Add sign-out button/option in user section
- [x] 6.11 Implement sign-out functionality using NextAuth signOut
- [x] 6.12 Ensure sidebar is hidden on mobile (< 768px) and visible on desktop (≥ 768px)

## 7. App Layout Wrapper Component

- [x] 7.1 Create `components/layout/AppLayout.tsx` as Server Component wrapper
- [x] 7.2 Get user session server-side
- [x] 7.3 Get current pathname server-side
- [x] 7.4 Implement layout structure: Header, Sidebar, Main Content, Footer
- [x] 7.5 Use CSS Grid or Flexbox for proper layout (sidebar left, content right, header top, footer bottom)
- [x] 7.6 Ensure main content area adjusts for sidebar width on desktop
- [x] 7.7 Pass pathname and session to Header and Sidebar components
- [x] 7.8 Integrate MobileMenu component (Client Component) for mobile drawer
- [x] 7.9 Ensure responsive breakpoints work correctly (mobile drawer, desktop persistent sidebar)

## 8. Update Root Layout

- [x] 8.1 Modify `app/layout.tsx` to conditionally render navigation
- [x] 8.2 Add logic to detect if current route is under `/auth/*` path
- [x] 8.3 If auth route: render children without AppLayout wrapper
- [x] 8.4 If authenticated route: wrap children with AppLayout component
- [x] 8.5 Ensure SessionProvider still wraps everything
- [X] 8.6 Test that auth pages (signin, signup) render without navigation
- [X] 8.7 Test that authenticated pages render with navigation layout

## 9. Dashboard Page

- [x] 9.1 Create `app/dashboard/page.tsx` as Server Component
- [x] 9.2 Get user session server-side
- [x] 9.3 Add authentication check (redirect if not authenticated)
- [x] 9.4 Implement welcome message with user's name
- [x] 9.5 Add basic overview content or quick links section
- [x] 9.6 Style dashboard page appropriately
- [x] 9.7 Ensure dashboard displays within navigation layout

## 10. Home Page Redirect

- [x] 10.1 Modify `app/page.tsx` to check authentication status
- [x] 10.2 If user is authenticated: redirect to `/dashboard`
- [x] 10.3 If user is not authenticated: show current home page content
- [x] 10.4 Use Next.js redirect or router.push for redirect
- [X] 10.5 Test redirect works correctly for both authenticated and unauthenticated users

## 11. Pathname Detection Implementation

- [x] 11.1 Research best approach for getting pathname in Server Components
- [x] 11.2 Option A: Use middleware to set `x-pathname` header, read via `headers()`
- [x] 11.3 Option B: Use alternative approach (e.g., Client Component wrapper if needed)
- [x] 11.4 Implement chosen approach in AppLayout, Header, and Sidebar components
- [X] 11.5 Test pathname detection works correctly for all routes

## 12. Responsive Design Testing

- [X] 12.1 Test layout on mobile viewport (< 768px): sidebar hidden, hamburger visible
- [X] 12.2 Test mobile drawer opens and closes correctly
- [X] 12.3 Test layout on tablet viewport (768px - 1024px): sidebar persistent
- [X] 12.4 Test layout on desktop viewport (> 1024px): sidebar persistent
- [X] 12.5 Test smooth transitions when resizing browser across breakpoints
- [X] 12.6 Verify no layout shift occurs on page load
- [X] 12.7 Test hamburger button only shows on mobile, not desktop

## 13. RBAC Menu Visibility Testing

- [X] 13.1 Test Owner role: sees Dashboard, Clients, Users, Pending Users, Approvals
- [X] 13.2 Test Manager role: sees Dashboard, Clients, Users, Pending Users (no Approvals)
- [X] 13.3 Test Admin role: sees Dashboard, Clients only (no admin menu items)
- [X] 13.4 Verify hidden menu items are not in DOM (server-side filtering)
- [X] 13.5 Test menu items are correctly filtered based on session role

## 14. Active Route Highlighting Testing

- [X] 14.1 Test active route highlighting works for Dashboard (`/dashboard`)
- [X] 14.2 Test active route highlighting works for Clients (`/clients`)
- [X] 14.3 Test active route highlighting works for nested routes (e.g., `/clients/123` highlights Clients)
- [X] 14.4 Test active route updates when navigating between pages
- [X] 14.5 Verify only one menu item is highlighted at a time
- [X] 14.6 Test active styling is visually distinct (background color, font weight, etc.)

## 15. User Menu and Sign-Out Testing

- [X] 15.1 Test user information displays correctly (name, email/avatar) in sidebar
- [X] 15.2 Test sign-out button is visible and accessible
- [X] 15.3 Test clicking sign-out signs user out of session
- [X] 15.4 Test user is redirected to sign-in page after sign-out
- [X] 15.5 Test user menu works for all roles (Owner, Manager, Admin)

## 16. Integration Testing

- [X] 16.1 Test all existing pages still render correctly with new layout
- [X] 16.2 Test `/clients` page renders correctly in layout
- [X] 16.3 Test `/admin/users` page renders correctly in layout
- [X] 16.4 Test `/admin/approvals` page renders correctly in layout
- [X] 16.5 Test `/clients/[id]` page renders correctly in layout
- [X] 16.6 Test `/clients/new` page renders correctly in layout
- [X] 16.7 Verify content padding/margins account for sidebar width
- [X] 16.8 Test navigation between pages works smoothly

## 17. Accessibility and Polish

- [X] 17.1 Verify Sheet component is accessible (keyboard navigation, focus management)
- [X] 17.2 Test keyboard navigation in sidebar menu
- [X] 17.3 Ensure proper ARIA labels on navigation elements
- [X] 17.4 Test focus management when mobile drawer opens/closes
- [X] 17.5 Verify color contrast meets accessibility standards
- [X] 17.6 Test with screen reader if possible

## 18. Final Verification

- [X] 18.1 Verify all requirements from specs are implemented
- [X] 18.2 Verify all design decisions are followed
- [X] 18.3 Check for any console errors or warnings
- [X] 18.4 Verify no TypeScript errors
- [X] 18.5 Test in multiple browsers (Chrome, Firefox, Safari if possible)
- [X] 18.6 Verify build succeeds (`npm run build`)
