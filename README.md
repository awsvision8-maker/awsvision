# AWS Vision — Client Investment Portal

Global investment platform for **awsvision.com**. Client-facing web application with savings accounts, fixed deposits, portfolio monitoring, monthly statements, and full financial services.

## Features

### Public Website
- Marketing landing page with features, return tiers, and how-it-works
- Sign up / Sign in flows

### Client Portal
- **Dashboard** — Portfolio analytics, advanced charts, recent transactions
- **Accounts** — Savings & Fixed Deposit account management
- **Deposit** — Online deposits via wire, ACH, or card
- **Withdraw** — Withdrawal request placement
- **Portfolio** — Real-time investment monitoring (sectors, regions, holdings)
- **Statements** — Downloadable professional PDF monthly profit statements
- **Credit Cards** — Apply for Platinum, Gold, or Standard cards
- **Loans** — Personal, portfolio-backed, and business loans with calculator
- **Insurance** — Life, health, and investment protection
- **Mortgage** — Multi-step mortgage application with payment calculator

### Onboarding
- Multi-step KYC verification (personal info, address, identity documents)

## Getting Started

```bash
cd awsvision
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Login
Use any email and password on the login page to access the portal with demo data.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts** — Advanced investment charts
- **jsPDF** — Professional PDF statement generation
- **Lucide React** — Icons

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── login/ signup/ kyc/   # Auth flows
│   └── portal/               # Client dashboard & features
├── components/
│   ├── landing/              # Marketing site
│   ├── portal/               # Dashboard sidebar
│   ├── charts/               # Investment charts
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── auth-context.tsx      # Client auth state
│   ├── mock-data.ts          # Demo data
│   └── pdf-generator.ts      # Statement PDF export
└── types/                    # TypeScript definitions
```

## Next Steps

- Owner portal (admin dashboard)
- Branch manager portal
- Backend API & database integration
- Real payment processing & KYC verification
