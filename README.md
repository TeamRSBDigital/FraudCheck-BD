# FraudCheck BD

A mobile-first SaaS-style customer delivery-risk checker for Bangladeshi e-commerce merchants.

FraudCheck BD is designed to query an authorized courier-history API from the server, normalize multi-courier delivery statistics, and present a clear risk-oriented report before a COD order is dispatched.

> Data provider credit: [courier.com.bd](https://courier.com.bd/)  
> Official API documentation: [courier.com.bd/api-docs](https://courier.com.bd/api-docs#endpoints)

## What this project does

- Validates Bangladesh mobile numbers (013–019).
- Keeps the courier API key on the server only.
- Queries one explicitly configured production endpoint.
- Normalizes courier statistics into one consistent report.
- Shows total orders, successful deliveries, cancellations/returns, success rate, and courier breakdown.
- Calculates a deterministic delivery-risk assessment from delivery-history signals.
- Masks the searched phone number in responses and reports.
- Exports and prints merchant reports.
- Enforces a daily free-check quota.
- Supports Upstash Redis REST counters for Vercel/serverless deployments.
- Includes an explicit demo mode for development; demo data is never used silently in production.

## Production trust rules

FraudCheck BD does **not** silently invent courier history when the upstream service fails.

If the production API is unavailable, misconfigured, rate-limited, or rejects the credentials, the UI shows an error. Simulated reports are available only when:

```env
ENABLE_DEMO_MODE="true"
```

Do not enable demo mode when real merchant decisions are being made.

## Tech stack

- React 19
- TypeScript
- Tailwind CSS 4
- Vite 6
- Express / Node.js for local full-stack development
- Vercel Serverless Functions under `/api`
- Optional Upstash Redis REST rate-limit persistence

## Project structure

```text
.
├── api/
│   ├── check.ts
│   ├── health.ts
│   └── rate-limit.ts
├── lib/
│   ├── courier/
│   │   ├── bd-courier.ts
│   │   ├── normalizer.ts
│   │   └── types.ts
│   ├── phone.ts
│   ├── rate-limiter.ts
│   └── risk-engine.ts
├── src/
│   ├── components/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── server.ts
├── vercel.json
└── package.json
```

## Environment variables

Copy the example file for local development:

```bash
cp .env.example .env
```

### Required for live checks

```env
BDCOURIER_API_URL=""
BDCOURIER_API_KEY=""
```

Use the exact endpoint and credential format supplied by the official courier.com.bd API documentation/account.

### API request mapping

These variables make the adapter compatible with the authentication/field names documented by the provider without exposing secrets to the browser:

```env
BDCOURIER_AUTH_HEADER="Authorization"
BDCOURIER_AUTH_SCHEME="Bearer"
BDCOURIER_API_KEY_LOCATION="header"
BDCOURIER_API_KEY_FIELD="api_key"
BDCOURIER_PHONE_FIELD="phone"
BDCOURIER_TIMEOUT_MS="8000"
```

If the official documentation says the key belongs in the JSON body, use:

```env
BDCOURIER_API_KEY_LOCATION="body"
```

and set `BDCOURIER_API_KEY_FIELD` to the documented field name.

### Daily quota

```env
DAILY_FREE_LIMIT="50"
RATE_LIMIT_TIMEZONE_OFFSET_MINUTES="360"
RATE_LIMIT_SALT="generate-a-long-random-secret"
```

The default reset timezone is Bangladesh Standard Time (UTC+6).

### Recommended for Vercel

For a consistent quota across multiple serverless instances:

```env
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
```

Without persistent Redis credentials, local/in-memory counters are used. That is suitable for local development but is not a reliable multi-instance production quota.

## Local development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful endpoints:

```text
GET  /api/health
GET  /api/rate-limit
POST /api/check
```

Example request:

```bash
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"phone":"017XXXXXXXX"}'
```

## Vercel deployment

1. Import `TeamRSBDigital/FraudCheck-BD` into Vercel.
2. Add the production environment variables from `.env.example`.
3. Keep `ENABLE_DEMO_MODE=false`.
4. Add the exact live courier endpoint and API key from your authorized courier.com.bd account.
5. Add Upstash Redis REST credentials if the public 50-check daily quota must be consistent across serverless instances.
6. Deploy and verify:
   - `/api/health`
   - `/api/rate-limit`
   - one known live test number through the checker
   - error handling with an invalid number
   - mobile layout
   - print/PDF export

## Security notes

- API credentials are server-side only.
- The frontend calls only same-origin `/api/*` routes.
- Production no longer falls back to simulated customer history.
- Phone numbers are normalized server-side and masked in returned reports.
- Rate-limit storage keys use an HMAC of the client identifier rather than the raw IP.
- API responses use `no-store` caching.
- The application should be served over HTTPS.
- Never commit `.env`, Vercel secrets, API keys, or Redis tokens.

## Risk-score wording

The application reports delivery-history risk signals; it does not claim that a person is a confirmed fraudster. Courier records can be incomplete or context-dependent, so merchants should use the report as one input in an order-review process.

## License

MIT.
