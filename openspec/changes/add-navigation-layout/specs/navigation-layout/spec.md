## ADDED Requirements

### Requirement: Application layout structure
The system SHALL provide a consistent layout structure with header, sidebar, and footer components for all authenticated pages.

#### Scenario: Layout renders for authenticated pages
- **WHEN** authenticated user accesses any page except `/auth/*` routes
- **THEN** system displays header at top of page
- **AND** system displays sidebar on left side of page
- **AND** system displays footer at bottom of page
- **AND** system displays main content area between header and footer, adjacent to sidebar

#### Scenario: Layout does not render for auth pages
- **WHEN** user accesses any page under `/auth/*` routes (e.g., `/auth/signin`, `/auth/signup`)
- **THEN** system renders page without header, sidebar, or footer
- **AND** page displays full-width content

#### Scenario: Layout structure on desktop
- **WHEN** user accesses authenticated page on desktop viewport (≥ 768px width)
- **THEN** sidebar is persistently visible on left side
- **AND** sidebar has fixed width (256px or 16rem)
- **AND** header spans full width at top
- **AND** footer spans full width at bottom
- **AND** main content area adjusts to account for sidebar width

### Requirement: Header component
The system SHALL display a header component at the top of authenticated pages with branding and user context.

#### Scenario: Header displays branding
- **WHEN** authenticated user views any authenticated page
- **THEN** header displays application name or logo
- **AND** header is fixed at top of viewport
- **AND** header has consistent height

#### Scenario: Header displays mobile menu button
- **WHEN** authenticated user views page on mobile viewport (< 768px width)
- **THEN** header displays hamburger menu button
- **AND** clicking hamburger button opens mobile sidebar drawer

#### Scenario: Header does not display mobile menu on desktop
- **WHEN** authenticated user views page on desktop viewport (≥ 768px width)
- **THEN** header does not display hamburger menu button
- **AND** sidebar is persistently visible

### Requirement: Sidebar navigation
The system SHALL provide a sidebar navigation component with menu items for authenticated users.

#### Scenario: Sidebar displays on desktop
- **WHEN** authenticated user views page on desktop viewport (≥ 768px width)
- **THEN** sidebar is persistently visible on left side
- **AND** sidebar displays navigation menu items
- **AND** sidebar has fixed width and does not collapse

#### Scenario: Sidebar becomes drawer on mobile
- **WHEN** authenticated user views page on mobile viewport (< 768px width)
- **THEN** sidebar is hidden by default
- **AND** sidebar opens as drawer/sheet from left when hamburger button is clicked
- **AND** drawer overlays main content
- **AND** drawer can be closed by clicking overlay or close button

#### Scenario: Sidebar displays navigation menu items
- **WHEN** authenticated user views sidebar
- **THEN** sidebar displays menu items: Dashboard, Clients
- **AND** each menu item is a clickable link to corresponding route
- **AND** menu items are visually distinct and properly spaced

#### Scenario: Sidebar displays active route
- **WHEN** authenticated user views sidebar
- **THEN** menu item corresponding to current route is visually highlighted
- **AND** active menu item has distinct styling (e.g., background color, font weight)

### Requirement: Role-based menu visibility
The system SHALL display different menu items in sidebar based on user role (Owner, Manager, Admin).

#### Scenario: Owner sees all menu items
- **WHEN** Owner views sidebar
- **THEN** sidebar displays: Dashboard, Clients, Users, Pending Users, Approvals
- **AND** all menu items are accessible

#### Scenario: Manager sees limited admin menu items
- **WHEN** Manager views sidebar
- **THEN** sidebar displays: Dashboard, Clients, Users, Pending Users
- **AND** sidebar does not display Approvals menu item
- **AND** Approvals route is not accessible

#### Scenario: Admin sees view-only menu items
- **WHEN** Admin views sidebar
- **THEN** sidebar displays: Dashboard, Clients
- **AND** sidebar does not display Users, Pending Users, or Approvals menu items
- **AND** admin routes are not accessible

#### Scenario: Menu items filtered server-side
- **WHEN** system renders sidebar
- **THEN** menu items are filtered based on user role before rendering
- **AND** hidden menu items are not present in DOM
- **AND** role check is performed server-side

### Requirement: User menu in sidebar
The system SHALL display user information and menu in the sidebar for authenticated users.

#### Scenario: Sidebar displays user information
- **WHEN** authenticated user views sidebar
- **THEN** sidebar displays user name
- **AND** sidebar displays user email or avatar
- **AND** user information is displayed in sidebar (typically at bottom)

#### Scenario: User menu provides sign-out
- **WHEN** authenticated user views sidebar
- **THEN** sidebar displays sign-out option or button
- **AND** clicking sign-out signs user out of session
- **AND** user is redirected to sign-in page after sign-out

#### Scenario: User menu accessible to all authenticated users
- **WHEN** any authenticated user (Owner, Manager, or Admin) views sidebar
- **THEN** user menu is visible and accessible
- **AND** sign-out functionality works regardless of role

### Requirement: Footer component
The system SHALL display a minimal footer component at the bottom of authenticated pages.

#### Scenario: Footer displays on authenticated pages
- **WHEN** authenticated user views any authenticated page
- **THEN** footer is displayed at bottom of page
- **AND** footer spans full width
- **AND** footer displays copyright information

#### Scenario: Footer displays minimal content
- **WHEN** authenticated user views footer
- **THEN** footer displays application name
- **AND** footer displays copyright symbol and year
- **AND** footer does not display navigation links or complex content

#### Scenario: Footer does not display on auth pages
- **WHEN** user views page under `/auth/*` routes
- **THEN** footer is not displayed

### Requirement: Dashboard page
The system SHALL provide a dashboard page as the main landing page for authenticated users.

#### Scenario: Dashboard page exists
- **WHEN** system is accessed
- **THEN** dashboard page is available at `/dashboard` route
- **AND** dashboard page requires authentication
- **AND** dashboard page displays within navigation layout

#### Scenario: Dashboard displays welcome content
- **WHEN** authenticated user accesses dashboard page
- **THEN** dashboard displays welcome message
- **AND** dashboard displays basic overview or quick links
- **AND** dashboard content is appropriate for user's role

#### Scenario: Home page redirects authenticated users to dashboard
- **WHEN** authenticated user accesses home page (`/`)
- **THEN** system redirects user to `/dashboard`
- **AND** redirect happens automatically
- **AND** unauthenticated users can still access home page

#### Scenario: Dashboard accessible to all authenticated roles
- **WHEN** Owner, Manager, or Admin accesses dashboard
- **THEN** dashboard page is accessible
- **AND** dashboard displays within navigation layout
- **AND** dashboard content may vary by role

### Requirement: Responsive design
The system SHALL adapt layout and navigation for different viewport sizes (mobile, tablet, desktop).

#### Scenario: Mobile viewport behavior
- **WHEN** user views page on mobile viewport (< 768px width)
- **THEN** sidebar is hidden by default
- **AND** hamburger menu button is visible in header
- **AND** clicking hamburger opens sidebar as drawer
- **AND** drawer overlays content and can be closed

#### Scenario: Desktop viewport behavior
- **WHEN** user views page on desktop viewport (≥ 768px width)
- **THEN** sidebar is persistently visible
- **AND** hamburger menu button is not displayed
- **AND** sidebar does not overlay content
- **AND** main content area adjusts for sidebar width

#### Scenario: Tablet viewport behavior
- **WHEN** user views page on tablet viewport (768px - 1024px width)
- **THEN** layout follows desktop behavior (sidebar persistent)
- **AND** sidebar remains visible and accessible

#### Scenario: Layout transitions smoothly between breakpoints
- **WHEN** user resizes browser window across breakpoint (768px)
- **THEN** layout transitions from mobile to desktop behavior (or vice versa)
- **AND** transition is smooth without layout shift
- **AND** sidebar visibility updates appropriately

### Requirement: Active route highlighting
The system SHALL visually indicate the current route in the sidebar navigation.

#### Scenario: Active route is highlighted
- **WHEN** authenticated user views sidebar
- **THEN** menu item matching current route path is visually distinct
- **AND** active menu item has different styling (e.g., background color, text color, font weight)
- **AND** only one menu item is highlighted at a time

#### Scenario: Active route updates on navigation
- **WHEN** authenticated user navigates to different route
- **THEN** previously active menu item loses active styling
- **AND** new route's menu item becomes highlighted
- **AND** highlight updates without page reload

#### Scenario: Active route detection works for nested routes
- **WHEN** authenticated user views nested route (e.g., `/clients/123`)
- **THEN** parent menu item (e.g., Clients) is highlighted
- **AND** highlighting works correctly for all route depths

### Requirement: Mobile menu drawer functionality
The system SHALL provide a mobile menu drawer that opens and closes on mobile devices.

#### Scenario: Mobile drawer opens from hamburger button
- **WHEN** authenticated user on mobile viewport clicks hamburger button in header
- **THEN** sidebar drawer opens from left side
- **THEN** drawer overlays main content
- **AND** drawer displays all navigation menu items
- **AND** drawer displays user menu

#### Scenario: Mobile drawer can be closed
- **WHEN** mobile drawer is open
- **THEN** user can close drawer by clicking overlay/backdrop
- **AND** user can close drawer by clicking close button (if present)
- **AND** drawer closes smoothly with animation

#### Scenario: Mobile drawer state is managed client-side
- **WHEN** mobile drawer opens or closes
- **THEN** drawer state is managed in Client Component
- **AND** state does not persist across page navigations
- **AND** drawer closes automatically on route navigation (optional)

#### Scenario: Mobile drawer uses Sheet component
- **WHEN** system renders mobile drawer
- **THEN** drawer uses shadcn/ui Sheet component
- **AND** drawer is accessible (keyboard navigation, focus management)
- **AND** drawer follows shadcn/ui design patterns
