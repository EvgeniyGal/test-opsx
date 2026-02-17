## ADDED Requirements

### Requirement: Candidate creation
The system SHALL allow Owners and Managers to create new candidate records with personal and contact information.

#### Scenario: Create candidate with required fields
- **WHEN** Owner or Manager creates a new candidate
- **THEN** system validates required fields (name, email, at least one contact method)
- **AND** system creates candidate with status APPLIED
- **AND** system assigns candidate to creator by default
- **AND** system returns created candidate data

#### Scenario: Create candidate access control
- **WHEN** Admin attempts to create a candidate
- **THEN** system denies action (403 Forbidden)
- **AND** candidate is not created

#### Scenario: Create candidate with invalid data
- **WHEN** user attempts to create candidate with missing required fields
- **THEN** system returns validation errors
- **AND** candidate is not created

### Requirement: Candidate information management
The system SHALL store and manage comprehensive candidate personal and professional information.

#### Scenario: Candidate basic information
- **WHEN** candidate is created or updated
- **THEN** system stores: name (required), email (required), phone, location, linkedInUrl, portfolioUrl, currentPosition, yearsOfExperience, skills, notes
- **AND** all fields except name and email are optional

#### Scenario: Update candidate information
- **WHEN** Owner or Manager updates candidate information
- **THEN** system validates data
- **AND** system updates candidate record
- **AND** system records updatedBy and updatedAt timestamps

#### Scenario: Update candidate access control
- **WHEN** Admin attempts to update candidate
- **THEN** system allows update for limited fields (notes, status)
- **AND** system denies update for core fields (name, email, contact info) unless user has elevated permissions

### Requirement: Candidate status workflow
The system SHALL manage candidate status lifecycle with defined pipeline stages.

#### Scenario: Candidate status lifecycle
- **WHEN** candidate is created
- **THEN** initial status is APPLIED
- **AND** status can transition through pipeline stages: APPLIED → SCREENING → INTERVIEW → OFFER → HIRED, or REJECTED at any stage
- **AND** status transitions are tracked in CandidateStatusHistory

#### Scenario: Status transition validation
- **WHEN** user attempts invalid status transition (e.g., HIRED → SCREENING)
- **THEN** system validates transition is allowed
- **AND** system returns error if transition is invalid
- **AND** status is not changed

#### Scenario: Record status change
- **WHEN** candidate status changes
- **THEN** system creates CandidateStatusHistory record with: fromStatus, toStatus, changedAt, changedBy, comment (optional)
- **AND** CandidateStatusHistory record is immutable (cannot be edited or deleted)

#### Scenario: View status history
- **WHEN** user views candidate status history
- **THEN** system displays all status changes in chronological order
- **AND** each entry shows status transition, timestamp, user, and comment

### Requirement: Candidate assignment
The system SHALL allow assigning candidates to Owners or Managers for tracking responsibility.

#### Scenario: Assign candidate to user
- **WHEN** Owner or Manager assigns candidate to user
- **THEN** system validates user is Owner or Manager
- **THEN** system updates candidate assignedTo field
- **AND** system records assignedAt and assignedBy
- **AND** system creates CandidateAssignmentHistory record

#### Scenario: Assign candidate access control
- **WHEN** Admin attempts to assign candidate
- **THEN** system denies action (403 Forbidden)
- **AND** assignment is not updated

#### Scenario: View assigned candidates
- **WHEN** user views candidate list
- **THEN** system shows candidates assigned to them
- **AND** Owners and Managers can see all candidates
- **AND** Admins can see all candidates (view only)

### Requirement: Candidate listing and filtering
The system SHALL provide candidate list with filtering and search capabilities. The list SHALL be implemented with @tanstack/react-table (column definitions, sorting, single row model). On viewports below the `md` breakpoint, the list SHALL be displayed as cards (one card per candidate) instead of a table; from `md` up, a table SHALL be shown. Cards and tables SHALL use enhanced styling with improved shadows, spacing, and visual polish matching authentication page quality.

#### Scenario: List all candidates
- **WHEN** user views candidate list
- **THEN** system displays all candidates user has access to
- **AND** list shows: name, email, status, assignedTo, currentPosition, last updated
- **AND** list is paginated
- **AND** on desktop (md and up) data is shown in a table; on mobile, as cards
- **AND** candidate cards use enhanced styling (`rounded-2xl shadow-xl hover:shadow-2xl transition-shadow`) matching authentication page quality
- **AND** table has improved spacing and visual polish

#### Scenario: Filter by status
- **WHEN** user filters candidates by status
- **THEN** system returns only candidates matching selected status
- **AND** filter can be combined with other filters
- **AND** filter controls use enhanced styling matching authentication page inputs

#### Scenario: Filter by assigned user
- **WHEN** user filters candidates by assignedTo
- **THEN** system returns only candidates assigned to selected user
- **AND** filter can be combined with other filters
- **AND** filter controls use enhanced styling matching authentication page inputs

#### Scenario: Search candidates
- **WHEN** user searches candidates by name, email, or skills
- **THEN** system returns matching candidates
- **AND** search is case-insensitive
- **AND** search can be combined with filters
- **AND** search input uses enhanced styling (`border-2 focus:border-primary transition-colors`) matching authentication page inputs

#### Scenario: Candidate list access control
- **WHEN** unauthenticated user attempts to view candidate list
- **THEN** system redirects to sign-in page
- **AND** list is not displayed

### Requirement: Candidate detail view
The system SHALL provide comprehensive candidate detail page with enhanced card styling, improved visual hierarchy, and gradient backgrounds matching authentication page quality.

#### Scenario: View candidate details
- **WHEN** user views candidate detail page
- **THEN** system displays: basic information, status, assignment, CV/resume, notes, comments, status history, job associations
- **AND** user can see all information they have permission to view
- **AND** detail page cards use enhanced styling (`rounded-2xl shadow-xl hover:shadow-2xl`) matching authentication page quality
- **AND** detail page has gradient background (`bg-gradient-to-br from-gray-50 to-gray-100`) matching authentication pages

#### Scenario: Edit candidate from detail page
- **WHEN** Owner or Manager clicks edit on candidate detail page
- **THEN** system navigates to edit page
- **AND** edit page is pre-filled with candidate data
- **AND** edit page uses enhanced form styling matching authentication page inputs

#### Scenario: Candidate detail access control
- **WHEN** Admin views candidate detail page
- **THEN** system displays candidate information
- **AND** Admin can view and add notes
- **AND** Admin cannot edit core candidate fields (name, email, contact info)

### Requirement: Candidate notes and comments
The system SHALL support notes and comments on candidates for tracking interactions and feedback.

#### Scenario: Add candidate note
- **WHEN** authenticated user adds note to candidate
- **THEN** system creates CandidateNote record with: content, createdBy, createdAt
- **AND** note is linked to candidate
- **AND** note appears in candidate timeline

#### Scenario: Add candidate comment
- **WHEN** authenticated user adds comment to candidate
- **THEN** system creates CandidateComment record with: content, createdBy, createdAt
- **AND** comment is linked to candidate
- **AND** comment appears in candidate timeline

#### Scenario: View candidate timeline
- **WHEN** user views candidate details
- **THEN** system displays all notes, comments, and status changes in chronological timeline
- **AND** each entry shows type (note, comment, or status change), user, timestamp, and content

#### Scenario: Candidate notes access control
- **WHEN** unauthenticated user attempts to add note or comment
- **THEN** system denies action (401 Unauthorized)
- **AND** note or comment is not created

### Requirement: Candidate deletion
The system SHALL allow Owners and Managers to delete candidate records.

#### Scenario: Delete candidate
- **WHEN** Owner or Manager deletes candidate
- **THEN** system validates user has permission
- **AND** system deletes candidate record and all related data (notes, comments, status history, assignment history)
- **AND** system handles CV file deletion from storage

#### Scenario: Delete candidate access control
- **WHEN** Admin attempts to delete candidate
- **THEN** system denies action (403 Forbidden)
- **AND** candidate is not deleted

### Requirement: RBAC enforcement for candidates
The system SHALL enforce role-based access control for all candidate management operations.

#### Scenario: Owner full access
- **WHEN** Owner performs candidate management operations
- **THEN** system allows all operations: create, read, update, delete, assign, status changes
- **AND** Owner can change status directly without restrictions

#### Scenario: Manager limited access
- **WHEN** Manager performs candidate management operations
- **THEN** system allows: create, read, update, assign (to themselves or unassigned)
- **AND** system allows status changes within pipeline workflow
- **AND** system denies: delete

#### Scenario: Admin view-only access
- **WHEN** Admin performs candidate management operations
- **THEN** system allows: read (view candidates, notes, comments, status history)
- **AND** system allows: update notes and comments, update status
- **AND** system denies: create, delete, assign, update core fields (name, email, contact info)

#### Scenario: Unauthenticated access denied
- **WHEN** unauthenticated user attempts candidate operations
- **THEN** system denies all operations (401 Unauthorized)
- **AND** user is redirected to sign-in page
