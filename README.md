# Pario - Golf Performance & Charity Platform

[![Database Schema](/screenshot/home.png)](https://pario-sigma.vercel.app)
**A subscription-driven platform combining golf score tracking, monthly prize draws, and charitable giving.**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Quick Start](#quick-start)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Project Structure](#project-structure)
6. [Database Schema](#database-schema)
7. [Resources](#resources)
8. [FAQ](#faq)
9. [License](#license)

---

## Project Overview

**Pario** is a modern web application designed for golf enthusiasts who want to:

- Track their performance with score management (Stableford format)
- Subscribe monthly or yearly for access
- Participate in monthly prize draws
- Support charities they care about
- View analytics and winnings

### Key Features at a Glance

✅ Subscription system (Stripe)  
✅ Golf score tracking (5-score rolling window)  
✅ Monthly prize draws (3 tiers)  
✅ Charity integration  
✅ Winner verification system  
✅ Admin dashboard  
✅ User dashboard

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account

### Installation (5 minutes)

```bash
# 1. Clone and install
git clone https://github.com/as-ga/pario.git
cd pario
npm install

# 2. Create .env.local
cp .env.example .env.local

# 3. Add credentials to .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 4. Setup database (run queries from db.sql in Supabase)

# 5. Start development server
npm run dev

# 6. Open http://localhost:3000
```

### Test Credentials

- **Email:** mr.gaurav9554@gmail.com
- **Password:** 123456
- **Stripe Card:** 4242 4242 4242 4242 (test mode)

---

## Tech Stack

### Frontend

- **Next.js 16.2.4** - React framework with App Router
- **React 19.2.4** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion 12.38.0** - Animations
- **Zustand 5.0.12** - State management

### Backend

- **Node.js** - Runtime (via Next.js)
- **Supabase** - PostgreSQL database & auth
- **Stripe** - Payment processing

### Deployment

- **Vercel** - Hosting
- **Supabase Cloud** - Database

---

## Features

### 1. Authentication & User Management

- Email/password signup and login
- Supabase Auth with SSR support
- Session persistence via cookies
- Protected routes (dashboard, admin)

**Files:** `proxy.ts`, `app/(auth)/`

### 2. Subscription System

- Monthly and yearly plans
- Stripe payment integration
- Subscription status tracking
- Automatic renewal handling
- Webhook verification

**Flow:**

1. User selects plan at `/dashboard/subscribe`
2. Redirected to Stripe checkout
3. Webhook confirms payment
4. Subscription activated in database

**Files:** `app/api/subscription/`, `lib/stripe.ts`

### 3. Score Management

- Enter up to 5 recent golf scores
- Stableford format (1-45 range)
- One score per date (no duplicates)
- Automatic rolling window (oldest removed when 6th added)
- Edit and delete existing scores

**Rules:**

- Max 5 scores stored
- Scores displayed newest first
- Enforced by database trigger

**Files:** `app/(dashboard)/scores/`, `db.sql`

### 4. Monthly Prize Draws

- Three-tier prize system:
  - **5-Match:** 40% of pool (Jackpot rolls over if unclaimed)
  - **4-Match:** 35% of pool
  - **3-Match:** 25% of pool
- Random or algorithm-based draw logic
- Admin can simulate before publishing
- Prize pool auto-calculated from subscriber count

**Files:** `app/(admin)/admin/draws/`, `db.sql`

### 5. Charity System

- Users select a charity at signup
- Minimum 10% of subscription goes to selected charity
- Users can increase contribution percentage
- Charity directory with search/filter
- Featured charities on homepage

**Files:** `app/(dashboard)/charity/`, `db.sql`

### 6. Winner Verification

- Winners submit proof screenshots
- Admin review and approval system
- Payment status tracking (Pending → Paid)
- Full winner management

**Files:** `app/(admin)/admin/winners/`, `components/dashboard/ProofSubmit.tsx`

### 7. User Dashboard

All features accessible from user dashboard:

- Subscription status and renewal dates
- Score entry and management
- Charity selection and contribution tracking
- Draw participation history
- Winnings overview and payment status

**Files:** `app/(dashboard)/dashboard/`

### 8. Admin Dashboard

Complete platform control:

- User management (view, edit profiles, manage subscriptions)
- Draw management (configure, simulate, publish)
- Charity management (add, edit, delete)
- Winner verification (approve/reject, track payouts)
- Analytics and reporting

**Files:** `app/(admin)/admin/`

---

## Project Structure

```
pario/
├── app/                           # Next.js pages
│   ├── (admin)/                   # Admin routes (protected)
│   │   └── admin/
│   │       ├── charities/
│   │       ├── draws/
│   │       ├── users/
│   │       ├── winners/
│   │       └── page.tsx
│   │
│   ├── (auth)/                    # Auth pages
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── (dashboard)/               # User routes (protected)
│   │   ├── charity/
│   │   ├── dashboard/
│   │   ├── draws/
│   │   ├── scores/
│   │   └── subscribe/
│   │
│   ├── api/                       # API endpoints
│   │   └── subscription/
│   │       ├── create-checkout/route.ts
│   │       └── verify/route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                    # Reusable components
│   ├── dashboard/
│   ├── Provider/
│   └── shared/
│
├── lib/                           # Utilities & config
│   ├── stripe.ts
│   └── supabase.ts
│
├── store/                         # Zustand state
│   └── useUserStore.ts
│
├── types/                         # TypeScript types
│   └── index.ts
│
├── proxy.ts                       # Auth middleware
└── package.json
```

---

## Database Schema

![Database Schema](/screenshot/data-model.png)

## Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run lint            # Check code quality

# Database
supabase login          # Login to Supabase
supabase push           # Push migrations
supabase pull           # Pull schema

# Git
git checkout -b feature/my-feature  # Create branch
git add .
git commit -m "feat: description"
git push origin feature/my-feature
```

---

## FAQ

**Q: How many scores can a user store?**  
A: Maximum 5 most recent scores. Older scores are automatically deleted when a 6th is added.

**Q: Can users change their charity selection?**  
A: Yes, anytime from the dashboard.

**Q: What happens if no one wins the 5-match jackpot?**  
A: The jackpot rolls over to the next month.

**Q: Is payment data stored?**  
A: No, Stripe handles PCI compliance. Credit card data is never stored locally.

**Q: How often are draws executed?**  
A: Monthly, with admin control over timing.

**Q: Can I test payments locally?**  
A: Yes, use Stripe test cards like `4242 4242 4242 4242`.

---

## License

Created by Ashutosh Gaurav. All rights reserved. For inquiries, contact
