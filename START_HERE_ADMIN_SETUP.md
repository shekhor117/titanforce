# START HERE: Admin Panel Setup - Quick Reference

## Status Summary

✅ **Login System**: WORKING (not blocked)
⚠️ **Content Display**: Missing migrations applied
✅ **Code**: All fixes in place

---

## Two Things You Need to Do

### 1. CREATE ADMIN USER (2 minutes)

Run this command in terminal:
```bash
node scripts/create-admin.js
```

This creates:
- Email: `admin@titanforce.com`
- Password: `Admin123456!`

**Or manually:**
1. Go to https://app.supabase.com
2. Select your project
3. Click Authentication → Users → Add User
4. Email: `admin@titanforce.com`
5. Password: `Admin123456!`
6. Click Create

### 2. APPLY DATABASE MIGRATIONS (2 minutes)

1. Go to https://app.supabase.com
2. Select your project
3. Click SQL Editor
4. Create new query
5. Open file: `supabase/migrations/20260702_setup_complete_db_schema.sql`
6. Copy ALL content
7. Paste into SQL Editor
8. Click RUN

---

## Test It Works

1. **Admin Login:**
   - URL: `http://localhost:3000/admin/login`
   - Email: `admin@titanforce.com`
   - Password: `Admin123456!`

2. **Admin Dashboard:**
   - After login, you should see dashboard
   - Check Players, Matches, News pages
   - All data should display

3. **Verify Content:**
   - Homepage standings should show
   - Player honours should load
   - Media gallery should work

---

## That's It!

If everything works, you're done. If you see any errors:

1. Check `FIX_LOGIN_AND_CONTENT_ISSUES.md` for detailed troubleshooting
2. Run diagnostic: `node scripts/diagnose-and-fix.js`
3. Review `COMPLETE_ADMIN_SETUP_GUIDE.md` for complete setup

---

## Key Files

**Documentation:**
- `FIX_LOGIN_AND_CONTENT_ISSUES.md` - Detailed guide
- `COMPLETE_ADMIN_SETUP_GUIDE.md` - Full setup reference

**Scripts:**
- `scripts/create-admin.js` - Create admin user
- `scripts/diagnose-and-fix.js` - Check configuration

**Database:**
- `supabase/migrations/20260702_setup_complete_db_schema.sql` - All tables

---

## Common Issues

### "Invalid credentials" on login
→ Create admin user first (see step 1 above)

### Content pages show nothing
→ Apply migrations (see step 2 above)

### "Table not found" errors
→ Run migration from Supabase SQL Editor

---

## Support

All detailed information is in `FIX_LOGIN_AND_CONTENT_ISSUES.md`

Good luck! 🚀
