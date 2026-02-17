## Context

The HR Agency CRM currently has client management functionality implemented with a comprehensive data model, CRUD operations, status workflow, and responsive UI. However, candidate management functionality is completely missing despite being mentioned in the project README as a core feature. The system needs to track job applicants, manage their progression through recruitment pipeline stages, store CVs securely, and provide visual Kanban board interface for pipeline management.

**Current State:**
- Client management fully implemented with Prisma models, API routes, and UI components
- RBAC utilities exist for client operations
- Responsive UI patterns established (cards on mobile, tables on desktop)
- Status workflow pattern exists (ClientStatus enum, StatusHistory model)
- No candidate-related models, APIs, or UI components exist
- No file storage integration exists (Google Cloud Storage mentioned but not implemented)
- No drag-and-drop functionality exists (@dnd-kit mentioned but not used)

**Constraints:**
- Must use Next.js 15 App Router patterns (Server Components, Route Handlers)
- Must follow existing Prisma schema patterns and naming conventions
- Must use existing RBAC patterns from `lib/auth.ts`
- Must match client management UI patterns for consistency
- Must use Tailwind CSS v4 and shadcn/ui components
- Must maintain responsive design (cards on mobile, tables on desktop)
- Must integrate with Google Cloud Storage for CV files
- Must use @dnd-kit for Kanban drag-and-drop functionality

**Stakeholders:**
- End users (Owners, Managers, Admins): Need efficient candidate tracking and pipeline management
- Developers: Need maintainable, consistent codebase following existing patterns

## Goals / Non-Goals

**Goals:**
- Create comprehensive candidate data model matching client management patterns
- Implement candidate CRUD operations with proper RBAC enforcement
- Build visual Kanban board for pipeline management with drag-and-drop
- Integrate secure CV/resume storage using Google Cloud Storage
- Provide responsive UI matching client management quality
- Support candidate assignment, notes, comments, and status history tracking
- Ensure consistent user experience across candidate and client management features

**Non-Goals:**
- Job/position management (prepared for future but not implemented)
- Email notifications for status changes
- Advanced analytics or reporting (basic pipeline stats only)
- CV parsing or extraction of candidate data from CVs
- Integration with external job boards or ATS systems
- Multi-file CV support (single CV per candidate)
- CV versioning/history (replace on upload)

## Decisions

### 1. Data Model: Candidate Schema Design

**Decision:** Create Candidate model with status enum, assignment fields, and related models (CandidateStatusHistory, CandidateAssignmentHistory, CandidateNote, CandidateComment) following Client model patterns.

**Rationale:**
- Matches existing Client model structure for consistency
- Status enum provides clear pipeline stages
- Assignment tracking enables responsibility management
- History models provide audit trail
- Notes and comments enable interaction tracking

**Alternatives Considered:**
- Single Candidate model without related models: Rejected - loses audit trail and interaction history
- Separate Job model with candidate-job associations: Considered but deferred - job management is future feature
- CV stored as BLOB in database: Rejected - better to use cloud storage for scalability

**Implementation:**
- Add `CandidateStatus` enum: APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED
- Create `Candidate` model with fields: id, name, email, phone, location, linkedInUrl, portfolioUrl, currentPosition, yearsOfExperience, skills (JSON), notes, status, assignedTo, cvStoragePath, cvFileName, cvFileSize, cvMimeType, createdAt, updatedAt, createdBy, updatedBy
- Create `CandidateStatusHistory` model (similar to StatusHistory)
- Create `CandidateAssignmentHistory` model (similar to ClientAssignmentHistory)
- Create `CandidateNote` and `CandidateComment` models (similar to Comment)
- Add indexes on status, assignedTo, createdBy for query performance

### 2. API Route Structure: RESTful Endpoints

**Decision:** Create RESTful API routes following existing client API patterns: `/api/candidates` (GET, POST), `/api/candidates/[id]` (GET, PATCH, DELETE), `/api/candidates/[id]/assign`, `/api/candidates/[id]/status`, `/api/candidates/[id]/cv` (POST, GET), `/api/candidates/[id]/notes`, `/api/candidates/[id]/comments`.

**Rationale:**
- Matches existing `/api/clients` route structure
- RESTful design is intuitive and maintainable
- Nested routes for related resources (notes, comments) keep organization clear
- Separate CV endpoint handles file operations distinctly

**Alternatives Considered:**
- GraphQL API: Rejected - REST is already established pattern, no need for GraphQL complexity
- Single endpoint with action parameter: Rejected - less RESTful, harder to maintain
- Separate CV service: Considered but rejected - simpler to keep in same API structure

**Implementation:**
- Use Next.js Route Handlers (app/api/candidates/route.ts)
- Implement GET with filtering (status, assignedTo, search query)
- Implement POST for candidate creation with validation
- Implement PATCH for updates with RBAC checks
- Implement DELETE with cascade handling for related records
- Use `getServerSession` for authentication
- Use RBAC utilities from `lib/auth/candidates.ts` (new file)

### 3. RBAC Implementation: Candidate Permissions

**Decision:** Create candidate-specific RBAC utilities in `lib/auth/candidates.ts` following `lib/auth/clients.ts` pattern: `canCreateCandidate`, `canUpdateCandidate`, `canDeleteCandidate`, `canAssignCandidate`, `canUpdateCandidateStatus`.

**Rationale:**
- Consistent with existing RBAC pattern
- Centralized permission logic for maintainability
- Easy to test and modify
- Clear separation of concerns

**Alternatives Considered:**
- Inline RBAC checks in components/APIs: Rejected - harder to maintain, inconsistent
- Single generic permission checker: Rejected - loses specificity and clarity

**Implementation:**
- Owner: Full access (create, read, update, delete, assign, status changes)
- Manager: Full access except delete
- Admin: Read access, can update notes/comments/status, cannot create/delete/assign or update core fields

### 4. UI Component Structure: Match Client Management Patterns

**Decision:** Create candidate components following client component patterns: `CandidateList.tsx` (responsive table/cards), `CandidateDetail.tsx`, `CandidateKanban.tsx`, `CandidateForm.tsx`, `CVUpload.tsx`.

**Rationale:**
- Consistency with existing UI patterns
- Users familiar with client management will understand candidate management
- Reusable patterns reduce development time
- Maintains visual consistency across application

**Alternatives Considered:**
- Completely new UI patterns: Rejected - inconsistent user experience
- Reuse client components with props: Considered but rejected - different data models make this complex

**Implementation:**
- Use @tanstack/react-table for table view (desktop)
- Use Card components for mobile view
- Match client list filtering and search UI
- Use same enhanced styling (rounded-2xl, shadow-xl, hover effects)
- Implement responsive breakpoints at `md` (768px)

### 5. Kanban Board Implementation: @dnd-kit Library

**Decision:** Use @dnd-kit/core and @dnd-kit/sortable for Kanban board drag-and-drop functionality.

**Rationale:**
- @dnd-kit is mentioned in project README as part of tech stack
- Modern, accessible drag-and-drop library
- Works well with React Server Components pattern
- Supports keyboard navigation for accessibility

**Alternatives Considered:**
- react-beautiful-dnd: Rejected - deprecated, @dnd-kit is recommended replacement
- Custom drag-and-drop: Rejected - reinventing wheel, accessibility concerns
- No drag-and-drop (click to change status): Considered but rejected - Kanban board is core requirement

**Implementation:**
- Create `CandidateKanban.tsx` Client Component
- Use `DndContext` from @dnd-kit/core for drag context
- Use `SortableContext` for each pipeline stage column
- Use `useSortable` hook for candidate cards
- On drag end, call API to update candidate status
- Optimistic UI updates for better UX
- Handle errors and revert on API failure

### 6. Google Cloud Storage Integration: CV File Storage

**Decision:** Use Google Cloud Storage SDK (@google-cloud/storage) for CV file upload, storage, and download with signed URLs for secure access.

**Rationale:**
- Google Cloud Storage mentioned in project README
- Scalable file storage solution
- Signed URLs provide secure access without public URLs
- Separates file storage from database

**Alternatives Considered:**
- Local file storage: Rejected - doesn't scale, deployment complexity
- AWS S3: Considered but rejected - README specifies Google Cloud Storage
- Database BLOB storage: Rejected - poor performance, database bloat

**Implementation:**
- Install `@google-cloud/storage` package
- Create storage utility in `lib/storage.ts` for initialization and operations
- Store files at path: `candidates/{candidateId}/cv/{timestamp}-{filename}`
- Generate signed URLs for downloads (expires in 1 hour)
- Handle file upload via multipart/form-data in API route
- Validate file type (PDF, DOC, DOCX) and size (max 10MB)
- Store metadata (filename, size, mimeType, storagePath) in Candidate model
- Delete old file when replacing CV

### 7. Status Transition Rules: Pipeline Workflow

**Decision:** Implement forward-only pipeline transitions (APPLIED → SCREENING → INTERVIEW → OFFER → HIRED) with REJECTED allowed from any stage. Prevent backward transitions and transitions from HIRED.

**Rationale:**
- Matches typical recruitment pipeline flow
- Prevents data inconsistencies
- Clear progression path for candidates
- REJECTED is terminal state (cannot return to pipeline)

**Alternatives Considered:**
- Allow backward transitions: Rejected - doesn't match real recruitment workflow
- Allow transitions from HIRED: Rejected - hired candidates shouldn't move back
- More granular stages: Considered but rejected - current stages cover typical workflow

**Implementation:**
- Validate transitions in API route before updating status
- Return error for invalid transitions
- Create CandidateStatusHistory record on valid transition
- Update candidate status atomically with history record

### 8. Responsive Design: Cards on Mobile, Table on Desktop

**Decision:** Use same responsive pattern as ClientList: cards on viewports below `md` (768px), table on `md` and above.

**Rationale:**
- Consistency with existing UI patterns
- Proven pattern that works well
- Mobile-first approach improves UX
- Matches user expectations from client management

**Alternatives Considered:**
- Always use cards: Rejected - tables better for desktop with many columns
- Always use table: Rejected - poor mobile UX
- Different breakpoint: Considered but rejected - `md` (768px) is standard and matches existing code

**Implementation:**
- Use Tailwind `md:` breakpoint utilities
- Hide table on mobile (`hidden md:block`)
- Show cards on mobile (`md:hidden`)
- Same data, different presentation

## Risks / Trade-offs

### [Risk] Google Cloud Storage Setup Complexity
**Mitigation:** Provide clear setup instructions in migration plan. Use environment variables for configuration. Handle initialization errors gracefully with helpful error messages.

### [Risk] File Upload Security
**Mitigation:** Validate file types and sizes server-side. Use signed URLs for downloads. Store files with private access. Sanitize filenames to prevent path traversal.

### [Risk] Drag-and-Drop Performance with Many Candidates
**Mitigation:** Implement pagination or virtual scrolling for Kanban board if needed. Load candidates per stage on demand. Optimize API calls for status updates.

### [Risk] Status Transition Race Conditions
**Mitigation:** Use database transactions for status updates. Validate current status before transition. Return clear error messages for conflicts.

### [Risk] CV File Storage Costs
**Trade-off:** Cloud storage costs scale with usage. **Decision:** Accept costs for scalability benefits. Monitor usage and implement cleanup for deleted candidates.

### [Risk] Kanban Board Accessibility
**Mitigation:** Ensure @dnd-kit keyboard navigation works. Provide alternative status change method (dropdown/button). Test with screen readers.

### [Trade-off] Job Associations Now vs. Later
**Trade-off:** Adding job associations now vs. preparing schema for future. **Decision:** Add optional `jobId` field to Candidate model for future use, but don't implement job management yet.

## Migration Plan

### Phase 1: Database Schema
1. Add `CandidateStatus` enum to Prisma schema
2. Create `Candidate` model with all fields and relations
3. Create `CandidateStatusHistory` model
4. Create `CandidateAssignmentHistory` model
5. Create `CandidateNote` and `CandidateComment` models
6. Add indexes for performance
7. Run Prisma migration: `npx prisma migrate dev --name add_candidates`
8. Update Prisma client: `npx prisma generate`

### Phase 2: RBAC Utilities
1. Create `lib/auth/candidates.ts` with permission functions
2. Export functions from `lib/auth.ts`
3. Test permission logic

### Phase 3: Google Cloud Storage Setup
1. Install `@google-cloud/storage` package
2. Create `lib/storage.ts` utility for GCS operations
3. Add environment variables: `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_STORAGE_BUCKET`, `GOOGLE_APPLICATION_CREDENTIALS`
4. Test storage initialization and basic operations

### Phase 4: API Routes
1. Create `/api/candidates/route.ts` (GET, POST)
2. Create `/api/candidates/[id]/route.ts` (GET, PATCH, DELETE)
3. Create `/api/candidates/[id]/assign/route.ts` (POST)
4. Create `/api/candidates/[id]/status/route.ts` (PATCH)
5. Create `/api/candidates/[id]/cv/route.ts` (POST, GET)
6. Create `/api/candidates/[id]/notes/route.ts` (POST, GET)
7. Create `/api/candidates/[id]/comments/route.ts` (POST, GET)
8. Test all endpoints with proper RBAC

### Phase 5: UI Components
1. Create `components/candidates/CandidateList.tsx` (responsive table/cards)
2. Create `components/candidates/CandidateDetail.tsx`
3. Create `components/candidates/CandidateForm.tsx`
4. Create `components/candidates/CVUpload.tsx`
5. Create `components/candidates/CandidateKanban.tsx` with @dnd-kit
6. Test responsive behavior and interactions

### Phase 6: Pages
1. Create `app/candidates/page.tsx` (list view)
2. Create `app/candidates/[id]/page.tsx` (detail view)
3. Create `app/candidates/kanban/page.tsx` (Kanban board view)
4. Add route protection and RBAC checks

### Phase 7: Navigation Integration
1. Update `lib/menu-config.ts` to add Candidates menu item
2. Update `components/layout/Sidebar.tsx` to display Candidates menu
3. Test role-based menu visibility

### Phase 8: Testing and Refinement
1. Test all CRUD operations
2. Test status transitions and validation
3. Test CV upload/download
4. Test Kanban drag-and-drop
5. Test RBAC enforcement
6. Test responsive design
7. Performance testing with large datasets

### Rollback Strategy
- Database migrations can be rolled back: `npx prisma migrate reset` (destructive) or create new migration to remove models
- API routes can be removed without affecting existing functionality
- UI components are isolated and can be removed
- Google Cloud Storage files can be archived but not automatically deleted on rollback

## Open Questions

1. **CV File Size Limit:** Should 10MB be the maximum, or should it be configurable? (Recommendation: Start with 10MB, make configurable if needed)

2. **CV History:** Should we maintain history of replaced CVs, or just replace? (Recommendation: Replace for MVP, add history later if needed)

3. **Kanban Board Pagination:** How many candidates per stage before pagination/virtual scrolling? (Recommendation: Start without pagination, add if performance issues)

4. **Status Transition Comments:** Should comments be required for all transitions or only specific ones? (Recommendation: Optional for all transitions, can add requirement later)

5. **Candidate-Job Association:** Should we implement basic job model now or wait? (Recommendation: Add optional `jobId` field to Candidate, implement job management in separate change)

6. **Email Notifications:** Should status changes trigger email notifications? (Recommendation: Out of scope for MVP, add later if needed)

7. **Search Scope:** Should search include CV content or just metadata? (Recommendation: Metadata only for MVP, CV parsing is complex feature)

8. **Assignment Defaults:** Should new candidates auto-assign to creator or remain unassigned? (Recommendation: Auto-assign to creator, matches client pattern)
