## Why

The CRM currently has no way to track client companies that hire through the agency. We need a comprehensive client management system to track partnerships, manage relationships, and organize client information. This is foundational for Job Management (jobs belong to clients) and the Candidate Pipeline (candidates are linked to jobs at specific clients). Without client management, we cannot effectively organize recruitment activities or track business relationships.

## What Changes

- **Client Model**: Create Prisma Client model with company information (name, industry, website, tax ID, logo)
- **Client Status Workflow**: Implement status lifecycle (PROSPECT → ACTIVE → INACTIVE → ARCHIVED) with status history tracking
- **Status Comments**: Separate StatusComment model for workflow transition comments (required for critical transitions)
- **General Comments**: Separate Comment model for general timeline notes and discussions
- **Contact Management**: Create ContactPerson model for client contacts (always linked to Client, at least one required)
- **Contract Management**: Optional Contract model for tracking agreements, terms, and documents
- **Assignment System**: Single-user assignment model (assign Clients to Owners/Managers)
- **Approval Workflow**: StatusChangeRequest model for Manager-initiated status changes requiring Owner approval
- **Client CRUD API**: RESTful API endpoints for creating, reading, updating, and listing clients
- **Client Management UI**: Admin interface for viewing, creating, editing clients with filters and search
- **Status Change UI**: Interface for requesting and approving status changes
- **Contact Management UI**: Interface for managing client contacts (add, edit, set primary)
- **Contract Management UI**: Interface for viewing and managing optional contracts
- **RBAC Enforcement**: Role-based access control (Owner: full access, Manager: create/edit/assign with approval, Admin: view only)
- **Integration Points**: Design for future integration with Job Management and Candidate Pipeline

## Capabilities

### New Capabilities

- `client-management`: Complete client lifecycle management including company information, status workflows, contacts, contracts, assignments, and approval processes

### Modified Capabilities

<!-- No existing capabilities to modify -->

## Impact

- **Database**: New Prisma models (Client, ContactPerson, Contract, StatusChangeRequest, StatusComment, Comment, ClientAssignmentHistory)
- **Dependencies**: No new external dependencies required
- **New API Routes**:
  - `GET /api/clients` - List clients with filters (status, assignedTo, search)
  - `POST /api/clients` - Create new client (Owner/Manager only)
  - `GET /api/clients/[id]` - Get client details
  - `PATCH /api/clients/[id]` - Update client (Owner/Manager only)
  - `DELETE /api/clients/[id]` - Archive client (Owner only)
  - `POST /api/clients/[id]/status/request` - Request status change (Manager)
  - `POST /api/clients/[id]/status/approve` - Approve status change (Owner)
  - `POST /api/clients/[id]/status/reject` - Reject status change (Owner)
  - `POST /api/clients/[id]/assign` - Assign client to user (Owner/Manager)
  - `GET /api/clients/[id]/contacts` - List client contacts
  - `POST /api/clients/[id]/contacts` - Add contact (Owner/Manager)
  - `PATCH /api/clients/[id]/contacts/[contactId]` - Update contact (Owner/Manager)
  - `DELETE /api/clients/[id]/contacts/[contactId]` - Remove contact (Owner/Manager)
  - `GET /api/clients/[id]/contracts` - List client contracts
  - `POST /api/clients/[id]/contracts` - Add contract (Owner/Manager)
  - `GET /api/clients/[id]/comments` - List comments
  - `POST /api/clients/[id]/comments` - Add comment (authenticated users)
  - `GET /api/clients/[id]/status-history` - Get status change history
- **New Routes**:
  - `/clients` - Client list page (protected, Owner/Manager/Admin)
  - `/clients/new` - Create client page (protected, Owner/Manager)
  - `/clients/[id]` - Client detail page (protected, Owner/Manager/Admin)
  - `/clients/[id]/edit` - Edit client page (protected, Owner/Manager)
  - `/admin/approvals` - Approval queue page (protected, Owner)
- **New Components**: ClientList, ClientForm, ClientDetail, ContactList, ContactForm, ContractList, ContractForm, StatusChangeRequest, ApprovalQueue, CommentTimeline
- **Middleware**: Extend route protection for client management routes
- **RBAC Utilities**: Extend `lib/auth.ts` with client-specific permission checks
- **Type Definitions**: TypeScript types for Client, ContactPerson, Contract, StatusChangeRequest, ClientStatus enum
