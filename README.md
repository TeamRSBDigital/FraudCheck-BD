# FraudCheck BD — Customer Delivery Risk Checker

A production-ready, mobile-first web application designed for Bangladeshi e-commerce merchants to assess customer delivery risk before dispatching Cash-on-Delivery (COD) orders.

FraudCheck BD connects with the authorized BD Courier API to cross-reference delivery history across major Bangladeshi logistics networks including **SteadFast, Pathao, RedX, Paperfly, CourierFast, and CarryBee**.

---

## Features

- **Mobile-First SaaS Experience:** Designed with a clean, high-contrast, professional interface optimized from 320px screens up to large ultra-wide monitors.
- **Strict Data Privacy:** Phone numbers are masked in all client responses (`01*******89`), never logged unnecessarily, and never stored permanently in public directories.
- **Deterministic Risk Engine:** Transparent scoring model (0–100) evaluating delivery completion ratio, return frequency, cancellation frequency, and multi-courier coverage.
- **Zero Client-Side Secrets:** All courier API calls, authorization tokens, and validation checks are executed strictly server-side.
- **Server-Enforced Rate Limiting:** 50 free checks per user/IP per calendar day enforced at the API layer with pluggable storage (in-memory or Redis).
- **Graceful States:** Comprehensive UI states for Submitting, Step-by-Step Progress Loading, Low/Medium/High Risk, No Records Found, Daily Limit Reached, and API Error Recovery.

---

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Google Fonts (DM Sans & Plus Jakarta Sans).
- **Backend:** Express & Node.js, Vercel Serverless Function handlers (`/api/check`, `/api/health`, `/api/rate-limit`).
- **Build Tool:** Vite 6, esbuild, tsx.

---

## Project Structure

```text
├── api/                   # Vercel Serverless Function endpoints
│   ├── check.ts           # POST /api/check route handler
│   └── health.ts          # GET /api/health route handler
├── lib/
│   ├── courier/
│   │   ├── bd-courier.ts  # BD Courier API client & isolated dev sandbox
│   │   ├── normalizer.ts  # Universal courier response normalizer
│   │   └── types.ts       # Courier schemas and provider interfaces
│   ├── phone.ts           # Bangladesh mobile number normalization & privacy masking
│   ├── rate-limiter.ts    # Reusable rate limiting abstraction (memory / Redis)
│   └── risk-engine.ts     # Deterministic delivery risk assessment engine
├── src/
│   ├── components/
│   │   ├── AboutModal.tsx       # About & mission modal
│   │   ├── CheckerForm.tsx      # Phone input with Bangladesh prefix & validation
│   │   ├── CourierCard.tsx      # Courier card with orders, returns, success rate
│   │   ├── CourierGrid.tsx      # Responsive courier breakdown grid
│   │   ├── EmptyState.tsx       # "No courier history found" state
│   │   ├── ErrorState.tsx       # Friendly error handling state with retry
│   │   ├── Footer.tsx           # SaaS footer with terms, privacy & quota
│   │   ├── HowItWorksModal.tsx  # Detailed explanation of COD risk in Bangladesh
│   │   ├── LegalModal.tsx       # Privacy policy, Terms of service & Contact form
│   │   ├── LoadingState.tsx     # Step-by-step progress checklist & skeletons
│   │   ├── Navbar.tsx           # Header with real-time remaining checks pill
│   │   ├── RateLimitBanner.tsx  # Daily 50-check limit reached banner
│   │   ├── RiskIndicators.tsx   # Transparent signal breakdown
│   │   ├── RiskScoreCard.tsx    # Delivery Risk Score (0-100) and verdict card
│   │   └── SummaryStats.tsx     # Aggregate orders, delivered, returned, cancelled
│   ├── types/
│   │   └── index.ts             # Shared TypeScript models and interfaces
│   ├── App.tsx                  # Main application dashboard
│   ├── index.css                # Tailwind CSS v4 styling
│   └── main.tsx                 # React entry point
├── server.ts              # Full-stack Node.js Express server + Vite middleware
├── vercel.json            # Vercel deployment configuration
├── .env.example           # Environment variables declaration
└── package.json           # Scripts and dependencies
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Required | Description |
| :--- | :---: | :--- |
| `BDCOURIER_API_URL` | Optional | BD Courier API endpoint (defaults to `https://api.bdcourier.com/courier-check`). |
| `BDCOURIER_API_KEY` | Optional | Your authorized BD Courier API key/bearer token. If omitted or left blank, the app safely runs in an isolated development sandbox mode with realistic test profiles. |
| `DAILY_FREE_LIMIT` | Optional | Free checks per IP per calendar day (default: `50`). |
| `REDIS_URL` | Optional | Redis connection string (e.g. `rediss://default:token@...upstash.io`). If omitted, uses high-performance in-memory tracking. |
| `VITE_SITE_NAME` | Optional | Site name branding (default: `FraudCheck BD`). |

---

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server (runs full-stack Express + Vite on port 3000):
```bash
npm run dev
```

3. Open your browser at [http://localhost:3000](http://localhost:3000).

---

## Vercel Deployment

FraudCheck BD is natively architected for zero-configuration Vercel deployment:

1. Push your repository to **GitHub**.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add:
   - `BDCOURIER_API_KEY` = *your_production_api_key*
   - `BDCOURIER_API_URL` = *https://api.bdcourier.com/courier-check* (or provider endpoint)
   - `DAILY_FREE_LIMIT` = `50`
   - `REDIS_URL` = *optional Redis connection string for multi-region serverless caching*
5. Click **Deploy**.

---

## Security & Privacy Compliance

- **No Defamatory Labeling:** FraudCheck BD displays delivery risk scores and courier performance metrics strictly based on recorded courier actions. It never declares a customer as a confirmed "fraudster".
- **Zero Plaintext Exfiltration:** Customer phone numbers are masked (`01*******89`) before leaving the server.
- **Server-Side Proxy:** Credentials and external endpoints are never visible in browser network inspector tabs.

---

## License

MIT License. Designed for Bangladesh e-commerce merchants.
