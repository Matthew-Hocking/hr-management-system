# HR Management System

A full Stack HR management system built with Next.js, TypeScript, Prisma, and PostgreSQL.<br/>
Deployed on Vercel and uses Neon as the PostgreSQL hosting service.

This app provides employee management with role-based access control for administrators and employees.

## Features

### Authentication & Authorisation
- **NextAuth.js Integration**: Secure authentication with JWT tokens
- **Role-Based Access Control**: Separate interfaces for admins and employees
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Persistent login sessions

### Employee Management
- **CRUD Operations**: Create, read, update, and delete employees
- **Search & Filtering**: Search by name, email, position, or department
- **Department-Based Organisation**: Filter and group employees by departments
- **Salary Management**: Track and manage employee salaries
- **Real-time Updates**: Dynamic employee list updates

### Admin Dashboard
- **Overview Statistics**: Total employees and department counts
- **Department Analytics**: Visual breakdown of employees by department
- **Recent Employee Tracking**: Monitor newly added employees
- **Quick Actions**: Direct access to employee management functions

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon) with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS v4
- **Password Hashing**: bcryptjs
- **Development**: TypeScript, ESLint

## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

## Getting Started

### 1. Clone the Repository
```bash
git clone git@github.com:Matthew-Hocking/hr-management-system.git
cd hr-management-system
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env` file in the root directory with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/hr_management_system"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
```bash
# Push the schema to your database
npm run db:push

# Seed the database with admin account
npx prisma db seed
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Admin Account

After seeding the database, you can log in with:
- **Email**: admin@company.com
- **Password**: admin123

## Project Structure

```bash
src/
├── app/                   # Next.js App Router
│   ├── admin/             # Admin-only routes
│   │   ├── dashboard/     # Admin dashboard
│   │   └── employees/     # Employee management
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   └── employees/     # Employee CRUD operations
│   ├── employee/          # Employee-only routes
│   ├── login/             # Login page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (redirects to login)
│   └── providers.tsx      # App providers
├── components/            # Reusable components
│   └── Navbar.tsx         # Navigation component
├── types/                 # TypeScript type definitions
│   ├── employee.d.ts      # Employee types
│   └── next-auth.d.ts     # NextAuth type extensions
├── auth.ts                # NextAuth configuration
└── middleware.ts          # Route protection middleware

prisma/
├── schema.prisma          # Database schema
└── seed.ts                # Database seeding script
```

## Database Schema

### Users Table
- Handles authentication and user roles
- Supports ADMIN and EMPLOYEE roles
- Includes account status tracking

### Employees Table
- Stores employee information
- Links to Users table for authentication
- Optimised with database indexes

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure session management
- **Role-Based Authorisation**: Middleware-level protection
- **Input Validation**: Server-side data validation

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
- `npx prisma db seed` - Seed database with initial data

## Deployment

Make sure to:
1. Set up environment variables in your deployment platform
2. Configure your PostgreSQL database
3. Run database migrations
4. Seed the database with the admin account

## License

This project is licensed under the MIT License.
