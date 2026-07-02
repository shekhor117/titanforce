# Titan Force Admin CRUD - Quick Reference Guide

## 🚀 Quick Start (2 Steps)

### Step 1: Apply Database Migrations
```bash
npx supabase db push
```

### Step 2: Login to Admin Panel
```
URL: http://localhost:3000/admin/login
```

---

## 📋 All 25 CRUD Modules

### 1. **Players** ⚽
- **API:** `/api/admin/players`
- **Page:** `/admin/players`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Name, Position, Number, Jersey, Bio

### 2. **News Updates** 📰
- **API:** `/api/admin/news`
- **Page:** `/admin/news`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Title, Content, Category, Status, Priority

### 3. **Matches** 🏟️
- **API:** `/api/admin/matches`
- **Page:** `/admin/matches`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Opponent, Date, Result, Status

### 4. **Products** 🛍️
- **API:** `/api/admin/store/products`
- **Page:** `/admin/store/products`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Name, Price, Stock, Category, Image

### 5. **Orders** 📦
- **API:** `/api/admin/store/orders`
- **Page:** `/admin/store/orders`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Customer, Items, Total, Status

### 6. **Inventory** 📊
- **API:** `/api/admin/inventory`
- **Page:** `/admin/inventory`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Product, Quantity, Location, SKU

### 7. **Fans** 👥
- **API:** `/api/admin/fans`
- **Page:** `/admin/fans`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Name, Email, Membership, Joined Date

### 8. **Standings** 📈
- **API:** `/api/admin/standings`
- **Page:** `/admin/standings`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Team, Points, Wins, Losses, Position

### 9. **Injuries** 🏥
- **API:** `/api/admin/injuries`
- **Page:** `/admin/injuries`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Player, Injury, Severity, Return Date

### 10. **Trophies** 🏆
- **API:** `/api/admin/trophies`
- **Page:** `/admin/trophies`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Name, Year, Category, Image

### 11. **Partners** 🤝
- **API:** `/api/admin/partners`
- **Page:** `/admin/partners`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Name, Logo, Website, Agreement

### 12. **Rankings** 🥇
- **API:** `/api/admin/rankings`
- **Page:** `/admin/rankings`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Player, Position, Points, Games

### 13. **Gallery** 📸
- **API:** `/api/admin/media`
- **Page:** `/admin/gallery`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Title, Image, Album, Date

### 14. **Lineup** 🎯
- **API:** `/api/admin/lineup`
- **Page:** `/admin/lineup`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Formation, Players, Match Date

### 15. **Man of the Match** ⭐
- **API:** `/api/admin/motm`
- **Page:** `/admin/motm`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Player, Match, Score, Match Date

### 16. **Contacts** 💬
- **API:** `/api/admin/contacts`
- **Page:** `/admin/contacts`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Name, Email, Message, Status

### 17. **Analytics** 📊
- **API:** `/api/admin/analytics`
- **Page:** `/admin/analytics`
- **Operations:** Read
- **Fields:** Views, Engagement, Conversion

### 18. **Settings** ⚙️
- **API:** `/api/admin/settings`
- **Page:** `/admin/settings`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Key, Value, Description

### 19. **Users** 👤
- **API:** `/api/admin/users`
- **Page:** `/admin/users`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Email, Role, Status, Joined

### 20. **Features** ✨
- **API:** `/api/admin/features`
- **Page:** `/admin/features`
- **Operations:** Create, Read, Update, Delete
- **Fields:** Name, Enabled, Version

### 21. **News Updates (Alt)** 📝
- **API:** `/api/admin/news-updates`
- **Page:** `/admin/news-updates`
- **Operations:** Create, Read, Update, Delete

### 22. **Migrations** 🔄
- **Page:** `/admin/migrations`
- **Operations:** View, Apply

### 23. **System** 🖥️
- **Page:** `/admin/system`
- **Operations:** View, Manage

### 24. **CMS** 📄
- **Page:** `/admin/cms`
- **Operations:** Manage content

### 25. **Features Management** 🎯
- **Page:** `/admin/features`
- **Operations:** Enable/Disable

---

## 🔐 Authentication

### Login
```
URL: http://localhost:3000/admin/login
Method: Email + Password
```

### Default Test Account
```
Email: admin@titanforce.com (if seeded)
Password: (set during signup)
```

### Roles
- **Admin**: Full system access
- **Moderator**: Limited admin access
- **User**: Regular access

---

## 📡 API Response Format

### Success (200 OK)
```json
{
  "data": [...],
  "message": "Operation successful",
  "status": "success"
}
```

### Error (400/401/500)
```json
{
  "error": "Error message",
  "status": "error"
}
```

---

## 🧪 Testing CRUD Operations

### Test 1: Create
```bash
curl -X POST http://localhost:3000/api/admin/players \
  -H "Content-Type: application/json" \
  -d '{"name":"John","position":"Forward","number":9}'
```

### Test 2: Read
```bash
curl http://localhost:3000/api/admin/players
```

### Test 3: Update
```bash
curl -X PUT http://localhost:3000/api/admin/players/id \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'
```

### Test 4: Delete
```bash
curl -X DELETE http://localhost:3000/api/admin/players/id
```

---

## 🛠️ Development Workflow

### 1. Run Dev Server
```bash
npm run dev
```

### 2. Apply Migrations (if not done)
```bash
npx supabase db push
```

### 3. Create Admin User
- Navigate to `/admin/signup`
- Complete the form
- System assigns admin role

### 4. Test CRUD Operations
- Login at `/admin/login`
- Navigate to any module
- Create, Read, Update, Delete

### 5. Verify in Database
```bash
# Connect to Supabase and verify data
```

---

## 📁 File Structure

```
/app/api/admin/
├── players/route.ts
├── news/route.ts
├── matches/route.ts
├── store/
│   ├── products/route.ts
│   ├── orders/route.ts
│   └── inventory/route.ts
├── fans/route.ts
├── standings/route.ts
├── injuries/route.ts
├── trophies/route.ts
└── ... (20+ more)

/app/admin/
├── players/page.tsx
├── news/page.tsx
├── matches/page.tsx
├── store/
│   ├── products/page.tsx
│   ├── orders/page.tsx
│   └── inventory/page.tsx
├── fans/page.tsx
└── ... (30+ pages)

/supabase/migrations/
├── 20250505_role_tables.sql
├── 20260517195125_create_products_table.sql
├── 20260628_create_news_updates_table.sql
└── ... (12+ more)
```

---

## 🔧 Common Tasks

### Create a New Player
1. Go to `/admin/players`
2. Click "Add Player"
3. Fill form (Name, Position, Number)
4. Click "Create"

### Create a News Item
1. Go to `/admin/news`
2. Click "New Article"
3. Enter Title, Content, Category
4. Set as Draft or Publish
5. Click "Save"

### Create a Product
1. Go to `/admin/store/products`
2. Click "New Product"
3. Fill details (Name, Price, Stock)
4. Upload image
5. Click "Create"

### Manage Orders
1. Go to `/admin/store/orders`
2. View all orders
3. Click order to view details
4. Update status (Processing → Shipped)
5. Mark as complete

---

## ⚠️ Important Notes

### Before Testing
- Run `npx supabase db push` first
- Create admin account
- Ensure Supabase is configured

### Database
- All tables use UUID primary keys
- Timestamps auto-updated
- RLS policies restrict access
- Soft deletes where applicable

### Authentication
- Token-based via Supabase
- Session persists in browser
- Protected routes redirect to login
- Logout clears session

---

## 🚨 Troubleshooting

### "Table not found" Error
→ Run: `npx supabase db push`

### "Unauthorized" Error
→ Login at `/admin/login` first

### "500 Internal Error"
→ Check browser console and server logs

### Migration Failed
→ Check Supabase dashboard for errors
→ Run migrations manually via SQL editor

---

## 📞 Getting Help

### Documentation
- Full report: `CRUD_SYSTEM_TEST_REPORT.md`
- This guide: `CRUD_QUICK_REFERENCE.md`

### Admin Pages
- Migrations: `/admin/migrations`
- Setup: `/setup/migrations`

### Console Logs
- Browser: F12 → Console tab
- Server: Check terminal output

---

**Last Updated:** July 2, 2026  
**Status:** ✓ Fully Configured | ⚠ Awaiting Migration
