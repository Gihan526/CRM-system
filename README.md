# CRM Lead Management System

## Project Overview

A full-stack CRM (Customer Relationship Management) application for tracking sales leads through a pipeline. Built as a solo learning project to practice modern full-stack development with React, TypeScript, Prisma, and authentication.

The app lets you create leads, track their status (New → Contacted → Qualified → Proposal Sent → Won/Lost), add notes, and view dashboard statistics. It includes a complete authentication system with login, registration, and protected routes.

---

## Tech Stack Used

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite + TypeScript | UI framework and build tool |
| **Frontend UI** | Mantine v7 | Component library (tables, forms, cards, notifications) |
| **Frontend Icons** | Tabler Icons | Icon set |
| **Frontend Routing** | React Router v7 | Client-side navigation |
| **Backend** | Express.js + TypeScript | REST API server |
| **Authentication** | Better Auth | Email/password auth with session cookies |
| **Database ORM** | Prisma | Type-safe database queries |
| **Database** | SQLite | File-based database (zero config) |
| **Dev Tools** | tsx, concurrently | Hot reload and parallel dev servers |

---

## Features Implemented

### Authentication
- Email/password registration and login
- Cookie-based sessions with automatic renewal
- Protected routes (unauthenticated users redirected to login)
- Logout functionality

### Lead Management
- **Create** leads with name, company, email, phone, source, status, deal value
- **View** all leads in a sortable table with hover effects
- **Edit** lead details and status
- **Delete** leads with browser confirmation
- **View Details** — full lead profile with notes timeline

### Status Pipeline
- Track leads through stages: New → Contacted → Qualified → Proposal Sent → Won/Lost
- Quick status update buttons on lead detail page
- Status badges with color coding

### Notes
- Add text notes to any lead
- View chronological note history with author and timestamp
- Timeline visualization of note history

### Dashboard
- Stat cards: Total Leads, New, Contacted, Qualified, Proposal Sent, Won, Lost
- Deal value summaries: total estimated and total won
- Quick action button to add new leads

### Search & Filtering
- Filter leads by status and source
- Search by lead name, company name, or email
- Frontend filtering (source/assigned/search) + backend filtering (status)

---

## How to Run Locally

### Prerequisites
- Node.js 18+ and npm

### 1. Install Dependencies

```bash
# From project root — installs root, backend, and frontend deps
npm run install:all
```

### 2. Set Up Database

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations (creates SQLite database file)
npx prisma migrate dev

# Seed test user and 8 demo leads
npx prisma db seed
```

### 3. Start the App

**Option A: Run both together**
```bash
# From project root
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

### 4. Open in Browser

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Auth Endpoint:** http://localhost:3001/api/auth

---

## Environment Variables

Create `backend/.env` with the following:

```env
DATABASE_URL=file:./dev.db
FRONTEND_URL=http://localhost:5173
PORT=3001
BETTER_AUTH_SECRET=your_random_secret_here
BETTER_AUTH_URL=http://localhost:3001
```

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database file path | `file:./dev.db` |
| `FRONTEND_URL` | Frontend origin for CORS | `http://localhost:5173` |
| `PORT` | Backend server port | `3001` |
| `BETTER_AUTH_SECRET` | Random string for signing tokens | *(required)* |
| `BETTER_AUTH_URL` | Backend base URL | `http://localhost:3001` |

> **Note:** The repo includes a pre-configured `.env` file for local development. In production, generate a secure `BETTER_AUTH_SECRET`.

---

## Test Login Credentials

Use these credentials to log in after running the database seed:

```
Email:    admin@example.com
Password: password123
```

The seed script creates this user automatically along with 8 demo leads.

---

## Database Setup

### Schema Overview

The SQLite database includes tables managed by **Better Auth**:
- `user` — User accounts
- `session` — Active sessions
- `account` — Linked accounts
- `verification` — Email verification tokens

Plus custom **CRM tables**:
- `lead` — Lead information
- `note` — Lead notes (linked to leads)

### Useful Commands

```bash
cd backend

# Open visual database editor
npx prisma studio

# Reset database and re-run migrations
npx prisma migrate reset

# Re-seed data after reset
npx prisma db seed

# Generate Prisma client after schema changes
npx prisma generate
```

### Prisma Schema Location

```
backend/prisma/schema.prisma
```

---

## Known Limitations

1. **No real-time updates** — Changes made by other users require a page refresh to see
2. **No role-based access** — All authenticated users have full CRUD access to all leads
3. **Frontend filtering is client-side only** — Status filtering hits the API, but source/assigned/search filters run in-browser on the current page of results
4. **No pagination** — Lead list loads all records at once (fine for small datasets)
5. **No email verification** — Registration is open without email confirmation
6. **No password reset flow** — Users cannot recover forgotten passwords
7. **SQLite only** — Not suitable for concurrent multi-user production workloads without migrating to PostgreSQL/MySQL
8. **No export functionality** — Cannot export leads to CSV/Excel
9. **Assigned salesperson is free text** — No user directory or autocomplete

---

## Reflection

This project was built as a hands-on way to learn modern full-stack patterns. The main goals were:

1. **Understand Better Auth** — Setting up email/password auth with session cookies without building a custom auth system from scratch
2. **Practice Prisma + SQLite** — Using a type-safe ORM with a zero-config database for rapid prototyping
3. **Build a complete CRUD app** — From database schema to API to UI, covering create, read, update, delete for a real-world entity (leads)
4. **Use a component library** — Leveraging Mantine for professional-looking tables, forms, and layout without writing custom CSS

### What went well
- Better Auth integrated smoothly with Express and Prisma
- Mantine provided polished UI components out of the box
- SQLite + Prisma made local development fast with no Docker or external DB needed
- The monorepo structure with npm workspaces keeps backend and frontend in one repo

### What could improve
- Adding pagination and server-side search for larger datasets
- Implementing role-based access control (admin vs salesperson)
- Adding unit/integration tests (currently none)
- Moving from SQLite to PostgreSQL for production readiness
- Adding data validation middleware on the backend (some validation is frontend-only)

---

## Project Structure

```
crm-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   ├── seed.ts          # Test user + demo leads
│   │   └── dev.db           # SQLite database
│   ├── .env                 # Environment variables
│   └── src/
│       ├── auth.ts          # Better Auth configuration
│       ├── index.ts         # Express server + API routes
│       └── middleware/
│           └── auth.ts      # Auth middleware
├── frontend/
│   └── src/
│       ├── components/
│       │   └── Sidebar.tsx         # Navigation sidebar
│       ├── context/
│       │   └── AuthContext.tsx     # Auth state management
│       ├── lib/
│       │   ├── auth-client.ts      # Better Auth client
│       │   └── api.ts              # API helper functions
│       ├── pages/
│       │   ├── Login.tsx           # Login form
│       │   ├── Register.tsx        # Registration form
│       │   ├── Dashboard.tsx       # Dashboard with stats
│       │   ├── Leads.tsx           # Lead list with filters
│       │   ├── LeadForm.tsx        # Create/Edit lead form
│       │   └── LeadDetail.tsx      # Lead details + notes
│       └── types/
│           └── lead.ts             # TypeScript types
├── package.json             # Root workspace config
└── README.md                # This file
```

## License

MIT
