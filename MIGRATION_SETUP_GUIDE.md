# Database Migration Setup Guide

## 🚨 Problem: Schema Cache Error

যখন contact form-ে কোনো বার্তা পাঠানোর চেষ্টা করেন, তখন এই error দেখা যায়:

```
Error submitting message: Failed to save message: 
Could not find the table 'public.contact_messages' in the schema cache
```

### কেন এটি ঘটছে?

- Supabase database **সংযুক্ত আছে** ✅
- কিন্তু **মাইগ্রেশন ফাইল এখনও run হয়নি** ❌
- অর্থাৎ, টেবিল তৈরি হয়নি

---

## ✅ সমাধান: Migrations Run করুন

আপনার Supabase database-এ ১৫টি migration file চালাতে হবে।

### **দ্রুততম উপায়: Supabase CLI**

#### Step 1: CLI ইনস্টল করুন
```bash
npm install -g supabase
```

#### Step 2: Supabase লগইন করুন
```bash
supabase login
```

#### Step 3: প্রজেক্ট লিঙ্ক করুন
```bash
supabase link --project-ref pgfxoajmqhwfpcgxygyr
```

#### Step 4: Migrations পুশ করুন
```bash
supabase db push
```

✨ **এটাই! সব 15 মাইগ্রেশন automatically চলে যাবে।**

---

### **Alternative: Supabase Dashboard থেকে ম্যানুয়ালি**

#### Step 1: Supabase Dashboard খুলুন
[https://app.supabase.com/projects/pgfxoajmqhwfpcgxygyr/editor](https://app.supabase.com/projects/pgfxoajmqhwfpcgxygyr/editor)

#### Step 2: SQL Editor যান
সাইডবারে "SQL Editor" ক্লিক করুন

#### Step 3: নতুন Query তৈরি করুন
"New Query" বাটন ক্লিক করুন

#### Step 4: প্রতিটি মাইগ্রেশন ফাইল কপি করুন
নিচের অর্ডারে প্রতিটি `.sql` ফাইল:

```
supabase/migrations/
├── 20250505_role_tables.sql                          (1)
├── 20250516_fix_rls_performance.sql                  (2)
├── 20260516163423_create_is_admin_rpc.sql            (3)
├── 20260517193131_create_gallery_table.sql           (4)
├── 20260517195125_create_products_table.sql          (5)
├── 20260517195413_create_trophies_table.sql          (6)
├── 20260517202759_add_player_ranking_column.sql      (7)
├── 20260618_create_app_users_table.sql               (8)
├── 20260618_create_contact_messages_table.sql        (9)  ⭐ IMPORTANT
├── 20260618_create_otp_codes_table.sql               (10)
├── 20260618_fix_contact_messages_rls.sql             (11)
├── 20260619_create_articles_table.sql                (12)
├── 20260619_create_events_table.sql                  (13)
├── 20260619_create_pages_table.sql                   (14)
└── 20260628_create_news_updates_table.sql            (15)
```

#### Step 5: প্রতিটি ফাইল চালান
- ফাইল কন্টেন্ট কপি করুন
- SQL Editor-এ paste করুন
- **Run** ক্লিক করুন
- পরবর্তী ফাইলে যান

---

## 🔍 Verification: মাইগ্রেশন চেক করুন

মাইগ্রেশন সফল হয়েছে কিনা তা চেক করার জন্য:

### Supabase Dashboard থেকে:
1. Table Editor খুলুন
2. এই টেবিল গুলি দেখতে পাবেন:
   - ✅ `contact_messages`
   - ✅ `app_users`
   - ✅ `gallery`
   - ✅ `products`
   - ✅ `trophies`
   - ✅ এবং আরও অনেক...

### Project ID
**pgfxoajmqhwfpcgxygyr**

---

## ❓ Troubleshooting

### সমস্যা: "Project not found"
**সমাধান:** Project ID সঠিক আছে কিনা চেক করুন:
```bash
supabase projects list
```

### সমস্যা: "Already exist" ত্রুটি
**সমাধান:** এই ত্রুটি দেখা মানে মাইগ্রেশন ইতিমধ্যে run হয়েছে। এটি ঠিক আছে, পরবর্তী ফাইলে যান।

### সমস্যা: মাইগ্রেশনের পর contact form এখনও কাজ করছে না
**সমাধান:** 
1. Page refresh করুন (Ctrl+R বা Cmd+R)
2. 30 সেকেন্ড অপেক্ষা করুন (schema cache আপডেট হতে সময় লাগে)
3. পুনরায় চেষ্টা করুন

---

## 📋 After Successful Migration

মাইগ্রেশন সফল হলে:

✅ **Contact Form কাজ করবে**
- বার্তা Supabase ডাটাবেস-এ সংরক্ষিত হবে
- Schema cache error আর দেখা যাবে না

✅ **অন্যান্য Features কাজ করবে**
- Gallery page
- Products page
- User management
- এবং অন্যান্য...

---

## 🆘 Help

যদি কোনো সমস্যা হয়:

1. **Setup Database Page** ভিজিট করুন:
   - URL: `/setup-database`
   - এখানে বিস্তারিত ধাপ আছে

2. **Console error চেক করুন**:
   - Browser Developer Tools খুলুন (F12)
   - Console ট্যাব যান
   - Error message দেখুন

3. **Support**:
   - Supabase Issues: https://github.com/supabase/supabase/issues
   - v0 Support: https://vercel.com/help

---

**Happy coding! 🚀**
