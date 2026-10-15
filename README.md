# CareBook — Telehealth Booking & Payments Platform

A portfolio-ready starter implementation using Next.js App Router, TypeScript, PostgreSQL (via Prisma), Razorpay order creation/webhook verification, and Twilio SMS notifications.

> This is a runnable starter scaffold, not a production-certified telehealth system. The resume metrics supplied in the project brief are not independently verified by this code. Do not use real patient data or production payments until security, privacy, compliance, and operational reviews are complete.

## Requirements
- Node.js 20+
- PostgreSQL 14+
- Razorpay test account keys (optional for local development)
- Twilio credentials (optional; notifications log to console if unset)

## Setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL`.
2. Install and generate:
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate dev --name init
   npm run dev
   ```
3. Open http://localhost:3000.

## Available routes
- `/` — landing page and booking form
- `POST /api/bookings` — create a booking
- `POST /api/payments/order` — create a Razorpay order (test credentials required)
- `POST /api/payments/webhook` — verify Razorpay webhook signature
- `POST /api/notifications/sms` — send SMS through Twilio when configured

## Security notes
- Keep secrets server-side; never expose Razorpay secret or webhook secret to the browser.
- Configure Razorpay webhook signing secret separately from API secret.
- Add authentication, authorization, rate limiting, audit logs, consent flows, data retention policies, and jurisdiction-specific health/privacy compliance before production use.
