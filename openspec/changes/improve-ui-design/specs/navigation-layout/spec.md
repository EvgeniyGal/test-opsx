## MODIFIED Requirements

### Requirement: Header component
The system SHALL display a header component at the top of authenticated pages with branding and user context, enhanced with gradient accents, improved shadows, and decorative elements consistent with authentication pages.

#### Scenario: Header displays branding
- **WHEN** authenticated user views any authenticated page
- **THEN** header displays application name or logo
- **AND** header is fixed at top of viewport
- **AND** header has consistent height
- **AND** header has enhanced shadow (`shadow-lg`) for depth
- **AND** header background may include subtle gradient accents matching authentication pages

#### Scenario: Header displays mobile menu button
- **WHEN** authenticated user views page on mobile viewport (< 768px width)
- **THEN** header displays hamburger menu button
- **AND** clicking hamburger button opens mobile sidebar drawer
- **AND** hamburger button has smooth hover transitions matching authentication page interactions

#### Scenario: Header does not display mobile menu on desktop
- **WHEN** authenticated user views page on desktop viewport (≥ 768px width)
- **THEN** header does not display hamburger menu button
- **AND** sidebar is persistently visible

#### Scenario: Header displays theme toggle
- **WHEN** authenticated user views header
- **THEN** header displays theme toggle button
- **AND** toggle button shows current theme (Sun icon for light, Moon icon for dark)
- **AND** clicking toggle switches between light and dark theme
- **AND** theme toggle is accessible on all viewports

### Requirement: Sidebar navigation
The system SHALL provide a sidebar navigation component with menu items for authenticated users, enhanced with gradients, shadows, and improved hover states matching authentication page styling.

#### Scenario: Sidebar displays on desktop
- **WHEN** authenticated user views page on desktop viewport (≥ 768px width)
- **THEN** sidebar is persistently visible on left side
- **AND** sidebar displays navigation menu items
- **AND** sidebar has fixed width and does not collapse
- **AND** sidebar has enhanced shadow (`shadow-lg`) for depth
- **AND** sidebar background may include subtle gradient accents

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
- **AND** menu items have smooth hover transitions (`hover:bg-accent transition-colors`)
- **AND** menu items have enhanced visual styling matching authentication page quality

#### Scenario: Sidebar displays active route
- **WHEN** authenticated user views sidebar
- **THEN** menu item corresponding to current route is visually highlighted
- **AND** active menu item has distinct styling (e.g., background color, font weight)
- **AND** active menu item may include gradient accent or enhanced shadow for emphasis

### Requirement: Footer component
The system SHALL display a minimal footer component at the bottom of authenticated pages, enhanced with subtle gradient or decorative elements matching authentication page styling.

#### Scenario: Footer displays on authenticated pages
- **WHEN** authenticated user views any authenticated page
- **THEN** footer is displayed at bottom of page
- **AND** footer spans full width
- **AND** footer displays copyright information
- **AND** footer may include subtle gradient background or decorative elements
- **AND** footer has enhanced shadow (`shadow-lg`) for depth

#### Scenario: Footer displays minimal content
- **WHEN** authenticated user views footer
- **THEN** footer displays application name
- **AND** footer displays copyright symbol and year
- **AND** footer does not display navigation links or complex content
- **AND** footer styling matches authentication page aesthetic

#### Scenario: Footer does not display on auth pages
- **WHEN** user views page under `/auth/*` routes
- **THEN** footer is not displayed

### Requirement: Dashboard page
The system SHALL provide a dashboard page as the main landing page for authenticated users, enhanced with gradient backgrounds, enhanced card styling, and visual hierarchy matching authentication page quality.

#### Scenario: Dashboard page exists
- **WHEN** system is accessed
- **THEN** dashboard page is available at `/dashboard` route
- **AND** dashboard page requires authentication
- **AND** dashboard page displays within navigation layout
- **AND** dashboard page has gradient background (`bg-gradient-to-br from-gray-50 to-gray-100`) matching authentication pages

#### Scenario: Dashboard displays welcome content
- **WHEN** authenticated user accesses dashboard page
- **THEN** dashboard displays welcome message
- **AND** dashboard displays basic overview or quick links
- **AND** dashboard content is appropriate for user's role
- **AND** dashboard cards use enhanced styling (`rounded-2xl shadow-xl`) matching authentication page quality
- **AND** dashboard cards have smooth hover effects (`hover:shadow-2xl transition-shadow`)

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
- **AND** dashboard maintains consistent visual styling regardless of role
