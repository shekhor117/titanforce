# News Section - Setup & Fix Guide

## Problem
News and updates are not showing on the website. The "Latest News" section displays "No news available" even after data is added through the admin panel.

## Root Cause
The `news_items` table hasn't been created in the Supabase database yet. The application code is correct and ready to fetch news, but there's no table to query from.

## Solution (3 Steps, 5 Minutes)

### Step 1: Go to Supabase Console
1. Visit: https://supabase.com/dashboard
2. Select your "titanforce" project
3. Click on "SQL Editor" in the left sidebar
4. Create a new query

### Step 2: Run the News Items Table Migration
Copy the entire SQL from:
`supabase/migrations/20260702_create_news_items_proper_table.sql`

Paste it into the SQL Editor and click "Run" button.

This migration will:
- Create the `news_items` table with all required columns
- Add proper indexing for fast queries
- Enable Row Level Security (RLS)
- Set up admin permissions to create/update/delete news
- Allow public to view published news

### Step 3: Add News Through Admin Panel
1. Go to your website's admin panel: `https://your-site.com/admin/news`
2. Click "Add News Item"
3. Fill in:
   - **Title**: News headline
   - **Content**: Full article text
   - **Excerpt**: Short preview (optional)
   - **Image**: Upload or paste image URL
   - **Category**: Select category (e.g., "Club News", "Match Report", etc.)
   - **Status**: Set to "Published"
   - **Featured**: Check if you want to feature it
4. Click "Publish"

### Step 4: View on Website
The news will immediately appear in:
- Homepage "Latest News" section (top 4 items)
- Full news page: `/news`
- Individual news article: `/news/{article-id}`

## File Changes Made

### Code Updates
- Updated `NewsItem` interface in `lib/data-service.ts` to match Supabase schema
- Added proper error handling for missing `news_items` table
- Improved error messages to guide users

### New Migration
- `supabase/migrations/20260702_create_news_items_proper_table.sql` - Creates the `news_items` table

## Table Structure

```
news_items:
  id (UUID) - Primary key
  title (TEXT) - Article title
  content (TEXT) - Full article content
  excerpt (TEXT) - Short preview
  image (TEXT) - Image URL
  category (TEXT) - Category name
  status (enum) - draft | published | archived
  featured (BOOLEAN) - Featured article flag
  views (INTEGER) - View count
  author_id (UUID) - Author reference
  created_at (TIMESTAMP) - Creation date
  updated_at (TIMESTAMP) - Last update date
```

## Admin Features

Once the table is created, the admin panel will allow you to:
- Create new news articles
- Edit existing articles
- Delete articles
- Set publish status (draft/published/archived)
- Mark articles as featured
- Track view counts
- Filter by category and status
- Search articles by title or content

## Website Features

Users will be able to:
- View latest news on homepage
- Browse all news on `/news` page
- Read full articles on individual news pages
- Search news articles
- Filter by category
- Sort by date

## Troubleshooting

### "No news available" persists after setup
1. Verify the table was created:
   - Go to Supabase console
   - Click "Table Editor"
   - Look for `news_items` table
2. Check if you published any articles:
   - Go to admin panel `/admin/news`
   - Verify status is set to "published"

### Admin panel shows error
- Make sure the `news_items` table exists
- Check that RLS policies are in place
- Verify your user has admin role

### News doesn't appear immediately
- Refresh the page (cache is 30 seconds)
- Check browser console for errors (F12)
- Verify article status is "published"

## Quick Links
- Admin Panel: `/admin/news`
- News Page: `/news`
- Supabase: https://supabase.com/dashboard
- Migration File: `supabase/migrations/20260702_create_news_items_proper_table.sql`

---

**Status**: Ready to deploy  
**Last Updated**: 2026-07-02  
**Next Steps**: Run the migration and add your first news article!
