# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server at localhost:3000
npm run build        # Production build (also validates types)
npm run lint         # ESLint
npm run db:push      # Push Prisma schema to DB (no migration files)
npm run db:migrate   # Create and apply Prisma migration
npm run db:seed      # Seed database: tsx prisma/seed.ts
npm run db:studio    # Open Prisma Studio GUI
```

After modifying `prisma/schema.prisma`, run `npx prisma generate` to update the client types (also runs automatically on `npm install` via `postinstall`).

## Architecture

**Stack:** Next.js 14 (App Router) + TypeScript + Prisma + PostgreSQL + NextAuth v5 + Tailwind CSS + shadcn/ui

### Authentication (src/lib/auth.ts)
- NextAuth v5 beta with JWT session strategy and Prisma adapter
- Three providers: Google OAuth, Apple Sign-In, and custom OTP/Credentials
- Dev mode: OTP `123456` bypasses real verification for any phone number
- Admin access: phone `1111111111` auto-assigns ADMIN role
- OTP records stored in `OtpVerification` table with expiry
- Page-level auth protection via `auth()` calls in server components (no middleware.ts)

### Database (Prisma)
- Singleton PrismaClient in `src/lib/prisma.ts` (global cache prevents hot-reload duplicates)
- 20+ models with key relationships: User → Orders/Subscriptions/Addresses/Payments
- `DailyMenu` is the pivot model connecting `MenuItem` to a specific date + meal type, with optional `specialPrice` override. Unique constraint on `(date, mealType, menuItemId)`
- `AppSettings` is a single-row config table (id: "default") for tax rates, delivery thresholds, etc.
- Enums: `MealType` (BREAKFAST/LUNCH/DINNER), `DietaryType` (VEG/NON_VEG/VEGAN/EGGETARIAN), `OrderStatus`, `PaymentStatus`, etc.

### Cart (src/context/CartContext.tsx)
- Client-side React Context wrapping the entire app (in root layout)
- Persisted to localStorage (`foodmart_cart` key), loaded on mount
- `addToCart` accepts `Omit<CartItem, "id">` — the id is auto-generated internally
- Cart items reference `dailyMenuId` for duplicate detection and `menuItemId` for the actual dish

### Styling & Theming
- Tailwind with class-based dark mode and HSL CSS variables in `globals.css`
- Three custom color palettes: **saffron** (primary orange), **spice** (warm red), **herb** (green)
- Fonts: **Outfit** for headings (`font-heading`), **Inter** for body (`font-sans`)
- shadcn/ui components live in `src/components/ui/` — add new ones via `npx shadcn@latest add <component>`
- Custom utility classes in globals.css: `.gradient-text`, `.card-hover`, `.page-enter`, `.badge-veg`, `.btn-primary-gradient`

### Route Structure
- **Public:** `/`, `/menu`, `/plans`, `/gift-cards`, `/customize`, `/login`
- **Auth-protected (user):** `/dashboard/*`, `/checkout`, `/referrals`
- **Auth-protected (admin):** `/admin/login` is a separate login page; `/admin/(dashboard)/*` uses a route group with layout that verifies ADMIN role in DB
- **API routes:** `/api/auth/*`, `/api/menu`, `/api/plans`, `/api/orders`, `/api/orders/verify`, `/api/user/address`

### Admin Panel
- Admin pages use a `(dashboard)` route group — the parentheses don't affect URLs, so `/admin/orders` maps to `src/app/admin/(dashboard)/orders/page.tsx`
- Menu management has two levels: **Items Catalog** (`/admin/menu-items`) for CRUD on the global dish database, and **Scheduler** (`/admin/scheduler`) for assigning items to specific dates/meals
- Server Actions pattern: actions defined in `actions.ts` files colocated with pages, using `"use server"` directive

### Payment Flow
- Razorpay integration with simulated fallback when API keys are empty
- Flow: create order via `/api/orders` → Razorpay checkout modal on client → verify signature via `/api/orders/verify`
- Currency is INR; prices formatted with `formatPrice()` from `src/lib/utils.ts`

## Key Conventions

- Path alias: `@/*` maps to `./src/*`
- Server components by default; `"use client"` only when needed for interactivity
- Form submissions use Next.js Server Actions with `useFormStatus` for loading states
- Badge variant `"gradient"` and Button variant `"gradient"` use the saffron-to-spice gradient
- All prices are in INR (₹), formatted with `toLocaleString("en-IN")`
