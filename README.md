# CRM-system

Full-stack CRM Lead Management System built with React, Vite, Prisma, SQLite, Mantine UI, and Better Auth.

## Features (Current)

- **Authentication**: Email/password login and registration using Better Auth
- **Test User**: Pre-seeded with `admin@example.com / password123`
- **Protected Routes**: Dashboard is only accessible to authenticated users
- **Polished UI**: Built with Mantine v7 components

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
│   │   └── seed.ts       # Test user seed
│   └── src/
│       ├── auth.ts       # Better Auth configuration
│       └── index.ts      # Express server
├── frontend/             # React + Vite + Mantine
│   └── src/
│       ├── context/
│       │   └── AuthContext.tsx   # Auth state management
│       ├── lib/
│       │   └── auth-client.ts    # Better Auth client
│       └── pages/
│           ├── Login.tsx         # Login form
│           ├── Register.tsx      # Registration form
│           └── Dashboard.tsx     # Protected placeholder
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

# Seed test user
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
- `npm run db:seed` - Seed database with test user
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

Better Auth automatically provides:
- `POST /api/auth/sign-up/email` - Register new user
- `POST /api/auth/sign-in/email` - Login
- `POST /api/auth/sign-out` - Logout
- `GET /api/auth/get-session` - Get current session

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

### Adding New Features

The current implementation focuses on authentication. To extend:

1. **Database**: Add models to `backend/prisma/schema.prisma`
2. **API**: Add Express routes in `backend/src/index.ts`
3. **Frontend**: Add pages in `frontend/src/pages/`
4. **Routing**: Update routes in `frontend/src/App.tsx`

### Database Schema

The SQLite database includes tables managed by Better Auth:
- `user` - User accounts
- `session` - Active sessions
- `account` - Linked accounts
- `verification` - Verification tokens

## License

MIT
