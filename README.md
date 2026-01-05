# Fleet Management System

Comprehensive fleet management application for tracking vehicles, managing drivers, monitoring trips, and analyzing fleet operations in real-time.

## Features

- **Vehicle Management**: Track and manage fleet vehicles with detailed information
- **Driver Management**: Manage driver profiles, licenses, and assignments
- **Trip Tracking**: Monitor trips with real-time location updates
- **Maintenance Scheduling**: Track vehicle maintenance and service history
- **Fuel Management**: Monitor fuel consumption and costs
- **User Management**: Role-based access control for team members
- **Real-time Tracking**: Live vehicle location updates via WebSocket
- **Analytics Dashboard**: Comprehensive fleet insights and reports
- **Multi-tenant**: Company-based data isolation

## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database (shared with fleet-management-portal)
- IoT Backend server (for real-time vehicle tracking)
- Resend API key (for password reset emails)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fleetmanagement
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   # Database (shared with admin portal)
   LOCAL_DATABASE_URL=postgresql://user:password@host:port/database
   
   # Auth Secrets (generate with: openssl rand -base64 32)
   AUTH_SECRET=your-auth-secret-key-here
   JWT_SECRET=your-jwt-secret-key-here
   
   # Email Service
   RESEND_API_KEY=re_your_resend_api_key_here
   
   # Backend API
   BACKENDBASE_URL=http://your-production-backend-url:port/api
   LOCAL_BACKENDBASE_URL=http://localhost:3000/api
   
   # IoT Backend (Real-time Tracking)
   NEXT_PUBLIC_IOT_BACKEND_URL=http://localhost:3001
   NEXT_PUBLIC_IOT_WEBSOCKET_URL=ws://localhost:3002/ws
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   pnpm drizzle-kit generate
   
   # Run migrations
   pnpm drizzle-kit migrate
   ```

5. **Ensure you have a company and user set up**
   - Use the fleet-management-portal to create a company
   - An admin user will be auto-created with credentials
   - Or manually insert into the database

## Running the Application

```bash
# Development mode (runs on port 3001 to avoid conflict with admin portal)
pnpm dev

# Production build
pnpm build
pnpm start
```

The application runs on [http://localhost:3001](http://localhost:3001)

## Project Structure

```
app/
├── (pages)/           # Main application pages
│   ├── asset/         # Vehicle management
│   ├── drivers/       # Driver management
│   ├── trips/         # Trip tracking
│   ├── maintenance/   # Maintenance records
│   ├── fuel/          # Fuel management
│   ├── userManagement/# User & role management
│   └── realTimeData/  # Live vehicle tracking
├── api/               # API routes
│   ├── auth/          # Authentication
│   ├── vehicles/      # Vehicle endpoints
│   ├── drivers/       # Driver endpoints
│   ├── trips/         # Trip endpoints
│   └── vehicle-tracking/ # Real-time tracking
├── components/        # Shared UI components
├── db/                # Database schema and connection
└── auth.ts            # NextAuth configuration

actions/               # Server actions
├── vehicles.ts        # Vehicle CRUD with company filtering
├── drivers.ts         # Driver CRUD with company filtering
├── trips.ts           # Trip CRUD with company filtering
├── users.ts           # User management
├── departments.ts     # Department management
└── maintenance.ts     # Maintenance operations

hooks/                 # Custom React hooks
├── useVehicleData.tsx # Vehicle data fetching
├── useWebSocket.tsx   # Real-time WebSocket connection
└── useFetch.tsx       # Generic data fetching
```

## Key Technologies

- **Next.js 15.4.8**: React framework with App Router
- **Drizzle ORM 0.44.7**: Type-safe database queries
- **NextAuth**: Authentication with JWT and company context
- **TanStack Query**: Data fetching, caching, and mutations
- **Leaflet**: Interactive maps for trip tracking
- **WebSocket**: Real-time vehicle location updates
- **Recharts**: Data visualization and charts
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Full type safety

## Database Schema

### Core Tables
- **vehicles**: Fleet vehicles with specs and status
- **drivers**: Driver profiles with license info
- **trips**: Trip records with routes and status
- **users**: User accounts linked to companies
- **departments**: Organizational departments
- **roles**: User roles and permissions
- **maintenance**: Vehicle maintenance records
- **fuel_records**: Fuel consumption tracking
- **emergency_contacts**: Driver emergency contacts

### Multi-tenancy
- All tables include `company_id` for data isolation
- Queries automatically filter by logged-in user's company
- No cross-company data access

## Multi-tenant Architecture

- Users belong to one company via `company_id`
- Session stores `companyId` from JWT token
- All database queries filter by `company_id`
- Company isolation enforced at database and API levels

## Real-time Tracking

1. IoT Backend sends vehicle locations via WebSocket
2. Frontend connects to WebSocket on page load
3. Live updates displayed on map interface
4. Trip progress tracked in real-time

## Default Credentials

**Note**: Change default password immediately!

- Created via admin portal with password: `Welcome@123`
- Or create test user using scripts/createTestUser.sql

## Related Projects

- **fleet-management-portal**: Admin portal for managing companies (runs on port 3000)
- **IoT Backend**: Real-time vehicle tracking service (separate backend)

## Development Notes

- This app and the admin portal share the same PostgreSQL database
- Run on different ports (3000 for admin, 3001 for fleet app)
- Authentication is separate but uses shared user table
- All CRUD operations include company filtering for security
- Real-time features require IoT backend to be running

## Common Tasks

**Add a new user**
```sql
-- Users are created via the admin portal or User Management page
```

**Fix orphaned users (missing company_id)**
```sql
UPDATE users 
SET company_id = '<your-company-uuid>'
WHERE company_id IS NULL;
```

**Reset user password**
- Use the "Forgot Password" flow
- Or manually update password_hash in database
