## ADDED Requirements

### Requirement: Hierarchical role system
The system SHALL support three hierarchical roles: OWNER, MANAGER, ADMIN.

#### Scenario: Role hierarchy
- **WHEN** system checks role permissions
- **THEN** OWNER has highest privileges (level 3)
- **AND** MANAGER has medium privileges (level 2)
- **AND** ADMIN has lowest privileges (level 1)

#### Scenario: Role assignment
- **WHEN** user account is created
- **THEN** role defaults to ADMIN unless specified
- **AND** role can be changed by authorized users

### Requirement: Role-based permission checks
The system SHALL provide utilities to check if user has required role or higher.

#### Scenario: Hierarchical role check
- **WHEN** system checks if user has role or higher
- **THEN** OWNER passes check for OWNER, MANAGER, or ADMIN requirements
- **AND** MANAGER passes check for MANAGER or ADMIN requirements
- **AND** ADMIN passes check only for ADMIN requirements

#### Scenario: Approval permission check
- **WHEN** system checks if user can approve registrations
- **THEN** OWNER returns true
- **AND** MANAGER returns true
- **AND** ADMIN returns false

#### Scenario: User management permission check
- **WHEN** system checks if user can manage another user
- **THEN** OWNER can manage any user
- **AND** MANAGER can manage MANAGER and ADMIN users
- **AND** MANAGER cannot manage OWNER users
- **AND** ADMIN cannot manage any users

### Requirement: Route protection
The system SHALL protect routes based on authentication and role requirements.

#### Scenario: Protected route access
- **WHEN** unauthenticated user attempts to access protected route
- **THEN** user is redirected to sign-in page
- **AND** original URL is saved for redirect after login

#### Scenario: Role-based route access
- **WHEN** authenticated user accesses route requiring specific role
- **THEN** system checks if user has required role or higher
- **AND** access is granted only if role check passes
- **AND** access is denied with error if role check fails

#### Scenario: Middleware protection
- **WHEN** user navigates to protected route
- **THEN** Next.js middleware runs before page load
- **AND** middleware checks authentication status
- **AND** middleware checks role if route requires specific role

### Requirement: Component-level RBAC
The system SHALL provide utilities to conditionally render UI based on user role.

#### Scenario: Role-based component rendering
- **WHEN** component checks user role
- **THEN** component can conditionally render content
- **AND** content is hidden if user doesn't have required role
- **AND** content is shown if user has required role or higher

#### Scenario: Button disable based on role
- **WHEN** button requires specific role
- **THEN** button is disabled if user lacks required role
- **AND** button is enabled if user has required role or higher

### Requirement: API route protection
The system SHALL enforce role checks in API routes.

#### Scenario: API route authentication check
- **WHEN** API route receives request
- **THEN** route checks if user is authenticated
- **AND** route returns 401 if not authenticated

#### Scenario: API route role check
- **WHEN** authenticated user calls API route requiring specific role
- **THEN** route checks if user has required role or higher
- **AND** route returns 403 if role check fails
- **AND** route processes request if role check passes

### Requirement: RBAC utility functions
The system SHALL provide reusable functions for role-based access checks.

#### Scenario: hasRoleOrHigher function
- **WHEN** code calls hasRoleOrHigher(userRole, requiredRole)
- **THEN** function returns true if userRole hierarchy >= requiredRole hierarchy
- **AND** function returns false otherwise

#### Scenario: canApproveRegistrations function
- **WHEN** code calls canApproveRegistrations(role)
- **THEN** function returns true for OWNER or MANAGER
- **AND** function returns false for ADMIN

#### Scenario: canManageUsers function
- **WHEN** code calls canManageUsers(userRole, targetRole)
- **THEN** function returns true if userRole can manage targetRole
- **AND** function returns false otherwise
