## Why

The application currently lacks a consistent navigation structure and layout system. Users navigate between pages without clear visual hierarchy, and there's no unified way to access different sections of the application. This creates a poor user experience and makes the application feel incomplete. Additionally, a dashboard page is needed to provide users with an overview and entry point into the application. Adding a responsive navigation system with header, footer, and sidebar will establish a professional foundation for the CRM and improve usability across all devices.

## What Changes

- **Add responsive sidebar navigation** with role-based menu items (Dashboard, Clients, Admin sections)
- **Add header component** with branding/logo and user information
- **Add minimal footer component** with copyright and basic information
- **Create dashboard page** (`/dashboard`) as the main landing page for authenticated users
- **Implement hamburger menu** for mobile devices that opens/closes the sidebar
- **Add user menu in sidebar** with profile access and sign-out functionality
- **Update root layout** to include header, sidebar, and footer components
- **Implement responsive breakpoints** ensuring proper display on mobile, tablet, and desktop
- **Add active route highlighting** in navigation to show current page
- **BREAKING**: Update root layout structure - all pages will now render within the navigation layout

## Capabilities

### New Capabilities
- `navigation-layout`: Provides consistent navigation structure with responsive sidebar, header, and footer components. Includes role-based menu visibility, active route indication, mobile hamburger menu, and user menu functionality. Also includes creation of a basic dashboard page as the main landing page.

### Modified Capabilities
<!-- No existing capabilities are being modified - this is purely additive -->

## Impact

**Affected Code:**
- `app/layout.tsx` - Root layout will wrap children with navigation components
- `app/page.tsx` - Home page may redirect to dashboard or be replaced
- `app/dashboard/page.tsx` - New dashboard page to be created
- `components/` - New components: `Header.tsx`, `Sidebar.tsx`, `Footer.tsx`, `MobileMenu.tsx`
- `components/ui/` - May need additional shadcn/ui components (Sheet for mobile menu, Avatar for user display)

**Dependencies:**
- Existing shadcn/ui components (Button, Sheet, Avatar if needed)
- Next.js App Router layout system
- NextAuth session for user information and role-based rendering
- Tailwind CSS v4 for responsive styling

**Systems:**
- No database changes required
- No API changes required
- Pure UI/layout enhancement

**RBAC Considerations:**
- Sidebar menu items must respect role-based access (Owner sees all admin items, Manager sees limited admin, Admin sees view-only)
- User menu accessible to all authenticated users
- Dashboard accessible to all authenticated users (content may vary by role)
