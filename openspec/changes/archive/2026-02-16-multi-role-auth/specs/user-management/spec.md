## ADDED Requirements

### Requirement: Pending users list
The system SHALL display list of users with PENDING status for approval.

#### Scenario: View pending users
- **WHEN** Owner or Manager navigates to `/admin/users/pending`
- **THEN** system displays list of all users with PENDING status
- **AND** list shows user email, name, and registration date
- **AND** list includes approve and reject actions

#### Scenario: Pending users access control
- **WHEN** Admin attempts to access pending users page
- **THEN** system denies access (403 error or redirect)
- **AND** page is not displayed

#### Scenario: Unauthenticated access to pending users
- **WHEN** unauthenticated user attempts to access pending users page
- **THEN** system redirects to sign-in page

### Requirement: User approval
The system SHALL allow Owners and Managers to approve pending user registrations.

#### Scenario: Approve pending user
- **WHEN** Owner or Manager clicks approve button for pending user
- **THEN** system updates user status to ACTIVE
- **AND** user can now login
- **AND** user is removed from pending list
- **AND** success message is displayed

#### Scenario: Approve user access control
- **WHEN** Admin attempts to approve user
- **THEN** system denies action (403 error)
- **AND** user status is not changed

#### Scenario: Approve action via API
- **WHEN** Owner or Manager calls approve API endpoint
- **THEN** system validates user has permission
- **AND** system updates user status if permission check passes
- **AND** system returns 403 if permission check fails

### Requirement: User rejection
The system SHALL allow Owners and Managers to reject pending user registrations.

#### Scenario: Reject pending user
- **WHEN** Owner or Manager clicks reject button for pending user
- **THEN** system updates user status to REJECTED
- **AND** user cannot login
- **AND** user is removed from pending list
- **AND** success message is displayed

#### Scenario: Reject user access control
- **WHEN** Admin attempts to reject user
- **THEN** system denies action (403 error)
- **AND** user status is not changed

### Requirement: User list
The system SHALL display list of all active users for management.

#### Scenario: View all users
- **WHEN** Owner or Manager navigates to `/admin/users`
- **THEN** system displays list of all users
- **AND** list shows user email, name, role, status, and last login
- **AND** list can be filtered by role or status

#### Scenario: User list access control
- **WHEN** Admin attempts to access user list
- **THEN** system denies access (403 error or redirect)

### Requirement: User role management
The system SHALL allow Owners and Managers to change user roles.

#### Scenario: Change user role
- **WHEN** Owner or Manager changes role for a user
- **THEN** system validates requester can manage target user
- **AND** system updates user role if validation passes
- **AND** system returns error if validation fails

#### Scenario: Role change restrictions
- **WHEN** Manager attempts to change Owner's role
- **THEN** system denies action (403 error)
- **AND** role is not changed

#### Scenario: Role change to Owner
- **WHEN** user role is changed to OWNER
- **THEN** system allows change only if requester is Owner
- **AND** system denies change if requester is Manager

### Requirement: User status management
The system SHALL allow Owners to suspend active users.

#### Scenario: Suspend user
- **WHEN** Owner suspends an active user
- **THEN** system updates user status to SUSPENDED
- **AND** user cannot login
- **AND** user session is invalidated if currently logged in

#### Scenario: Suspend user access control
- **WHEN** Manager attempts to suspend user
- **THEN** system denies action (403 error)
- **AND** user status is not changed

#### Scenario: Reactivate suspended user
- **WHEN** Owner reactivates suspended user
- **THEN** system updates user status to ACTIVE
- **AND** user can login again

### Requirement: User management UI components
The system SHALL provide UI components for user management using shadcn/ui.

#### Scenario: User table component
- **WHEN** user management page loads
- **THEN** UserTable component displays user data
- **AND** table uses shadcn/ui Table component
- **AND** table is responsive and accessible

#### Scenario: Approval actions component
- **WHEN** pending users page loads
- **THEN** ApprovalActions component displays approve/reject buttons
- **AND** buttons use shadcn/ui Button component
- **AND** buttons are disabled if user lacks permission

#### Scenario: Role selector component
- **WHEN** Owner or Manager edits user role
- **THEN** RoleSelector component displays role options
- **AND** selector uses shadcn/ui Select component
- **AND** selector filters options based on user's permissions
