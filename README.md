# AutoLens Platform
## Full-Stack Automotive Inventory Management & Photography Suite

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Multi-Tenant SaaS Platform              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Web Portal  │  │   iOS App    │  │  Public API  │    │
│  │   (React)    │  │   (Swift)    │  │   (REST)     │    │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │
│         │                  │                  │             │
│         └──────────────────┴──────────────────┘             │
│                            │                                │
│                     ┌──────▼───────┐                       │
│                     │  API Gateway  │                       │
│                     │   (Express)   │                       │
│                     └──────┬───────┘                       │
│                            │                                │
│      ┌─────────────────────┼─────────────────────┐         │
│      │                     │                     │         │
│  ┌───▼────┐  ┌────────────▼──────────┐  ┌──────▼──────┐  │
│  │ Auth   │  │  Inventory Service    │  │Media Service│  │
│  │Service │  │  - CRUD Operations    │  │ - Upload    │  │
│  │        │  │  - Feed Processing    │  │ - Process   │  │
│  └────────┘  │  - Syndication        │  │ - CDN       │  │
│               └───────────────────────┘  └─────────────┘  │
│                            │                                │
│                     ┌──────▼───────┐                       │
│                     │  PostgreSQL  │                       │
│                     │              │                       │
│                     │ - Dealerships│                       │
│                     │ - Inventory  │                       │
│                     │ - Users      │                       │
│                     │ - Media      │                       │
│                     └──────────────┘                       │
│                                                             │
│  External Integrations:                                    │
│  - vAuto Feed (Inbound)                                    │
│  - Homenet Feed (Inbound)                                  │
│  - AutoTrader API (Outbound)                               │
│  - Cars.com API (Outbound)                                 │
│  - CloudFlare R2 (Media Storage)                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- Redis (optional, for sessions)

### Development Setup

1. **Clone and Install Dependencies**
```bash
git clone <your-repo>
cd dealership-photo-platform
npm install
```

2. **Start the Frontend (for testing)**
```bash
cd apps/web
npm run dev
```

3. **Access the Application**
- Frontend: http://localhost:3001
- Login with demo credentials:
  - **Owner**: demo@dealer.com / demo123
  - **Sales**: sales@dealer.com / sales123  
  - **Photographer**: photo@dealer.com / photo123

### Current Features ✅

#### Frontend (Next.js + Tailwind CSS)
- ✅ **Beautiful Login Page** with hardcoded demo users
- ✅ **Modern Dashboard** with inventory overview
- ✅ **Vehicle Grid** with status indicators
- ✅ **Stats Cards** showing key metrics
- ✅ **Search & Filtering** by status and text
- ✅ **Responsive Design** for all screen sizes
- ✅ **Role-based UI** showing different user types

#### Backend API (Node.js + TypeScript + Prisma)
- ✅ **Multi-tenant Architecture** with organization isolation
- ✅ **JWT Authentication** with sessions
- ✅ **Comprehensive Database Schema** (20+ tables)
- ✅ **Vehicle CRUD Operations** 
- ✅ **Role-based Access Control**
- ✅ **Feed Integration Ready** (vAuto/Homenet)
- ✅ **Syndication Queue System**
- ✅ **Audit Logging**

#### Custom Component System
- ✅ **Pure Tailwind CSS** components for full control
- ✅ **Composable Button, Input, Card** components
- ✅ **No external UI library dependencies**
- ✅ **Consistent design system**

## Core Features

### 1. Multi-Tenant Inventory Management
- Full dealership isolation with dealer group hierarchy
- Role-based access control (Owner, Manager, Sales, Photographer)
- Inventory CRUD operations with iLot (lot) organization
- Automated feed ingestion (vAuto, Homenet)
- Market pricing analytics
- Vehicle aging reports

### 2. Photography Suite
- iOS app with guided capture workflow
- Client-side video processing with transitions
- Automatic vehicle matching
- Bulk upload capabilities
- Photo/video organization

### 3. Syndication Engine
- Push to AutoTrader, Cars.com, CarGurus
- Custom feed generation
- Scheduling and automation
- Sync status tracking

### 4. Public Dealer Sites
- Customizable dealer inventory pages
- SEO-optimized VDPs
- Lead capture
- Analytics

## Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Heroicons
- **State**: React hooks + localStorage (demo)
- **UI Components**: Custom built with CVA

### Backend
- **Runtime**: Node.js 20+ with TypeScript
- **Framework**: Express.js with modular architecture
- **Database**: PostgreSQL 15+ with Prisma ORM
- **Cache**: Redis for sessions and feed caching
- **Queue**: Bull for background jobs
- **Storage**: CloudFlare R2 for media

### iOS App (Planned)
- **Language**: Swift 5.9+
- **Min iOS**: 15.0
- **Video**: AVFoundation
- **Networking**: URLSession + Combine
- **Storage**: Core Data for offline

## Database Schema (Key Tables)

```sql
-- Multi-tenancy
organizations (id, name, subdomain, settings)
users (id, org_id, email, role, permissions)

-- Inventory
vehicles (id, org_id, vin, stock_number, status, details)
vehicle_media (id, vehicle_id, type, url, metadata)
vehicle_history (id, vehicle_id, action, timestamp)

-- Feed Management  
feed_configs (id, org_id, provider, credentials, schedule)
feed_logs (id, feed_id, status, processed_count)

-- Photography
photo_assignments (id, vehicle_id, photographer_id, status)
capture_sessions (id, assignment_id, device_info, completed_at)

-- Syndication
syndication_targets (id, org_id, platform, credentials)
syndication_queue (id, vehicle_id, target_id, status)
```

## Project Structure

```
dealership-photo-platform/
├── apps/
│   ├── web/                 # Next.js dashboard ✅
│   ├── api/                 # Express backend ✅
│   ├── ios/                 # Swift iOS app (planned)
│   └── public-site/         # Dealer-facing site (planned)
├── packages/
│   ├── database/            # Prisma schema & migrations ✅
│   ├── shared-types/        # TypeScript types (planned)
│   └── utils/               # Shared utilities (planned)
├── services/
│   ├── feed-processor/      # Feed ingestion service (planned)
│   ├── media-processor/     # Video/image processing (planned)
│   └── syndication/         # Push to external platforms (planned)
└── infrastructure/
    ├── docker/
    └── kubernetes/
```

## Development Status

### ✅ Completed (Phase 1)
- [x] Project structure and monorepo setup
- [x] Database schema design (comprehensive)
- [x] Backend API foundation with authentication
- [x] Frontend with login and dashboard
- [x] Custom component system
- [x] Multi-tenant architecture
- [x] Demo data and hardcoded auth

### 🚧 In Progress (Phase 2)
- [ ] Vehicle detail pages with media gallery
- [ ] Add vehicle form and editing
- [ ] User management and settings
- [ ] Photography assignment workflow

### 📅 Planned (Phase 3+)
- [ ] iOS app for photographers
- [ ] Feed processing (vAuto/Homenet)
- [ ] Syndication to external platforms
- [ ] Video processing pipeline
- [ ] Public dealer websites
- [ ] Analytics and reporting
- [ ] Email notifications
- [ ] API documentation

## Security Features

- JWT-based authentication with refresh tokens
- Row-level security in PostgreSQL
- API rate limiting per organization
- Encrypted feed credentials
- HTTPS everywhere
- Input sanitization
- SQL injection prevention via Prisma
- XSS protection
- CORS configuration

## Demo Credentials

Use these credentials to test different user roles:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Owner** | demo@dealer.com | demo123 | Full access to everything |
| **Sales** | sales@dealer.com | sales123 | View inventory, manage leads |
| **Photographer** | photo@dealer.com | photo123 | Photo assignments, media upload |

## Next Steps

1. **Connect Backend**: Set up PostgreSQL and connect the API
2. **Real Authentication**: Replace hardcoded auth with JWT tokens
3. **Vehicle Details**: Add detailed vehicle pages with image galleries
4. **iOS App**: Start building the photographer mobile app
5. **Feed Integration**: Connect to vAuto/Homenet APIs
6. **Video Processing**: Implement fade transitions in iOS
7. **Deployment**: Set up production infrastructure

---

**AutoLens** - Making dealership photography and inventory management effortless.