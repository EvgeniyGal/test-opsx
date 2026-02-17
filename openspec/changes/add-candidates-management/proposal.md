## Why

The HR Agency CRM currently lacks candidate management functionality, despite being mentioned in the project README as a core feature. The system needs to track job applicants, manage their pipeline status through a visual Kanban board, store CVs securely, and associate candidates with job positions. This functionality is essential for HR agencies to effectively manage the recruitment process from initial application through placement.

## What Changes

- **Create candidate data model** in Prisma schema with fields for personal information, contact details, status, CV storage, and job associations
- **Implement candidate CRUD operations** with API endpoints for creating, reading, updating, and deleting candidates
- **Build candidate pipeline workflow** with status stages (e.g., Applied, Screening, Interview, Offer, Hired, Rejected) similar to client status workflow
- **Create candidate listing page** with filtering, search, and responsive card/table views matching the client management UI patterns
- **Implement candidate detail page** showing full candidate information, CV, status history, notes, and job associations
- **Add CV/resume upload and storage** using Google Cloud Storage with secure file handling and metadata tracking
- **Build Kanban board view** for visual pipeline management with drag-and-drop status updates using @dnd-kit
- **Implement role-based access control** for candidate operations (Owner/Manager can manage, Admin can view/edit with limitations)
- **Add candidate assignment** to track which recruiter/manager is responsible for each candidate
- **Create candidate notes and comments** system for tracking interactions and feedback
- **Add candidate-job associations** to link candidates to specific job positions (if job management exists) or prepare for future job management feature

## Capabilities

### New Capabilities
- `candidate-management`: Core candidate CRUD operations, listing, filtering, search, detail view, assignment, and status workflow management. Includes responsive UI matching client management patterns.
- `candidate-pipeline`: Visual Kanban board interface for managing candidate pipeline stages with drag-and-drop status updates. Includes pipeline configuration and status transition rules.
- `candidate-document-storage`: Secure CV/resume upload, storage in Google Cloud Storage, file metadata tracking, download functionality, and file management.

### Modified Capabilities
- `navigation-layout`: Add "Candidates" menu item to sidebar navigation for authenticated users with appropriate role-based visibility.

## Impact

**Affected Code:**
- `prisma/schema.prisma` - Add Candidate model, CandidateStatus enum, CandidateAssignmentHistory model, CandidateNote/Comment models, CV storage fields
- `app/api/candidates/` - New API routes for candidate CRUD operations
- `app/api/candidates/[id]/cv/` - CV upload/download endpoints
- `app/candidates/` - New pages for candidate listing and detail views
- `components/candidates/` - Candidate list, detail, Kanban board, CV upload components
- `lib/auth.ts` - Add RBAC utilities for candidate operations (canCreateCandidate, canUpdateCandidate, etc.)
- `components/layout/Sidebar.tsx` - Add Candidates menu item
- `lib/menu-config.ts` - Add Candidates menu configuration

**Dependencies:**
- Google Cloud Storage SDK for CV file storage
- @dnd-kit/core and @dnd-kit/sortable for Kanban drag-and-drop functionality
- Existing Tailwind CSS v4 and shadcn/ui components for UI consistency

**Systems:**
- Database: New Candidate table and related tables (CandidateAssignmentHistory, CandidateNote, CandidateComment)
- Storage: Google Cloud Storage bucket for CV/resume files
- Environment variables: Google Cloud Storage credentials and bucket configuration

**Breaking Changes:**
- None (new feature, no existing functionality affected)
