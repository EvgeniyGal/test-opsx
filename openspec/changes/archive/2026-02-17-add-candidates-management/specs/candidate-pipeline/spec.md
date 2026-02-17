## ADDED Requirements

### Requirement: Candidate pipeline stages
The system SHALL define standard pipeline stages for candidate progression through the recruitment process.

#### Scenario: Pipeline stages are defined
- **WHEN** system manages candidate pipeline
- **THEN** system uses pipeline stages: APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED
- **AND** stages represent progression from initial application to final outcome
- **AND** REJECTED can occur at any stage

#### Scenario: Pipeline stage order
- **WHEN** candidate progresses through pipeline
- **THEN** stages follow logical order: APPLIED → SCREENING → INTERVIEW → OFFER → HIRED
- **AND** system prevents backward transitions (e.g., HIRED → INTERVIEW)
- **AND** system allows REJECTED from any stage

### Requirement: Kanban board interface
The system SHALL provide a visual Kanban board interface for managing candidate pipeline with drag-and-drop status updates.

#### Scenario: Kanban board displays pipeline stages
- **WHEN** user views candidate Kanban board
- **THEN** system displays columns for each pipeline stage (APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED)
- **AND** each column shows candidates in that stage
- **AND** columns are arranged horizontally with scrollable content

#### Scenario: Kanban board shows candidate cards
- **WHEN** user views Kanban board column
- **THEN** column displays candidate cards with: name, current position, assigned user, last updated
- **AND** cards are vertically stacked within column
- **AND** cards use enhanced styling (`rounded-2xl shadow-xl`) matching authentication page quality
- **AND** cards have smooth hover effects (`hover:shadow-2xl transition-shadow`)

#### Scenario: Drag candidate between stages
- **WHEN** user drags candidate card from one column to another
- **THEN** system updates candidate status to target stage
- **AND** system creates CandidateStatusHistory record
- **AND** card moves to new column visually
- **AND** status change persists after page reload

#### Scenario: Drag-and-drop uses @dnd-kit
- **WHEN** system renders Kanban board
- **THEN** board uses @dnd-kit/core and @dnd-kit/sortable for drag-and-drop functionality
- **AND** drag-and-drop is accessible (keyboard navigation support)
- **AND** drag-and-drop provides visual feedback during drag operation

#### Scenario: Kanban board is responsive
- **WHEN** user views Kanban board on mobile viewport (< 768px width)
- **THEN** board adapts layout for smaller screen
- **AND** columns may stack vertically or use horizontal scroll
- **AND** candidate cards remain readable and interactive

### Requirement: Pipeline status transition rules
The system SHALL enforce rules for valid status transitions in the candidate pipeline.

#### Scenario: Valid forward transitions
- **WHEN** user attempts to move candidate forward in pipeline
- **THEN** system allows transitions: APPLIED → SCREENING, SCREENING → INTERVIEW, INTERVIEW → OFFER, OFFER → HIRED
- **AND** transition succeeds and status updates

#### Scenario: Invalid backward transitions
- **WHEN** user attempts to move candidate backward in pipeline (e.g., INTERVIEW → SCREENING)
- **THEN** system prevents backward transition
- **AND** system returns error message
- **AND** candidate status remains unchanged

#### Scenario: Rejection from any stage
- **WHEN** user moves candidate to REJECTED stage
- **THEN** system allows rejection from any pipeline stage (APPLIED, SCREENING, INTERVIEW, OFFER)
- **AND** system records rejection reason if provided
- **AND** candidate cannot return to active pipeline stages after rejection

#### Scenario: Hired candidate is final
- **WHEN** candidate reaches HIRED stage
- **THEN** candidate cannot transition to other stages
- **AND** candidate remains in HIRED stage
- **AND** system prevents further status changes

### Requirement: Pipeline view filtering
The system SHALL allow filtering candidates in Kanban board view.

#### Scenario: Filter by assigned user
- **WHEN** user filters Kanban board by assigned user
- **THEN** board displays only candidates assigned to selected user
- **AND** filter applies across all pipeline stages
- **AND** empty stages show appropriate message

#### Scenario: Filter by search query
- **WHEN** user searches candidates in Kanban board
- **THEN** board highlights or filters matching candidates
- **AND** search works across all pipeline stages
- **AND** non-matching candidates are hidden or dimmed

#### Scenario: Clear filters
- **WHEN** user clears filters
- **THEN** board displays all candidates in their respective stages
- **AND** all pipeline stages are visible

### Requirement: Pipeline statistics
The system SHALL display pipeline statistics and metrics in Kanban board view.

#### Scenario: Stage counts display
- **WHEN** user views Kanban board
- **THEN** each column header shows count of candidates in that stage
- **AND** counts update in real-time as candidates move between stages

#### Scenario: Pipeline metrics
- **WHEN** user views Kanban board
- **THEN** system may display metrics: total candidates, average time in stage, conversion rates
- **AND** metrics help users understand pipeline performance

### Requirement: Pipeline view access control
The system SHALL enforce role-based access control for Kanban board view.

#### Scenario: Owner and Manager access
- **WHEN** Owner or Manager views Kanban board
- **THEN** system displays all candidates in pipeline
- **AND** user can drag-and-drop candidates between stages
- **AND** user can filter and search candidates

#### Scenario: Admin access
- **WHEN** Admin views Kanban board
- **THEN** system displays all candidates in pipeline
- **AND** Admin can drag-and-drop candidates between stages
- **AND** Admin can filter and search candidates
- **AND** Admin cannot modify core candidate information

#### Scenario: Unauthenticated access denied
- **WHEN** unauthenticated user attempts to view Kanban board
- **THEN** system denies access (401 Unauthorized)
- **AND** user is redirected to sign-in page
