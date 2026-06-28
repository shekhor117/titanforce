# Database Data Fetch Issue - Solution Guide

## Problem Summary

Website থেকে Supabase database-এ data fetch করা সম্ভব হচ্ছে না।

**Root Cause:** Database schema initialized নয় (0 টেবিল)

---

## Current Status

✅ **Supabase Connected**: সব environment variables সঠিক  
❌ **Database Tables**: 0 / 15 (migrations চলানো হয়নি)  
❌ **Data Fetch**: ব্যর্থ - টেবিল না থাকায়

---

## Solution: Run Database Migrations

আপনাকে 15টি SQL migration file চালাতে হবে Supabase-এ।

### Option 1: CLI Method (Recommended - সবচেয়ে সহজ)

```bash
# Step 1: Install Supabase CLI
npm install -g supabase

# Step 2: Login
supabase login

# Step 3: Link your project
supabase link --project-ref pgfxoajmqhwfpcgxygyr

# Step 4: Push all migrations
supabase db push
```

### Option 2: Dashboard Method (Manual)

1. Visit https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy migration files from `supabase/migrations/` folder one by one
6. Run each file in order (see list below)

---

## Migration Files (In Order)

```
01. 20250505_role_tables.sql
02. 20250516_fix_rls_performance.sql
03. 20260516163423_create_is_admin_rpc.sql
04. 20260517193131_create_gallery_table.sql
05. 20260517195125_create_products_table.sql
06. 20260517195413_create_trophies_table.sql
07. 20260517202759_add_player_ranking_column.sql
08. 20260618_create_app_users_table.sql
09. 20260618_create_contact_messages_table.sql ⚠️ CRITICAL
10. 20260618_create_otp_codes_table.sql
11. 20260618_fix_contact_messages_rls.sql
12. 20260619_create_articles_table.sql
13. 20260619_create_events_table.sql
14. 20260619_create_pages_table.sql
15. 20260628_create_news_updates_table.sql
```

---

## What This Fixes

এই migrations চালানোর পরে:

✅ Contact form কাজ করবে  
✅ Admin dashboard থেকে data save হবে  
✅ Website থেকে সব data fetch হবে  
✅ সব pages সঠিকভাবে display হবে  

---

## Verification

Migrations complete হলে:

1. Website-এ যেকোনো page refresh করুন
2. Data এখন দেখা যাবে
3. Contact form কাজ করবে
4. Admin dashboard fully functional হবে

---

## Admin Migration Page

আপনি এই page-এ যেকোনো সময় গিয়ে instruction দেখতে পারবেন:

```
/admin/migrations
```

---

## Project ID

```
pgfxoajmqhwfpcgxygyr
```

---

## Questions?

Database connection সব setup আছে, শুধু migrations চালানো বাকি আছে।

এটি one-time setup, করলেই সব fix হয়ে যাবে।
