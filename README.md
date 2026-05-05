# CRM-system

Full-stack CRM Lead Management System built with React, Vite, Prisma, SQLite, Mantine UI, and Better Auth.

## Features

### Authentication
- **Email/Password Login**: Secure authentication using Better Auth
- **Session Management**: Cookie-based sessions with automatic renewal
- **Protected Routes**: All CRM features require authentication
- **Test User**: Pre-seeded with `admin@example.com / password123`

### Lead Management
- **Create Leads**: Add new leads with full details (name, company, contact info, source, status, deal value)
- **View Leads**: Browse all leads in a sortable table with quick actions
- **Edit Leads**: Update lead information and status
- **Delete Leads**: Remove leads with confirmation
- **Lead Details**: View comprehensive lead information with notes history
- **Status Tracking**: Track leads through pipeline (New → Contacted → Qualified → Proposal Sent → Won/Lost)
- **Quick Status Update**: Change status directly from lead detail page

### Lead Notes
- **Add Notes**: Attach notes to any lead
- **Note History**: View chronological note timeline
- **Created By**: Track who added each note

### Dashboard
- **Statistics Cards**: Total Leads, New Leads, Contacted, Qualified, Won, Lost
- **Deal Values**: Total estimated deal value and won deal value
- **Quick Actions**: Add new lead directly from dashboard

### Search & Filtering
- **Status Filter**: Filter leads by status
- **Source Filter**: Filter by lead source (Website, LinkedIn, Referral, etc.)
- **Search**: Search by lead name, company name, or email

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, Mantine v7 |
| Backend | Express.js, TypeScript |
| Auth | Better Auth with Prisma Adapter |
| Database | SQLite with Prisma ORM |

## Project Structure

```
crm-app/
├── backend/              # Express API + Better Auth + Prisma
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   ├── seed.ts       # Test user + demo leads
│   │   └── dev.db        # SQLite database
│   └── src/
│       ├── auth.ts       # Better Auth configuration
│       ├── index.ts      # Express server + API routes
│       └── middleware/
│           └── auth.ts   # Auth middleware
├── frontend/             # React + Vite + Mantine
│   └── src/
│       ├── components/
│       │   └── Sidebar.tsx       # Navigation sidebar
│       ├── context/
│       │   └── AuthContext.tsx   # Auth state management
│       ├── lib/
│       │   ├── auth-client.ts    # Better Auth client
│       │   └── api.ts            # API helper functions
│       ├── pages/
│       │   ├── Login.tsx         # Login form
│       │   ├── Register.tsx      # Registration form
│       │   ├── Dashboard.tsx     # Dashboard with stats
│       │   ├── Leads.tsx         # Lead list with filters
│       │   ├── LeadForm.tsx      # Create/Edit lead form
│       │   └── LeadDetail.tsx    # Lead details + notes
│       └── types/
│           └── lead.ts           # TypeScript types
└── package.json          # Root workspace
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install all dependencies (root, backend, frontend)
npm run install:all
```

### Database Setup

```bash
cd backend

# Generate Prisma client
npx prisma generate

# Run migrations (creates SQLite database)
npx prisma migrate dev

# Seed test user and demo leads
npx prisma db seed
```

### Running the Application

**Option 1: Run both simultaneously**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Auth Endpoint: http://localhost:3001/api/auth

### Test Credentials

```
Email: admin@example.com
Password: password123
```

## Available Scripts

### Root
- `npm run dev` - Start both backend and frontend
- `npm run install:all` - Install all dependencies

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with test user and demo leads
- `npm run db:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Authentication Flow

1. **Register**: Users can create an account at `/register`
2. **Login**: Users sign in at `/login`
3. **Session**: Better Auth manages sessions via cookies
4. **Protected Routes**: Unauthenticated users are redirected to `/login`
5. **Logout**: Clears session and redirects to login

## API Endpoints

### Authentication (Better Auth)
- `POST /api/auth/sign-up/email` - Register new user
- `POST /api/auth/sign-in/email` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/get-session` - Get current session

### Leads
- `GET /api/leads` - List all leads (supports filtering)
- `GET /api/leads/:id` - Get single lead with notes
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead

### Notes
- `GET /api/leads/:id/notes` - Get notes for a lead
- `POST /api/leads/:id/notes` - Add note to lead

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Demo Data

The application comes with 8 pre-seeded demo leads:

| Lead | Company | Status | Source | Value |
|------|---------|--------|--------|-------|
| John Smith | Acme Corp | New | Website | $50,000 |
| Sarah Johnson | TechStart | Contacted | LinkedIn | $75,000 |
| Mike Brown | Global Inc | Qualified | Referral | $120,000 |
| Emily Davis | SmartSolutions | Proposal Sent | Cold Email | $45,000 |
| Chris Wilson | MegaCorp | Won | Event | $200,000 |
| Lisa Anderson | StartupXYZ | Lost | Website | $30,000 |
| David Lee | Enterprise Co | Contacted | LinkedIn | $90,000 |
| Amanda White | BlueChip Ltd | New | Referral | $60,000 |

## Development Notes

### Git Workflow

Always create feature branches for new features:

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Make changes, then commit
git add .
git commit -m "feat: add your feature description"

# Push branch
git push -u origin feature/your-feature-name

# Merge to main when ready
git checkout main
git merge feature/your-feature-name
git push
```

### Database Schema

The SQLite database includes tables managed by Better Auth:
- `user` - User accounts
- `session` - Active sessions
- `account` - Linked accounts
- `verification` - Verification tokens

Plus CRM tables:
- `lead` - Lead information
- `note` - Lead notes

## License

MIT
