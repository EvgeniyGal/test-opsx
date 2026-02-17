# Tasks

## 1. Database Schema

- [x] 1.1 Add `CandidateStatus` enum to Prisma schema (APPLIED, SCREENING, INTERVIEW, OFFER, HIRED, REJECTED)
- [x] 1.2 Create `Candidate` model with all fields (id, name, email, phone, location, linkedInUrl, portfolioUrl, currentPosition, yearsOfExperience, skills, notes, status, assignedTo, cvStoragePath, cvFileName, cvFileSize, cvMimeType, createdAt, updatedAt, createdBy, updatedBy)
- [x] 1.3 Add relations to Candidate model (assignedUser, createdByUser, updatedByUser, statusHistory, assignmentHistory, notes, comments)
- [x] 1.4 Create `CandidateStatusHistory` model with fields (id, candidateId, fromStatus, toStatus, comment, changedAt, changedBy)
- [x] 1.5 Create `CandidateAssignmentHistory` model with fields (id, candidateId, assignedTo, assignedBy, assignedAt)
- [x] 1.6 Create `CandidateNote` model with fields (id, candidateId, content, createdBy, createdAt)
- [x] 1.7 Create `CandidateComment` model with fields (id, candidateId, content, createdBy, createdAt)
- [x] 1.8 Add indexes on Candidate model (status, assignedTo, createdBy) for query performance
- [x] 1.9 Add relations to User model for candidate-related operations
- [x] 1.10 Run Prisma migration: `npx prisma migrate dev --name add_candidates`
- [x] 1.11 Update Prisma client: `npx prisma generate`
- [x] 1.12 Verify migration and schema changes

## 2. RBAC Utilities

- [x] 2.1 Create `lib/auth/candidates.ts` file
- [x] 2.2 Implement `canCreateCandidate(role)` function (Owner, Manager can create)
- [x] 2.3 Implement `canUpdateCandidate(userRole, targetCandidate)` function (Owner/Manager full update, Admin limited update)
- [x] 2.4 Implement `canDeleteCandidate(role)` function (Owner, Manager can delete)
- [x] 2.5 Implement `canAssignCandidate(role)` function (Owner, Manager can assign)
- [x] 2.6 Implement `canUpdateCandidateStatus(role)` function (all authenticated users can update status)
- [x] 2.7 Export all functions from `lib/auth/candidates.ts`
- [x] 2.8 Update `lib/auth.ts` to export candidate RBAC functions
- [x] 2.9 Test permission logic with different roles

## 3. Google Cloud Storage Setup

- [x] 3.1 Install `@google-cloud/storage` package
- [x] 3.2 Create `lib/storage.ts` utility file
- [x] 3.3 Implement storage client initialization function
- [x] 3.4 Implement `uploadCV(candidateId, file)` function for CV upload
- [x] 3.5 Implement `getCVSignedUrl(storagePath)` function for secure download
- [x] 3.6 Implement `deleteCV(storagePath)` function for CV deletion
- [x] 3.7 Add error handling for storage operations
- [x] 3.8 Add environment variables documentation: `GOOGLE_CLOUD_PROJECT_ID`, `GOOGLE_CLOUD_STORAGE_BUCKET`, `GOOGLE_APPLICATION_CREDENTIALS`
- [x] 3.9 Test storage initialization and basic operations

## 4. API Routes - Core CRUD

- [x] 4.1 Create `app/api/candidates/route.ts` for GET (list with filtering) and POST (create)
- [x] 4.2 Implement GET endpoint with filtering (status, assignedTo, search query) and pagination
- [x] 4.3 Implement POST endpoint with validation (name, email required) and RBAC check
- [x] 4.4 Create `app/api/candidates/[id]/route.ts` for GET (detail), PATCH (update), DELETE
- [x] 4.5 Implement GET [id] endpoint with all relations (statusHistory, assignmentHistory, notes, comments, assignedUser)
- [x] 4.6 Implement PATCH [id] endpoint with RBAC check and validation
- [x] 4.7 Implement DELETE [id] endpoint with RBAC check and cascade deletion
- [x] 4.8 Add error handling and proper HTTP status codes to all endpoints
- [x] 4.9 Test all CRUD endpoints with proper RBAC

## 5. API Routes - Assignment and Status

- [x] 5.1 Create `app/api/candidates/[id]/assign/route.ts` for POST (assign candidate)
- [x] 5.2 Implement assignment endpoint with RBAC check and assignment history creation
- [x] 5.3 Create `app/api/candidates/[id]/status/route.ts` for PATCH (update status)
- [x] 5.4 Implement status transition validation (forward-only, prevent backward transitions)
- [x] 5.5 Implement status update with CandidateStatusHistory record creation
- [x] 5.6 Add transaction handling for status updates to prevent race conditions
- [x] 5.7 Test assignment and status endpoints with RBAC

## 6. API Routes - CV Management

- [x] 6.1 Create `app/api/candidates/[id]/cv/route.ts` for POST (upload) and GET (download)
- [x] 6.2 Implement POST CV upload endpoint with file validation (type: PDF/DOC/DOCX, size: max 10MB)
- [x] 6.3 Implement CV upload with Google Cloud Storage integration
- [x] 6.4 Implement CV metadata storage in Candidate model (cvStoragePath, cvFileName, cvFileSize, cvMimeType)
- [x] 6.5 Implement old CV deletion when replacing CV
- [x] 6.6 Implement GET CV download endpoint with signed URL generation
- [x] 6.7 Add RBAC check for CV download (authenticated users with candidate access)
- [x] 6.8 Test CV upload and download endpoints

## 7. API Routes - Notes and Comments

- [x] 7.1 Create `app/api/candidates/[id]/notes/route.ts` for POST (create) and GET (list)
- [x] 7.2 Implement POST notes endpoint with authentication check
- [x] 7.3 Implement GET notes endpoint to retrieve all notes for candidate
- [x] 7.4 Create `app/api/candidates/[id]/comments/route.ts` for POST (create) and GET (list)
- [x] 7.5 Implement POST comments endpoint with authentication check
- [x] 7.6 Implement GET comments endpoint to retrieve all comments for candidate
- [x] 7.7 Test notes and comments endpoints

## 8. UI Components - Candidate List

- [x] 8.1 Create `components/candidates/CandidateList.tsx` component
- [x] 8.2 Implement responsive table view for desktop (md and up) using @tanstack/react-table
- [x] 8.3 Implement responsive card view for mobile (below md) matching ClientList pattern
- [x] 8.4 Add filtering UI (status, assignedTo dropdowns)
- [x] 8.5 Add search input with enhanced styling (`border-2 focus:border-primary transition-colors`)
- [x] 8.6 Add pagination controls
- [x] 8.7 Add "New Candidate" button with RBAC check
- [x] 8.8 Ensure cards use enhanced styling (`rounded-2xl shadow-xl hover:shadow-2xl transition-shadow`)
- [x] 8.9 Test responsive behavior and interactions

## 9. UI Components - Candidate Detail

- [x] 9.1 Create `components/candidates/CandidateDetail.tsx` component
- [x] 9.2 Display candidate basic information (name, email, phone, location, etc.)
- [x] 9.3 Display candidate status with status badge
- [x] 9.4 Display assigned user information
- [x] 9.5 Display CV download link/button if CV exists
- [x] 9.6 Display status history timeline
- [x] 9.7 Display notes and comments timeline
- [x] 9.8 Add edit button with RBAC check
- [x] 9.9 Add assignment dropdown with RBAC check
- [x] 9.10 Ensure detail page uses gradient background (`bg-gradient-to-br from-gray-50 to-gray-100`)
- [x] 9.11 Ensure cards use enhanced styling (`rounded-2xl shadow-xl hover:shadow-2xl`)

## 10. UI Components - Candidate Form

- [x] 10.1 Create `components/candidates/CandidateForm.tsx` component
- [x] 10.2 Add form fields: name, email, phone, location, linkedInUrl, portfolioUrl, currentPosition, yearsOfExperience, skills, notes
- [x] 10.3 Add form validation (name and email required)
- [x] 10.4 Add form submission handler with API call
- [x] 10.5 Add error handling and loading states
- [x] 10.6 Ensure inputs use enhanced styling (`border-2 focus:border-primary transition-colors`)
- [x] 10.7 Test form validation and submission

## 11. UI Components - CV Upload

- [x] 11.1 Create `components/candidates/CVUpload.tsx` component
- [x] 11.2 Add file input with accept attribute (PDF, DOC, DOCX)
- [x] 11.3 Add file size validation (max 10MB) client-side
- [x] 11.4 Add file upload handler with multipart/form-data
- [x] 11.5 Add upload progress indicator
- [x] 11.6 Add error handling for upload failures
- [x] 11.7 Add replace CV functionality (delete old, upload new)
- [x] 11.8 Test CV upload component

## 12. UI Components - Kanban Board

- [x] 12.1 Install `@dnd-kit/core` and `@dnd-kit/sortable` packages
- [x] 12.2 Create `components/candidates/CandidateKanban.tsx` Client Component
- [x] 12.3 Implement Kanban board layout with columns for each pipeline stage
- [x] 12.4 Use `DndContext` from @dnd-kit/core for drag context
- [x] 12.5 Use `SortableContext` for each pipeline stage column
- [x] 12.6 Use `useSortable` hook for candidate cards
- [x] 12.7 Implement drag end handler to call status update API
- [x] 12.8 Add optimistic UI updates for better UX
- [x] 12.9 Add error handling and revert on API failure
- [x] 12.10 Add stage count badges in column headers
- [x] 12.11 Ensure candidate cards use enhanced styling (`rounded-2xl shadow-xl`)
- [x] 12.12 Test drag-and-drop functionality and keyboard navigation

## 13. Pages - Candidate List

- [x] 13.1 Create `app/candidates/page.tsx` Server Component
- [x] 13.2 Add authentication check and redirect if not authenticated
- [x] 13.3 Integrate CandidateList component
- [x] 13.4 Add page title and description
- [x] 13.5 Ensure page uses gradient background (`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800`)
- [x] 13.6 Test page rendering and navigation

## 14. Pages - Candidate Detail

- [x] 14.1 Create `app/candidates/[id]/page.tsx` Server Component
- [x] 14.2 Add authentication check and redirect if not authenticated
- [x] 14.3 Fetch candidate data with all relations
- [x] 14.4 Handle candidate not found (404)
- [x] 14.5 Integrate CandidateDetail component
- [x] 14.6 Ensure page uses gradient background
- [x] 14.7 Test page rendering and candidate data display

## 15. Pages - Kanban Board

- [x] 15.1 Create `app/candidates/kanban/page.tsx` Server Component
- [x] 15.2 Add authentication check and redirect if not authenticated
- [x] 15.3 Fetch all candidates grouped by status
- [x] 15.4 Integrate CandidateKanban component
- [x] 15.5 Add page title and description
- [x] 15.6 Ensure page uses gradient background
- [x] 15.7 Test Kanban board page rendering

## 16. Navigation Integration

- [x] 16.1 Update `lib/menu-config.ts` to add Candidates menu item with href `/candidates`
- [x] 16.2 Add role-based visibility for Candidates menu (Owner, Manager, Admin can see)
- [x] 16.3 Update `components/layout/Sidebar.tsx` to display Candidates menu item
- [x] 16.4 Test role-based menu visibility (Owner sees all, Manager sees Candidates, Admin sees Candidates)
- [x] 16.5 Test active route highlighting for Candidates menu item

## 17. Testing and Refinement

- [ ] 17.1 Test all CRUD operations (create, read, update, delete candidates)
- [ ] 17.2 Test status transitions and validation (forward-only, prevent backward)
- [ ] 17.3 Test CV upload with valid files (PDF, DOC, DOCX)
- [ ] 17.4 Test CV upload with invalid files (wrong type, oversized)
- [ ] 17.5 Test CV download with signed URLs
- [ ] 17.6 Test Kanban drag-and-drop status updates
- [ ] 17.7 Test RBAC enforcement (Owner, Manager, Admin permissions)
- [ ] 17.8 Test responsive design (mobile cards, desktop table)
- [ ] 17.9 Test candidate assignment functionality
- [ ] 17.10 Test notes and comments creation and display
- [ ] 17.11 Test status history tracking
- [ ] 17.12 Performance testing with large datasets (if applicable)
- [ ] 17.13 Accessibility testing (keyboard navigation, screen readers)
