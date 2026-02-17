## MODIFIED Requirements

### Requirement: Sidebar navigation
The system SHALL provide a sidebar navigation component with menu items for authenticated users.

#### Scenario: Sidebar displays navigation menu items
- **WHEN** authenticated user views sidebar
- **THEN** sidebar displays menu items: Dashboard, Clients, Candidates
- **AND** each menu item is a clickable link to corresponding route
- **AND** menu items are visually distinct and properly spaced
- **AND** menu items have smooth hover transitions (`hover:bg-accent transition-colors`)
- **AND** menu items have enhanced visual styling matching authentication page quality

### Requirement: Role-based menu visibility
The system SHALL display different menu items in sidebar based on user role (Owner, Manager, Admin).

#### Scenario: Owner sees all menu items
- **WHEN** Owner views sidebar
- **THEN** sidebar displays: Dashboard, Clients, Candidates, Users, Pending Users, Approvals
- **AND** all menu items are accessible

#### Scenario: Manager sees limited admin menu items
- **WHEN** Manager views sidebar
- **THEN** sidebar displays: Dashboard, Clients, Candidates, Users, Pending Users
- **AND** sidebar does not display Approvals menu item
- **AND** Approvals route is not accessible

#### Scenario: Admin sees view-only menu items
- **WHEN** Admin views sidebar
- **THEN** sidebar displays: Dashboard, Clients, Candidates
- **AND** sidebar does not display Users, Pending Users, or Approvals menu items
- **AND** admin routes are not accessible
