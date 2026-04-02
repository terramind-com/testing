# Terramind Testing App

A Node.js/Express API used for testing Terramind automations.

## Setup

```bash
npm install
npm run dev
```

## API Endpoints

- `GET /health` — Health check
- `GET /api/users` — List users
- `POST /api/users` — Create user
- `GET /api/users/:id` — Get user
- `PATCH /api/users/:id` — Update user
- `DELETE /api/users/:id` — Delete user
- `POST /api/payments` — Process payment
- `POST /api/payments/:id/refund` — Refund payment
- `GET /api/products` — List products
- `POST /api/products` — Create product
- `PATCH /api/products/:id/stock` — Update product stock

## Architecture

```
src/
├── index.ts              # Express app entry point
├── api/                  # Route handlers
│   ├── users.ts
│   ├── payments.ts
│   └── products.ts
├── models/               # Data models
│   ├── user.ts
│   └── product.ts
├── services/             # Business logic
│   ├── data-service.ts
│   └── notification-service.ts
├── payment/              # Payment processing
│   ├── service.ts
│   └── validator.ts
├── utils/                # Utilities
│   ├── data-processor.ts
│   └── formatters.ts
└── middleware/            # Express middleware
    ├── error-handler.ts
    └── request-logger.ts
```
