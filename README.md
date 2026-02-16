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

### 4. Set up the database

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev
```

(Optional) Seed the database with initial data:

```bash
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📜 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server (after building)
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code using Prettier

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
- `NODE_ENV` (automatically set to "production" in most platforms)

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
