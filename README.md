# TradeLog Web

A tiny web logger for the TradeLog Android app. Log trades, backtests, accounts,
payouts, journal entries and notes from Chrome — they sync to the phone app via
Supabase (shared Postgres + Storage).

- Single static page (`index.html`) using `@supabase/supabase-js`.
- Auth: email/password (create the user in Supabase → Authentication → Users).
- Images upload to the Supabase `screenshots` storage bucket; rows store the public URL.
- Deployed free via GitHub Pages (`.github/workflows/pages.yml`).

The Supabase URL + anon key are embedded in `index.html` (the anon key is safe to
publish — data is protected by row-level security).
