## 1. Database Schema

- [x] 1.1 Define ClientStatus enum (PROSPECT, ACTIVE, INACTIVE, ARCHIVED) in Prisma schema
- [x] 1.2 Define ContractType enum (RETAINER, PROJECT_BASED, HOURLY, etc.) in Prisma schema
- [x] 1.3 Create Client model with fields: id, name, industry, website, taxId, registrationNumber, logo, status, assignedTo, createdAt, updatedAt, createdBy, updatedBy
- [x] 1.4 Create ContactPerson model with fields: id, clientId, name, email, phone, role, isPrimary, notes, createdAt, updatedAt
- [x] 1.5 Create Contract model with fields: id, clientId, type, startDate, endDate, terms, paymentTerms, documentPath, status, createdAt, updatedAt, createdBy, updatedBy
- [x] 1.6 Create StatusHistory model with fields: id, clientId, fromStatus, toStatus, comment, changedAt, changedBy
- [x] 1.7 Create StatusChangeRequest model with fields: id, clientId, fromStatus, toStatus, comment, status (PENDING/APPROVED/REJECTED), requestedBy, requestedAt, reviewedBy, reviewedAt, reviewComment
- [x] 1.8 Create StatusComment model with fields: id, statusHistoryId, content, createdBy, createdAt
- [x] 1.9 Create Comment model with fields: id, clientId, content, createdBy, createdAt
- [x] 1.10 Create ClientAssignmentHistory model with fields: id, clientId, assignedTo, assignedBy, assignedAt
- [x] 1.11 Add indexes: Client(status), Client(assignedTo), ContactPerson(clientId), StatusHistory(clientId), StatusChangeRequest(clientId, status)
- [x] 1.12 Add foreign key relations: Client.assignedTo → User, ContactPerson.clientId → Client, Contract.clientId → Client, StatusHistory.clientId → Client, StatusHistory.changedBy → User, StatusChangeRequest.clientId → Client, StatusChangeRequest.requestedBy → User, StatusChangeRequest.reviewedBy → User, StatusComment.statusHistoryId → StatusHistory, Comment.clientId → Client, Comment.createdBy → User, ClientAssignmentHistory.clientId → Client, ClientAssignmentHistory.assignedTo → User, ClientAssignmentHistory.assignedBy → User
- [x] 1.13 Configure cascade deletes: ContactPerson, Contract, StatusHistory, StatusChangeRequest, StatusComment, Comment, ClientAssignmentHistory
- [x] 1.14 Run migration: `npx prisma migrate dev --name add_client_management`
- [x] 1.15 Generate Prisma Client: `npx prisma generate`

## 2. RBAC Utilities

- [x] 2.1 Create `lib/auth/clients.ts` with canCreateClient function
- [x] 2.2 Create canUpdateClient function (Owner or Manager)
- [x] 2.3 Create canDeleteClient function (Owner only)
- [x] 2.4 Create canAssignClient function (Owner or Manager)
- [x] 2.5 Create canApproveStatusChange function (Owner only)
- [x] 2.6 Create canRequestStatusChange function (Manager only)
- [x] 2.7 Create canManageContacts function (Owner or Manager)
- [x] 2.8 Create canManageContracts function (Owner or Manager)
- [x] 2.9 Export all functions from `lib/auth.ts`

## 3. Client CRUD API

- [x] 3.1 Create `app/api/clients/route.ts` GET endpoint
- [x] 3.2 Implement authentication check
- [x] 3.3 Implement filtering by status, assignedTo, search query
- [x] 3.4 Implement pagination
- [x] 3.5 Return client list with assigned user and primary contact info
- [x] 3.6 Create `app/api/clients/route.ts` POST endpoint
- [x] 3.7 Validate required fields (name, at least one contact)
- [x] 3.8 Check RBAC (Owner or Manager)
- [x] 3.9 Create client with PROSPECT status
- [x] 3.10 Assign client to creator by default
- [x] 3.11 Create initial StatusHistory record
- [x] 3.12 Create `app/api/clients/[id]/route.ts` GET endpoint
- [x] 3.13 Return client with contacts, contracts, comments, status history
- [x] 3.14 Check RBAC (authenticated users can view)
- [x] 3.15 Create `app/api/clients/[id]/route.ts` PATCH endpoint
- [x] 3.16 Validate data
- [x] 3.17 Check RBAC (Owner or Manager)
- [x] 3.18 Update client record
- [x] 3.19 Record updatedBy and updatedAt
- [x] 3.20 Create `app/api/clients/[id]/route.ts` DELETE endpoint
- [x] 3.21 Check RBAC (Owner only)
- [x] 3.22 Update client status to ARCHIVED (soft delete)
- [x] 3.23 Create StatusHistory record

## 4. Status Workflow API

- [x] 4.1 Create `app/api/clients/[id]/status/request/route.ts` POST endpoint
- [x] 4.2 Check RBAC (Manager only)
- [x] 4.3 Validate status transition is allowed
- [x] 4.4 Require comment for critical transitions
- [x] 4.5 Create StatusChangeRequest with PENDING status
- [x] 4.6 Return created request
- [x] 4.7 Create `app/api/clients/[id]/status/approve/route.ts` POST endpoint
- [x] 4.8 Check RBAC (Owner only)
- [x] 4.9 Validate request exists and is PENDING
- [x] 4.10 Update StatusChangeRequest to APPROVED
- [x] 4.11 Update client status
- [x] 4.12 Create StatusHistory record
- [x] 4.13 Create `app/api/clients/[id]/status/reject/route.ts` POST endpoint
- [x] 4.14 Check RBAC (Owner only)
- [x] 4.15 Validate request exists and is PENDING
- [x] 4.16 Update StatusChangeRequest to REJECTED
- [x] 4.17 Record reviewComment if provided
- [x] 4.18 Create `app/api/clients/[id]/status/direct/route.ts` POST endpoint (Owner direct change)
- [x] 4.19 Check RBAC (Owner only)
- [x] 4.20 Validate status transition
- [x] 4.21 Require comment for critical transitions
- [x] 4.22 Update client status directly
- [x] 4.23 Create StatusHistory record
- [x] 4.24 Create `app/api/clients/[id]/status-history/route.ts` GET endpoint
- [x] 4.25 Return status history with comments and user info

## 5. Assignment API

- [x] 5.1 Create `app/api/clients/[id]/assign/route.ts` POST endpoint
- [x] 5.2 Check RBAC (Owner or Manager)
- [x] 5.3 Validate assignedTo user is Owner or Manager
- [x] 5.4 Update client assignedTo field
- [x] 5.5 Create ClientAssignmentHistory record
- [x] 5.6 Return updated client

## 6. Contact Management API

- [x] 6.1 Create `app/api/clients/[id]/contacts/route.ts` GET endpoint
- [x] 6.2 Return all contacts for client
- [x] 6.3 Create `app/api/clients/[id]/contacts/route.ts` POST endpoint
- [x] 6.4 Check RBAC (Owner or Manager)
- [x] 6.5 Validate contact data (name, email, phone)
- [x] 6.6 Create ContactPerson linked to client
- [x] 6.7 Handle isPrimary flag (set others to false)
- [x] 6.8 Create `app/api/clients/[id]/contacts/[contactId]/route.ts` PATCH endpoint
- [x] 6.9 Check RBAC (Owner or Manager)
- [x] 6.10 Validate data
- [x] 6.11 Update ContactPerson record
- [x] 6.12 Handle isPrimary flag update
- [x] 6.13 Create `app/api/clients/[id]/contacts/[contactId]/route.ts` DELETE endpoint
- [x] 6.14 Check RBAC (Owner or Manager)
- [x] 6.15 Validate client has at least one remaining contact
- [x] 6.16 Delete ContactPerson if validation passes

## 7. Contract Management API

- [x] 7.1 Create `app/api/clients/[id]/contracts/route.ts` GET endpoint
- [x] 7.2 Return all contracts for client
- [x] 7.3 Create `app/api/clients/[id]/contracts/route.ts` POST endpoint
- [x] 7.4 Check RBAC (Owner or Manager)
- [x] 7.5 Validate contract data
- [x] 7.6 Create Contract linked to client
- [x] 7.7 Create `app/api/clients/[id]/contracts/[contractId]/route.ts` PATCH endpoint
- [x] 7.8 Check RBAC (Owner or Manager)
- [x] 7.9 Validate data
- [x] 7.10 Update Contract record

## 8. Comments API

- [x] 8.1 Create `app/api/clients/[id]/comments/route.ts` GET endpoint
- [x] 8.2 Return all comments and status comments in chronological order
- [x] 8.3 Create `app/api/clients/[id]/comments/route.ts` POST endpoint
- [x] 8.4 Check authentication (any authenticated user)
- [x] 8.5 Validate comment content
- [x] 8.6 Create Comment record linked to client
- [x] 8.7 Return created comment

## 9. Approval Queue API

- [x] 9.1 Create `app/api/admin/approvals/route.ts` GET endpoint
- [x] 9.2 Check RBAC (Owner only)
- [x] 9.3 Return all pending StatusChangeRequests
- [x] 9.4 Include client info, requester info, and request details
- [x] 9.5 Sort by requestedAt (oldest first)

## 10. Type Definitions

- [x] 10.1 Create `types/client.ts` with Client type
- [x] 10.2 Create ContactPerson type
- [x] 10.3 Create Contract type
- [x] 10.4 Create StatusChangeRequest type
- [x] 10.5 Create StatusHistory type
- [x] 10.6 Create Comment types (StatusComment and Comment)
- [x] 10.7 Export ClientStatus enum type

## 11. Client List UI Components

- [x] 11.1 Create `components/clients/ClientList.tsx` component
- [x] 11.2 Install shadcn/ui table component if not already installed
- [x] 11.3 Display client table with columns: name, status, assignedTo, primary contact, last updated (use @tanstack/react-table; table from md up, cards below md)
- [x] 11.4 Add status filter dropdown
- [x] 11.5 Add assignedTo filter dropdown
- [x] 11.6 Add search input for name/email
- [x] 11.7 Implement pagination
- [x] 11.8 Add loading and error states
- [x] 11.9 Add "New Client" button (Owner/Manager only)
- [x] 11.10 Make rows clickable to navigate to detail page

## 12. Client Form Components

- [x] 12.1 Create `components/clients/ClientForm.tsx` component
- [x] 12.2 Install shadcn/ui form components if not already installed
- [x] 12.3 Create form fields: name (required), industry, website, taxId, registrationNumber, logo
- [x] 12.4 Add contact management section (add/edit/remove contacts)
- [x] 12.5 Validate at least one contact is required
- [x] 12.6 Add form validation and error handling
- [x] 12.7 Add loading states during submission
- [x] 12.8 Support both create and edit modes

## 13. Client Detail Components

- [x] 13.1 Create `components/clients/ClientDetail.tsx` component
- [x] 13.2 Display client basic information
- [x] 13.3 Display current status with badge
- [x] 13.4 Display assigned user
- [x] 13.5 Display contacts list with primary contact indicator
- [x] 13.6 Display contracts list
- [x] 13.7 Display comments timeline
- [x] 13.8 Display status history
- [x] 13.9 Add "Edit" button (Owner/Manager only)
- [x] 13.10 Add "Request Status Change" button for Managers
- [x] 13.11 Add "Change Status" button for Owners
- [x] 13.12 Add "Assign" button (Owner/Manager only)

## 14. Status Change Components

- [x] 14.1 Create `components/clients/StatusChangeRequestForm.tsx` component
- [x] 14.2 Display current status
- [x] 14.3 Add status dropdown (filtered to valid transitions)
- [x] 14.4 Add comment field (required for critical transitions)
- [x] 14.5 Add form validation
- [x] 14.6 Submit status change request
- [x] 14.7 Create `components/clients/StatusChangeForm.tsx` component (Owner direct change)
- [x] 14.8 Similar to request form but submits directly
- [x] 14.9 Create `components/clients/StatusHistory.tsx` component
- [x] 14.10 Display status history timeline
- [x] 14.11 Show status transitions with comments and user info

## 15. Contact Management Components

- [x] 15.1 Create `components/clients/ContactList.tsx` component
- [x] 15.2 Display contacts via @tanstack/react-table; table from md up, cards with label–value layout below md
- [x] 15.3 Show primary contact indicator
- [x] 15.4 Add "Add Contact" button (Owner/Manager only)
- [x] 15.5 Add edit and delete actions (Owner/Manager only)
- [x] 15.6 Create `components/clients/ContactForm.tsx` component
- [x] 15.7 Form fields: name, email, phone, role, isPrimary checkbox, notes
- [x] 15.8 Support both add and edit modes
- [x] 15.9 Validate required fields

## 16. Contract Management Components

- [x] 16.1 Create `components/clients/ContractList.tsx` component
- [x] 16.2 Display contracts via @tanstack/react-table; table from md up, cards with label–value layout below md
- [x] 16.3 Show contract type, dates, status
- [x] 16.4 Add "Add Contract" button (Owner/Manager only)
- [x] 16.5 Create `components/clients/ContractForm.tsx` component
- [x] 16.6 Form fields: type, startDate, endDate, terms, paymentTerms, documentPath, status
- [x] 16.7 Support both add and edit modes

## 17. Comments Components

- [x] 17.1 Create `components/clients/CommentTimeline.tsx` component
- [x] 17.2 Display comments and status changes in chronological order
- [x] 17.3 Show comment type (general comment vs. status change)
- [x] 17.4 Show user, timestamp, and content
- [x] 17.5 Create `components/clients/CommentForm.tsx` component
- [x] 17.6 Add comment textarea
- [x] 17.7 Submit comment

## 18. Approval Queue Components

- [x] 18.1 Create `components/admin/ApprovalQueue.tsx` component
- [x] 18.2 Display pending status change requests via @tanstack/react-table
- [x] 18.3 Show: client name, requested by, from/to status, comment, requested date
- [x] 18.4 Add "Approve" button for each request
- [x] 18.5 Add "Reject" button with optional review comment
- [x] 18.6 Add loading states during approval/rejection
- [x] 18.7 Refresh list after action

## 19. Client Pages

- [x] 19.1 Create `app/clients/page.tsx` route
- [x] 19.2 Add route protection (authenticated users)
- [x] 19.3 Render ClientList component
- [x] 19.4 Add page title and header
- [x] 19.5 Create `app/clients/new/page.tsx` route
- [x] 19.6 Add route protection (Owner/Manager only)
- [x] 19.7 Render ClientForm in create mode
- [x] 19.8 Handle form submission and redirect
- [x] 19.9 Create `app/clients/[id]/page.tsx` route
- [x] 19.10 Add route protection (authenticated users)
- [x] 19.11 Fetch client data
- [x] 19.12 Render ClientDetail component
- [x] 19.13 Create `app/clients/[id]/edit/page.tsx` route
- [x] 19.14 Add route protection (Owner/Manager only)
- [x] 19.15 Fetch client data
- [x] 19.16 Render ClientForm in edit mode
- [x] 19.17 Handle form submission and redirect

## 20. Approval Queue Page

- [x] 20.1 Create `app/admin/approvals/page.tsx` route
- [x] 20.2 Add route protection (Owner only)
- [x] 20.3 Fetch pending approval requests
- [x] 20.4 Render ApprovalQueue component
- [x] 20.5 Add page title and header

## 21. Middleware Updates

- [x] 21.1 Update `middleware.ts` to protect `/clients/**` routes
- [x] 21.2 Require authentication for all client routes
- [x] 21.3 Require Owner/Manager role for create/edit routes
- [x] 21.4 Require Owner role for `/admin/approvals` route

## 22. Testing & Verification

- [x] 22.1 Test client creation with required fields
- [x] 22.2 Test client creation access control (Admin denied)
- [x] 22.3 Test client update access control
- [x] 22.4 Test status workflow transitions
- [x] 22.5 Test critical transitions require comments
- [x] 22.6 Test status change request flow (Manager → Owner)
- [x] 22.7 Test Owner direct status change
- [x] 22.8 Test approval workflow (approve/reject)
- [x] 22.9 Test client assignment
- [x] 22.10 Test contact management (add/edit/remove)
- [x] 22.11 Test contact validation (at least one required)
- [x] 22.12 Test contract management (add/edit)
- [x] 22.13 Test comments (add/view)
- [x] 22.14 Test client list filtering and search
- [x] 22.15 Test RBAC enforcement across all endpoints
- [x] 22.16 Test status history immutability

## 23. Documentation

- [x] 23.1 Update README with client management setup instructions
- [x] 23.2 Document client status workflow
- [x] 23.3 Document approval workflow
- [x] 23.4 Document RBAC permissions for client management
- [x] 23.5 Add API endpoint documentation
