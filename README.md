# TradeLog Web

React/Vite web logger for the TradeLog Android app. It uses the same Supabase
project, tables, auth, and `screenshots` storage bucket created for app sync.

## What it includes

- RyzeLog-style dark trading SaaS landing page with TradeLog branding.
- Email/password auth through Supabase.
- Signed-in command center with dashboard metrics.
- CRUD views for trades, backtests, accounts, payouts, journal entries, and notes.
- Screenshot/chart uploads to Supabase Storage.
- Position-size calculator for quick risk planning.
- Responsive desktop and mobile layout.

## Supabase

```text
Project URL: https://dhrrugmeyrjgubdjnksa.supabase.co
Auth user: mohamuudh3@gmail.com
```

The anon public key is embedded in `src/supabase.js`. The service-role key is not
used by the web client.

## Development

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

## Production build

```bash
npm run build
```

The static build is written to `dist/`.
