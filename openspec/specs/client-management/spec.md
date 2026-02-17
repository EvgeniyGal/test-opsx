### Requirement: Client creation
The system SHALL allow Owners and Managers to create new client records with company information.

#### Scenario: Create client with required fields
- **WHEN** Owner or Manager creates a new client
- **THEN** system validates required fields (name, at least one contact)
- **AND** system creates client with status PROSPECT
- **AND** system assigns client to creator by default
- **AND** system returns created client data

#### Scenario: Create client access control
- **WHEN** Admin attempts to create a client
- **THEN** system denies action (403 Forbidden)
- **AND** client is not created

#### Scenario: Create client with invalid data
- **WHEN** user attempts to create client with missing required fields
- **THEN** system returns validation errors
- **AND** client is not created

### Requirement: Client information management
The system SHALL store and manage comprehensive client company information.

#### Scenario: Client basic information
- **WHEN** client is created or updated
- **THEN** system stores: name (required), industry, website, taxId, registrationNumber, logo (URL/path)
- **AND** all fields except name are optional

#### Scenario: Update client information
- **WHEN** Owner or Manager updates client information
- **THEN** system validates data
- **AND** system updates client record
- **AND** system records updatedBy and updatedAt timestamps

#### Scenario: Update client access control
- **WHEN** Admin attempts to update client
- **THEN** system denies action (403 Forbidden)
- **AND** client is not updated

### Requirement: Client status workflow
The system SHALL manage client status lifecycle with defined transitions.

#### Scenario: Client status lifecycle
- **WHEN** client is created
- **THEN** initial status is PROSPECT
- **AND** status can transition: PROSPECT → ACTIVE → INACTIVE → ARCHIVED
- **AND** status transitions are tracked in StatusHistory

#### Scenario: Status transition validation
- **WHEN** user attempts invalid status transition (e.g., PROSPECT → ARCHIVED)
- **THEN** system validates transition is allowed
- **AND** system returns error if transition is invalid
- **AND** status is not changed

#### Scenario: Critical status transitions require comments
- **WHEN** user attempts critical status transition (PROSPECT→ACTIVE, ACTIVE→INACTIVE, ACTIVE→ARCHIVED)
- **THEN** system requires comment to be provided
- **AND** system returns error if comment is missing
- **AND** status is not changed

#### Scenario: Non-critical transitions do not require comments
- **WHEN** user updates client without changing status
- **THEN** system allows update without comment
- **AND** update proceeds successfully

### Requirement: Status change history
The system SHALL maintain immutable history of all status changes.

#### Scenario: Record status change
- **WHEN** client status changes
- **THEN** system creates StatusHistory record with: fromStatus, toStatus, changedAt, changedBy, comment (if provided)
- **AND** StatusHistory record is immutable (cannot be edited or deleted)

#### Scenario: View status history
- **WHEN** user views client status history
- **THEN** system displays all status changes in chronological order
- **AND** each entry shows status transition, timestamp, user, and comment

### Requirement: Status change approval workflow
The system SHALL require Owner approval for Manager-initiated status changes.

#### Scenario: Manager requests status change
- **WHEN** Manager requests status change for critical transition
- **THEN** system creates StatusChangeRequest with status PENDING
- **AND** system records requestedBy, requestedAt, fromStatus, toStatus, comment
- **AND** client status does not change until approved

#### Scenario: Owner approves status change
- **WHEN** Owner approves pending status change request
- **THEN** system updates StatusChangeRequest status to APPROVED
- **AND** system records reviewedBy and reviewedAt
- **AND** system updates client status to requested status
- **AND** system creates StatusHistory record
- **AND** Manager is notified of approval

#### Scenario: Owner rejects status change
- **WHEN** Owner rejects pending status change request
- **THEN** system updates StatusChangeRequest status to REJECTED
- **AND** system records reviewedBy, reviewedAt, and optional reviewComment
- **AND** client status remains unchanged
- **AND** Manager is notified of rejection

#### Scenario: Owner changes status directly
- **WHEN** Owner changes client status directly
- **THEN** system updates status immediately without approval
- **AND** system creates StatusHistory record
- **AND** no StatusChangeRequest is created

#### Scenario: Approval workflow access control
- **WHEN** Admin attempts to request or approve status changes
- **THEN** system denies action (403 Forbidden)
- **AND** request is not created or processed

### Requirement: Client assignment
The system SHALL allow assigning clients to Owners or Managers.

#### Scenario: Assign client to user
- **WHEN** Owner or Manager assigns client to user
- **THEN** system validates user is Owner or Manager
- **THEN** system updates client assignedTo field
- **AND** system records assignedAt and assignedBy
- **AND** system creates ClientAssignmentHistory record

#### Scenario: Assign client access control
- **WHEN** Admin attempts to assign client
- **THEN** system denies action (403 Forbidden)
- **AND** assignment is not updated

#### Scenario: View assigned clients
- **WHEN** user views client list
- **THEN** system shows clients assigned to them
- **AND** Owners and Managers can see all clients
- **AND** Admins can see all clients (view only)

### Requirement: Contact management
The system SHALL manage client contacts with at least one contact required per client. The contacts list SHALL use @tanstack/react-table; on viewports below `md` it SHALL be shown as cards with a label–value layout (e.g. Name, Role, Email, Phone) per contact.

#### Scenario: Add contact to client
- **WHEN** Owner or Manager adds contact to client
- **THEN** system validates contact information (name, email, phone)
- **AND** system creates ContactPerson linked to client
- **AND** system stores: name, email, phone, role, isPrimary, notes

#### Scenario: Set primary contact
- **WHEN** user sets contact as primary
- **THEN** system sets isPrimary to true for selected contact
- **AND** system sets isPrimary to false for all other contacts of same client

#### Scenario: Update contact
- **WHEN** Owner or Manager updates contact information
- **THEN** system validates data
- **AND** system updates ContactPerson record
- **AND** system records updatedBy and updatedAt

#### Scenario: Remove contact
- **WHEN** Owner or Manager removes contact
- **THEN** system validates client has at least one remaining contact
- **AND** system deletes ContactPerson if validation passes
- **AND** system returns error if removing last contact

#### Scenario: Contact access control
- **WHEN** Admin attempts to add, update, or remove contact
- **THEN** system denies action (403 Forbidden)
- **AND** contact is not modified

### Requirement: Contract management
The system SHALL optionally track client contracts and agreements. The contracts list SHALL use @tanstack/react-table; on viewports below `md` it SHALL be shown as cards with a label–value layout (e.g. Type, Status, Start, End, Payment Terms) per contract.

#### Scenario: Add contract to client
- **WHEN** Owner or Manager adds contract to client
- **THEN** system stores: type (RETAINER, PROJECT_BASED, etc.), startDate, endDate, terms, paymentTerms, documentPath (optional), status
- **AND** contract is linked to client

#### Scenario: Update contract
- **WHEN** Owner or Manager updates contract
- **THEN** system validates data
- **AND** system updates Contract record
- **AND** system records updatedBy and updatedAt

#### Scenario: View contracts
- **WHEN** user views client details
- **THEN** system displays all contracts linked to client
- **AND** contracts are shown in chronological order

#### Scenario: Contract access control
- **WHEN** Admin attempts to add or update contract
- **THEN** system denies action (403 Forbidden)
- **AND** contract is not modified

### Requirement: Comments and timeline
The system SHALL support general comments and status-specific comments on clients.

#### Scenario: Add general comment
- **WHEN** authenticated user adds comment to client
- **THEN** system creates Comment record with: content, createdBy, createdAt
- **AND** comment is linked to client
- **AND** comment appears in client timeline

#### Scenario: Add status comment
- **WHEN** user adds comment during status transition
- **THEN** system creates StatusComment record linked to StatusHistory
- **AND** comment is required for critical transitions
- **AND** comment appears in status history

#### Scenario: View comments timeline
- **WHEN** user views client details
- **THEN** system displays all comments and status changes in chronological timeline
- **AND** each entry shows type (comment or status change), user, timestamp, and content

#### Scenario: Comment access control
- **WHEN** unauthenticated user attempts to add comment
- **THEN** system denies action (401 Unauthorized)
- **AND** comment is not created

### Requirement: Client listing and filtering
The system SHALL provide client list with filtering and search capabilities. The list SHALL be implemented with @tanstack/react-table (column definitions, sorting, single row model). On viewports below the `md` breakpoint, the list SHALL be displayed as cards (one card per client) instead of a table; from `md` up, a table SHALL be shown.

#### Scenario: List all clients
- **WHEN** user views client list
- **THEN** system displays all clients user has access to
- **AND** list shows: name, status, assignedTo, primary contact, last updated
- **AND** list is paginated
- **AND** on desktop (md and up) data is shown in a table; on mobile, as cards

#### Scenario: Filter by status
- **WHEN** user filters clients by status
- **THEN** system returns only clients matching selected status
- **AND** filter can be combined with other filters

#### Scenario: Filter by assigned user
- **WHEN** user filters clients by assignedTo
- **THEN** system returns only clients assigned to selected user
- **AND** filter can be combined with other filters

#### Scenario: Search clients
- **WHEN** user searches clients by name or email
- **THEN** system returns matching clients
- **AND** search is case-insensitive
- **AND** search can be combined with filters

#### Scenario: Client list access control
- **WHEN** unauthenticated user attempts to view client list
- **THEN** system redirects to sign-in page
- **AND** list is not displayed

### Requirement: Client detail view
The system SHALL provide comprehensive client detail page.

#### Scenario: View client details
- **WHEN** user views client detail page
- **THEN** system displays: basic information, status, assignment, contacts, contracts, comments timeline, status history
- **AND** user can see all information they have permission to view
- **AND** contacts and contracts use the same list pattern: @tanstack/react-table on desktop (table), cards with label–value layout on viewports below `md`

#### Scenario: Edit client from detail page
- **WHEN** Owner or Manager clicks edit on client detail page
- **THEN** system navigates to edit page
- **AND** edit page is pre-filled with client data

#### Scenario: Request status change from detail page
- **WHEN** Manager views client detail page
- **THEN** system shows "Request Status Change" button for critical transitions
- **AND** clicking button opens status change request form

#### Scenario: Approve status change from detail page
- **WHEN** Owner views client detail page
- **THEN** system shows pending approval requests if any
- **AND** Owner can approve or reject from detail page

### Requirement: Approval queue
The system SHALL provide approval queue for Owners to review pending status change requests. The queue SHALL use @tanstack/react-table for the list (column definitions, sorting, row model).

#### Scenario: View approval queue
- **WHEN** Owner views approval queue
- **THEN** system displays all pending status change requests
- **AND** each request shows: client name, requested by, from/to status, comment, requested date
- **AND** requests are sorted by requested date (oldest first)

#### Scenario: Approve from queue
- **WHEN** Owner approves request from queue
- **THEN** system updates client status
- **AND** system creates StatusHistory record
- **AND** request is removed from queue
- **AND** Manager is notified

#### Scenario: Reject from queue
- **WHEN** Owner rejects request from queue
- **THEN** system marks request as rejected
- **AND** system records review comment if provided
- **AND** request is removed from queue
- **AND** Manager is notified

#### Scenario: Approval queue access control
- **WHEN** Manager or Admin attempts to view approval queue
- **THEN** system denies access (403 Forbidden)
- **AND** queue is not displayed

### Requirement: RBAC enforcement
The system SHALL enforce role-based access control for all client management operations.

#### Scenario: Owner full access
- **WHEN** Owner performs client management operations
- **THEN** system allows all operations: create, read, update, delete, assign, approve status changes
- **AND** Owner can change status directly without approval

#### Scenario: Manager limited access
- **WHEN** Manager performs client management operations
- **THEN** system allows: create, read, update, assign (to themselves or unassigned)
- **AND** system requires approval for status changes
- **AND** system denies: delete, approve status changes

#### Scenario: Admin view-only access
- **WHEN** Admin performs client management operations
- **THEN** system allows: read (view clients, contacts, contracts, comments)
- **AND** system denies: create, update, delete, assign, status changes

#### Scenario: Unauthenticated access denied
- **WHEN** unauthenticated user attempts client management operations
- **THEN** system redirects to sign-in page
- **AND** operation is not performed
