# HR Agency CRM

A premium, feature-rich CRM for HR agencies built with Next.js 15, Prisma 7, and Tailwind v4.

## 🚀 Features

- **Multi-role Auth**: Owner, Manager, and Admin with RBAC enforcement.
- **Client & Job Management**: Track partners and positions in a high-end interface.
- **Candidate Pipeline**: Visual Kanban board with drag-and-drop interactivity.
- **Secure CV Storage**: Integrated Google Cloud Storage with metadata tracking.
- **Real-time Analytics**: Dashboard with interactive charts for status monitoring.
- **Audit Logging**: Full activity tracking for all significant user actions.

## 🛠 Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Interactivity**: [@dnd-kit](https://dndkit.com/), [Recharts](https://recharts.org/)
- **Storage**: [Google Cloud Storage](https://cloud.google.com/storage)

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL database (local or remote)
- npm or yarn package manager

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd test-opsx
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Update the following variables in `.env`:

- `DATABASE_URL`: PostgreSQL connection string (format: `postgresql://user:password@host:port/database`)
- `AUTH_SECRET`: Generate a secret key (use `openssl rand -base64 32` or visit https://generate-secret.vercel.app/32)
- `GOOGLE_CLOUD_PROJECT_ID`: Your Google Cloud project ID (required for CV storage)
- `GOOGLE_CLOUD_STORAGE_BUCKET`: Your Google Cloud Storage bucket name (required for CV storage)
- `GOOGLE_APPLICATION_CREDENTIALS`: Path to your Google Cloud service account JSON key file (optional, can use default credentials)

### 4. Set up the database

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev
```

Seed the database with the initial Owner user:

```bash
npx tsx prisma/seed.ts
```

**Default Owner Credentials:**
- Email: `owner@example.com`
- Password: `password123`

**⚠️ IMPORTANT**: Change the default password in production!

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### 6. Authentication

- **Sign In**: Navigate to `/auth/signin` and use the Owner credentials
- **Sign Up**: New users can register at `/auth/signup` (requires approval)
- **User Management**: Owners and Managers can approve users at `/admin/users/pending`

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server (after building)
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code using Prettier

## 🔐 Authentication & Roles

The application uses a hierarchical role system:

- **OWNER**: Full system access, can manage all users, approve registrations, suspend users
- **MANAGER**: Can manage clients, jobs, candidates, approve registrations, manage non-Owner users
- **ADMIN**: Can view data and manage candidates (limited editing)

### User Registration Flow

1. User registers at `/auth/signup`
2. Account is created with `PENDING` status
3. Owner or Manager approves at `/admin/users/pending`
4. User can then sign in

### RBAC Utilities

Role-based access control utilities are available in `lib/auth.ts`:

- `hasRoleOrHigher(userRole, requiredRole)` - Check if user has required role or higher
- `canApproveRegistrations(role)` - Check if user can approve registrations
- `canManageUsers(userRole, targetRole)` - Check if user can manage another user
- Client management: `canCreateClient`, `canUpdateClient`, `canDeleteClient`, `canAssignClient`, `canApproveStatusChange`, `canRequestStatusChange`, `canManageContacts`, `canManageContracts`

## 👥 Client Management

Client management is available at `/clients` (authenticated users). Each client has company info, contacts, optional contracts, status workflow, and assignment.

### Setup

After running migrations and seed, the client management schema is already applied. No extra setup is required.

### Client Status Workflow

- **PROSPECT** → ACTIVE, ARCHIVED  
- **ACTIVE** → INACTIVE, ARCHIVED  
- **INACTIVE** → ACTIVE, ARCHIVED  
- **ARCHIVED** — no further transitions  

Comments are **required** for critical transitions: PROSPECT→ACTIVE, ACTIVE→INACTIVE, ACTIVE→ARCHIVED.

### Approval Workflow

- **Managers** request a status change via the client detail page; the request is created with status PENDING.
- **Owners** review pending requests at `/admin/approvals` and can Approve or Reject.
- **Owners** can change client status directly (no approval step).

### RBAC for Client Management

| Action | Owner | Manager | Admin |
|--------|-------|---------|-------|
| View clients | ✓ | ✓ | ✓ |
| Create client | ✓ | ✓ | — |
| Update client | ✓ | ✓ | — |
| Archive (delete) client | ✓ | — | — |
| Request status change | — | ✓ | — |
| Approve / Reject status change | ✓ | — | — |
| Direct status change | ✓ | — | — |
| Assign client | ✓ | ✓ | — |
| Manage contacts | ✓ | ✓ | — |
| Manage contracts | ✓ | ✓ | — |
| Add comment | ✓ | ✓ | ✓ |

### Client API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/clients` | List clients (filter: status, assignedTo, search, page, limit) |
| POST | `/api/clients` | Create client (Owner/Manager) |
| GET | `/api/clients/[id]` | Get client details |
| PATCH | `/api/clients/[id]` | Update client (Owner/Manager) |
| DELETE | `/api/clients/[id]` | Archive client (Owner) |
| POST | `/api/clients/[id]/status/request` | Request status change (Manager) |
| POST | `/api/clients/[id]/status/approve` | Approve request (Owner) |
| POST | `/api/clients/[id]/status/reject` | Reject request (Owner) |
| POST | `/api/clients/[id]/status/direct` | Direct status change (Owner) |
| GET | `/api/clients/[id]/status-history` | Get status history |
| POST | `/api/clients/[id]/assign` | Assign client to user (Owner/Manager) |
| GET/POST | `/api/clients/[id]/contacts` | List / add contacts |
| PATCH/DELETE | `/api/clients/[id]/contacts/[contactId]` | Update / delete contact |
| GET/POST | `/api/clients/[id]/contracts` | List / add contracts |
| PATCH | `/api/clients/[id]/contracts/[contractId]` | Update contract |
| GET/POST | `/api/clients/[id]/comments` | List / add comments |
| GET | `/api/admin/approvals` | Pending status change requests (Owner) |

## 🗂 Project Structure

```
├── app/                    # Next.js App Router routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions and helpers
│   ├── prisma.ts          # Prisma Client singleton
│   ├── utils.ts           # Common utilities
│   └── env.ts             # Environment variables
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
├── public/                # Static assets
└── .github/               # GitHub Actions workflows
    └── workflows/
        └── ci.yml         # CI/CD pipeline
```

## 🗄 Database Workflow

### Running Migrations

Create a new migration after modifying `prisma/schema.prisma`:

```bash
npx prisma migrate dev --name migration-name
```

### Generating Prisma Client

After schema changes, regenerate the Prisma Client:

```bash
npx prisma generate
```

### Seeding the Database

Populate the database with initial data:

```bash
npx prisma db seed
```

### Viewing the Database

Open Prisma Studio to view and edit data:

```bash
npx prisma studio
```

## 🔧 Development

### Code Quality

This project uses:

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting

Run linting:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

### Type Checking

Verify TypeScript types:

```bash
npx tsc --noEmit
```

## 🚢 Deployment

The application is configured for deployment on platforms like Vercel, which support Next.js out of the box.

### Environment Variables

Make sure to set the following environment variables in your deployment platform:

- `DATABASE_URL`
- `AUTH_SECRET`
- `GOOGLE_CLOUD_PROJECT_ID` (required for CV storage)
- `GOOGLE_CLOUD_STORAGE_BUCKET` (required for CV storage)
- `GOOGLE_APPLICATION_CREDENTIALS` (optional, can use default credentials)
- `NODE_ENV` (automatically set to "production" in most platforms)

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
