# Mzigo.co.ke - Package Delivery & Tracking Platform

Modern package delivery and tracking solution built with Next.js 15, React 19, and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── config.ts
│   │   ├── delete-package/
│   │   ├── destinations/
│   │   ├── get-packages/
│   │   ├── partners/
│   │   ├── register-package/
│   │   ├── requirements/
│   │   └── update-package/
│   ├── profile/                  # User profile & packages
│   ├── send-mzigo/              # Send package pages
│   │   └── [company]/           # Dynamic company pages
│   ├── track-mzigo/             # Package tracking
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                   # UI Components
│   └── ui/
│       ├── shared/              # Shared components
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   ├── MobileNavBar.tsx
│       │   ├── ToastProvider.tsx
│       │   └── ConfirmDialog.tsx
│       ├── home/                # Home page components
│       │   ├── Landingpage.tsx
│       │   ├── HeroSlider.tsx
│       │   ├── HomeFromTo.tsx
│       │   ├── LocationSelector.tsx
│       │   └── FAQ.tsx
│       ├── send-mzigo/          # Send package components
│       │   └── CompanyCard.tsx
│       ├── track-mzigo/         # Tracking components
│       │   ├── SearchBar.tsx
│       │   ├── TrackingPipeline.tsx
│       │   └── StatusUpdater.tsx
│       └── profile/             # Profile components
│
├── hooks/                       # Custom React hooks
│   ├── useDestinations.ts
│   ├── useLocalStorage.ts
│   ├── usePackages.ts
│   ├── usePartners.ts
│   ├── useRequirements.ts
│   └── index.ts
│
├── lib/                         # Utilities & helpers
│   ├── pipelineManager.ts
│   └── utils/
│       ├── date.ts              # Date formatting
│       ├── format.ts            # String/number formatting
│       ├── helpers.ts           # General helpers
│       ├── storage.ts           # localStorage utilities
│       ├── validation.ts        # Form validation
│       └── index.ts
│
├── types/                       # TypeScript definitions
│   ├── common.ts                # Shared types
│   ├── home.ts                  # Home page types
│   ├── send-mzigo.ts           # Send package types
│   ├── track-mzigo.ts          # Tracking types
│   ├── profile.ts              # Profile types
│   └── index.ts
│
├── constants/                   # App constants
│   └── site.ts
│
├── public/                      # Static assets
│   ├── images/
│   └── partners/
│
├── middleware.ts                # Next.js middleware
├── next.config.ts
├── tsconfig.json
└── package.json
```

## 🎯 Features

### ✅ Package Management
- Register new packages with partner companies
- Edit existing packages
- Delete packages
- View all registered packages

### ✅ Package Tracking
- Real-time package tracking
- Visual pipeline status
- Tracking number search
- Status updates

### ✅ Partner Integration
- Multiple delivery partners
- Dynamic partner pages
- Partner logos and branding
- Partner-specific requirements

### ✅ User Profile
- View all registered packages
- Edit package details
- Delete packages
- Package history

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.2 (App Router)
- **React:** 19.1.0
- **TypeScript:** 5.x
- **Styling:** Tailwind CSS
- **Package Manager:** pnpm
- **Build Tool:** Turbopack

## 📦 Path Aliases

Configured in `tsconfig.json`:

- `@/components/*` → `./components/*`
- `@/lib/*` → `./lib/*`
- `@/app/*` → `./app/*`
- `@/hooks/*` → `./hooks/*`
- `@/types/*` → `./types/*`
- `@/constants/*` → `./constants/*`

## 🔑 Key Architecture Decisions

### Component Organization
- **ui/shared**: Components used across multiple pages
- **ui/[route]**: Components specific to a single route
- **Index exports**: Clean imports with barrel files

### State Management
- **Custom hooks**: API integration and data fetching
- **localStorage**: Client-side package storage
- **sessionStorage**: Edit state management

### Type Safety
- **Strict TypeScript**: Full type coverage
- **Route-specific types**: Types organized by feature
- **Shared types**: Common interfaces in `types/common.ts`

## � API Routes

- `GET /api/partners` - Fetch all delivery partners
- `GET /api/destinations` - Fetch available destinations
- `GET /api/requirements` - Fetch company-specific requirements
- `POST /api/register-package` - Register new package
- `POST /api/update-package` - Update existing package
- `POST /api/delete-package` - Delete package
- `POST /api/get-packages` - Fetch user packages

## 💾 Storage Strategy

### localStorage
- **Key**: `registeredParcels_{temp_id}`
- **Purpose**: Store registered packages
- **Format**: JSON array of parcels

### sessionStorage
- **Key**: `editingPackage_{package_id}`
- **Purpose**: Temporary edit state
- **Cleanup**: Removed after update

### Cookies
- **Key**: `device_id`
- **Purpose**: Unique device identifier
- **Usage**: API request authentication

## 🎨 UI/UX Features

- Responsive design (mobile-first)
- Bottom navigation for mobile
- Toast notifications
- Confirmation dialogs
- Loading states
- Error handling
- Auto-redirect flows

## � Development Guidelines

### Adding New Components
```typescript
// components/ui/[route]/NewComponent.tsx
export default function NewComponent() { ... }

// components/ui/[route]/index.ts
export { default as NewComponent } from './NewComponent'
```

### Adding New Hooks
```typescript
// hooks/useNewHook.ts
export function useNewHook() { ... }

// hooks/index.ts
export { useNewHook } from './useNewHook'
```

### Adding New Types
```typescript
// types/[feature].ts
export interface NewType { ... }

// types/index.ts
export type { NewType } from './[feature]'
```

## 🔧 Environment Variables

Create `.env.local` with:
```
MZIGO_BASE_URL=your_api_url
```

## 📊 Build Status

✅ All TypeScript checks pass  
✅ Zero compilation errors  
✅ Production build successful  
✅ All routes functional

## 🤝 Contributing

This is a production application. Follow existing patterns for consistency.

## 📄 License

Private - All rights reserved