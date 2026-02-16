## Context

The CRM currently has authentication and user management but lacks any way to track client companies. Client Management is foundational - future features (Job Management, Candidate Pipeline) depend on clients existing first. This change establishes the data model, workflows, and UI for managing client relationships throughout their lifecycle.

**Current State:**
- User authentication and RBAC system in place (Owner, Manager, Admin roles)
- No client or company tracking
- No status workflows beyond user status
- No approval workflow system

**Constraints:**
- Must use Next.js 15 App Router patterns (Server Components, Server Actions, Route Handlers)
- Must use Prisma 7 for database access
- Must follow existing RBAC patterns from user management
- Must use shadcn/ui components and Tailwind v4
- Must integrate with future Job Management and Candidate Pipeline features

## Goals / Non-Goals

**Goals:**
- Create comprehensive client data model with company information, contacts, and optional contracts
- Implement status workflow with history tracking and comments
- Build approval workflow for Manager-initiated status changes
- Enable single-user assignment of clients to Owners/Managers
- Provide full CRUD interface for client management
- Enforce RBAC at API and UI levels
- Design for future integration with Jobs and Candidates

**Non-Goals:**
- Job Management (separate change)
- Candidate Pipeline integration (will be added in future change)
- Email notifications (defer to later)
- Bulk operations (defer to later)
- Client import/export (defer to later)
- Advanced search/filtering beyond basic filters (defer to later)
- Document storage for contracts (design for it, but defer implementation)
- Team assignments (single user only for now)

## Decisions

### Decision 1: Separate Comment Models
**Decision**: Use separate models for StatusComment (workflow transitions) and Comment (general timeline).

**Rationale:**
- Clear separation of concerns: workflow comments vs. general discussion
- Different validation rules (status comments required for critical transitions)
- Easier querying and filtering
- Better audit trail for status changes

**Alternatives Considered:**
- Single Comment model with `type` field: Simpler schema but less type safety and harder to enforce validation rules
- Comments embedded in StatusHistory: Loses ability to have multiple comments per transition

### Decision 2: Single User Assignment
**Decision**: Assign each client to a single user (Owner or Manager).

**Rationale:**
- Simpler data model and UI
- Clear ownership and accountability
- Easier to implement and maintain
- Can extend to multiple assignments later if needed

**Alternatives Considered:**
- Multiple assignments with roles: More flexible but adds complexity
- Team assignments: Requires team model first, defer to later

### Decision 3: Comments Required Only for Critical Transitions
**Decision**: Require comments only for critical status transitions (PROSPECT→ACTIVE, ACTIVE→INACTIVE, ACTIVE→ARCHIVED).

**Rationale:**
- Balances auditability with usability
- Non-critical transitions (e.g., ACTIVE→ACTIVE for updates) don't need justification
- Reduces friction for routine operations

**Alternatives Considered:**
- Comments required for all transitions: Too restrictive, adds friction
- No required comments: Loses audit trail for important changes

### Decision 4: Request → Approve Workflow
**Decision**: Managers create StatusChangeRequest, Owners approve/reject. Owner can change status directly without approval.

**Rationale:**
- Clear audit trail of who requested and who approved
- Prevents unauthorized status changes
- Owner retains full control
- Can track pending approvals separately

**Alternatives Considered:**
- Direct change with notification: Less structured, harder to track
- Two-step (request then execute): More complex, adds extra step

### Decision 5: Contacts Always Linked to Client
**Decision**: ContactPerson model always requires a Client. Clients must have at least one contact.

**Rationale:**
- Ensures data integrity (no orphaned contacts)
- Simplifies queries (always know which client a contact belongs to)
- Business requirement: every client needs at least one point of contact

**Alternatives Considered:**
- Contacts can exist independently: More flexible but loses relationship clarity
- Optional contacts: Business requires at least one contact per client

### Decision 6: Contracts as Optional Metadata
**Decision**: Contract model is optional - clients can exist without contracts.

**Rationale:**
- Not all clients have formal contracts initially
- Allows gradual relationship building
- Can add contracts later as relationship matures

**Alternatives Considered:**
- Contracts required: Too restrictive for prospecting phase
- No contract model: Loses ability to track agreements

### Decision 7: Status History Immutability
**Decision**: StatusHistory records are immutable - cannot be edited or deleted.

**Rationale:**
- True audit trail
- Prevents tampering with history
- Required for compliance and accountability

**Alternatives Considered:**
- Editable history: Easier to fix mistakes but loses audit integrity
- Soft delete: Adds complexity without clear benefit

### Decision 8: List UI – TanStack Table and responsive cards
**Decision**: Use @tanstack/react-table for all tabular lists (client list, contacts, contracts, approval queue). On viewports below the `md` breakpoint, show the same data as cards instead of a table; one card per row, with a label–value layout for list-style sections (e.g. contacts, contracts).

**Rationale:**
- Single source of truth: one table state (sorting, row model) drives both desktop table and mobile card list.
- Consistent UX: sortable columns on desktop; readable cards on small screens.
- Same pattern across ClientList, ContactList, ContractList (and ApprovalQueue if cards are added later).

**Implementation:**
- Column definitions and sorting live in TanStack Table; `table.getRowModel().rows` is used for both the table body and the mobile card list.
- Mobile: `md:hidden` block renders cards (e.g. label–value rows per contact/contract); desktop: `hidden md:block` wraps the table.

### Decision 9: Prisma Schema Design
**Decision**: Use Prisma 7 with explicit relations, indexes, and cascading deletes where appropriate.

**Rationale:**
- Type-safe database access
- Automatic migration generation
- Clear relationship definitions
- Performance optimization with indexes

**Key Schema Patterns:**
- Client has many ContactPerson (cascade delete)
- Client has many Contract (cascade delete)
- Client has many StatusHistory (cascade delete)
- Client has many StatusChangeRequest (cascade delete)
- Client has many Comment (cascade delete)
- Client assignedTo User (nullable, no cascade)
- StatusHistory references User (changedBy)
- StatusChangeRequest references User (requestedBy, reviewedBy)

## Risks / Trade-offs

**[Risk] Status change requests can become stale if Owner doesn't review**
→ **Mitigation**: Add UI indicators for pending requests, consider auto-expiration in future

**[Risk] Single assignment might be limiting for large teams**
→ **Mitigation**: Design schema to allow extension to multiple assignments later without breaking changes

**[Risk] Required contacts might block client creation if contact info unavailable**
→ **Mitigation**: Allow creating client with minimal contact info, require full contact details before status change to ACTIVE

**[Risk] Approval workflow adds friction for Owners**
→ **Mitigation**: Owners can change status directly without approval, only Managers need approval

**[Risk] Status history immutability makes corrections difficult**
→ **Mitigation**: Add new status change to correct errors, maintain full audit trail

**[Risk] Complex status workflow might confuse users**
→ **Mitigation**: Clear UI indicators, status transition validation, helpful error messages

**[Trade-off] Separate comment models vs. single model**
→ **Trade-off**: More tables but better type safety and validation. Chose separation for clarity.

**[Trade-off] Required comments only for critical transitions**
→ **Trade-off**: Less friction but potentially less audit detail. Chose critical-only for usability.

## Migration Plan

1. **Database Migration**
   - Create Prisma schema with all models
   - Run `npx prisma migrate dev --name add_client_management`
   - Generate Prisma Client

2. **API Implementation**
   - Implement API routes in order: CRUD → Status → Assignment → Contacts → Contracts → Comments
   - Add RBAC checks to each route
   - Add validation and error handling

3. **UI Implementation**
   - Create client list page with filters (TanStack Table; table from md up, cards on mobile)
   - Create client detail page
   - Create client form (create/edit)
   - Add status change request UI
   - Add approval queue UI (TanStack Table)
   - Add contact management UI (TanStack Table; table from md up, label–value cards on mobile)
   - Add contract management UI (TanStack Table; table from md up, label–value cards on mobile)

4. **Testing**
   - Test CRUD operations
   - Test status workflow and approval process
   - Test RBAC enforcement
   - Test assignment functionality

5. **Deployment**
   - Run migration in production
   - Deploy API and UI changes
   - Monitor for errors

**Rollback Strategy:**
- Database: Can rollback migration if needed (data loss if clients created)
- API/UI: Feature flag or route removal for quick disable

## Open Questions

1. **Notification System**: Should we implement in-app notifications for pending approvals now, or defer?
   - **Decision Needed**: Defer to keep scope manageable

2. **Contract Documents**: How should contract documents be stored initially?
   - **Decision Needed**: Store file paths/URLs initially, integrate with Google Cloud Storage later

3. **Status Transition Validation**: Should we validate that status transitions follow the workflow (e.g., can't go from PROSPECT directly to ARCHIVED)?
   - **Decision**: Yes, validate transitions server-side

4. **Bulk Operations**: Should we support bulk status changes or assignments?
   - **Decision**: Defer to later change

5. **Client Search**: How sophisticated should search be (full-text, fuzzy matching)?
   - **Decision**: Start with simple name/email search, enhance later
