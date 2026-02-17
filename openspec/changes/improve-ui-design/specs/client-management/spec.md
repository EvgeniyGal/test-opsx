## MODIFIED Requirements

### Requirement: Contact management
The system SHALL manage client contacts with at least one contact required per client. The contacts list SHALL use @tanstack/react-table; on viewports below `md` it SHALL be shown as cards with a label–value layout (e.g. Name, Role, Email, Phone) per contact. Cards SHALL use enhanced styling with `rounded-2xl`, `shadow-xl`, and smooth hover effects matching authentication page quality.

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

#### Scenario: Contact cards display enhanced styling
- **WHEN** user views contact cards on mobile viewport (< 768px width)
- **THEN** contact cards use `rounded-2xl` border radius
- **AND** contact cards have enhanced shadow (`shadow-xl`)
- **AND** contact cards have smooth hover effects (`hover:shadow-2xl transition-shadow`)
- **AND** contact cards match authentication page card styling quality

### Requirement: Contract management
The system SHALL optionally track client contracts and agreements. The contracts list SHALL use @tanstack/react-table; on viewports below `md` it SHALL be shown as cards with a label–value layout (e.g. Type, Status, Start, End, Payment Terms) per contract. Cards SHALL use enhanced styling with `rounded-2xl`, `shadow-xl`, and smooth hover effects matching authentication page quality.

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
- **AND** contract cards on mobile use enhanced styling (`rounded-2xl shadow-xl hover:shadow-2xl`) matching authentication page quality

#### Scenario: Contract access control
- **WHEN** Admin attempts to add or update contract
- **THEN** system denies action (403 Forbidden)
- **AND** contract is not modified

### Requirement: Client listing and filtering
The system SHALL provide client list with filtering and search capabilities. The list SHALL be implemented with @tanstack/react-table (column definitions, sorting, single row model). On viewports below the `md` breakpoint, the list SHALL be displayed as cards (one card per client) instead of a table; from `md` up, a table SHALL be shown. Cards and tables SHALL use enhanced styling with improved shadows, spacing, and visual polish matching authentication page quality.

#### Scenario: List all clients
- **WHEN** user views client list
- **THEN** system displays all clients user has access to
- **AND** list shows: name, status, assignedTo, primary contact, last updated
- **AND** list is paginated
- **AND** on desktop (md and up) data is shown in a table; on mobile, as cards
- **AND** client cards use enhanced styling (`rounded-2xl shadow-xl hover:shadow-2xl transition-shadow`) matching authentication page quality
- **AND** table has improved spacing and visual polish

#### Scenario: Filter by status
- **WHEN** user filters clients by status
- **THEN** system returns only clients matching selected status
- **AND** filter can be combined with other filters
- **AND** filter controls use enhanced styling matching authentication page inputs

#### Scenario: Filter by assigned user
- **WHEN** user filters clients by assignedTo
- **THEN** system returns only clients assigned to selected user
- **AND** filter can be combined with other filters
- **AND** filter controls use enhanced styling matching authentication page inputs

#### Scenario: Search clients
- **WHEN** user searches clients by name or email
- **THEN** system returns matching clients
- **AND** search is case-insensitive
- **AND** search can be combined with filters
- **AND** search input uses enhanced styling (`border-2 focus:border-primary transition-colors`) matching authentication page inputs

#### Scenario: Client list access control
- **WHEN** unauthenticated user attempts to view client list
- **THEN** system redirects to sign-in page
- **AND** list is not displayed

### Requirement: Client detail view
The system SHALL provide comprehensive client detail page with enhanced card styling, improved visual hierarchy, and gradient backgrounds matching authentication page quality.

#### Scenario: View client details
- **WHEN** user views client detail page
- **THEN** system displays: basic information, status, assignment, contacts, contracts, comments timeline, status history
- **AND** user can see all information they have permission to view
- **AND** contacts and contracts use the same list pattern: @tanstack/react-table on desktop (table), cards with label–value layout on viewports below `md`
- **AND** detail page cards use enhanced styling (`rounded-2xl shadow-xl hover:shadow-2xl`) matching authentication page quality
- **AND** detail page has gradient background (`bg-gradient-to-br from-gray-50 to-gray-100`) matching authentication pages

#### Scenario: Edit client from detail page
- **WHEN** Owner or Manager clicks edit on client detail page
- **THEN** system navigates to edit page
- **AND** edit page is pre-filled with client data
- **AND** edit page uses enhanced form styling matching authentication page inputs

#### Scenario: Request status change from detail page
- **WHEN** Manager views client detail page
- **THEN** system shows "Request Status Change" button for critical transitions
- **AND** clicking button opens status change request form
- **AND** button uses gradient variant (`bg-gradient-to-r from-blue-600 to-indigo-600`) matching authentication page buttons

#### Scenario: Approve status change from detail page
- **WHEN** Owner views client detail page
- **THEN** system shows pending approval requests if any
- **AND** Owner can approve or reject from detail page
- **AND** action buttons use enhanced styling matching authentication page buttons

### Requirement: Approval queue
The system SHALL provide approval queue for Owners to review pending status change requests. The queue SHALL use @tanstack/react-table for the list (column definitions, sorting, row model) with enhanced styling and visual polish matching authentication page quality.

#### Scenario: View approval queue
- **WHEN** Owner views approval queue
- **THEN** system displays all pending status change requests
- **AND** each request shows: client name, requested by, from/to status, comment, requested date
- **AND** requests are sorted by requested date (oldest first)
- **AND** queue table has improved spacing, shadows, and visual polish matching authentication page quality

#### Scenario: Approve from queue
- **WHEN** Owner approves request from queue
- **THEN** system updates client status
- **AND** system creates StatusHistory record
- **AND** request is removed from queue
- **AND** Manager is notified
- **AND** approve button uses gradient variant matching authentication page buttons

#### Scenario: Reject from queue
- **WHEN** Owner rejects request from queue
- **THEN** system marks request as rejected
- **AND** system records review comment if provided
- **AND** request is removed from queue
- **AND** Manager is notified
- **AND** reject button uses enhanced styling matching authentication page buttons

#### Scenario: Approval queue access control
- **WHEN** Manager or Admin attempts to view approval queue
- **THEN** system denies access (403 Forbidden)
- **AND** queue is not displayed
