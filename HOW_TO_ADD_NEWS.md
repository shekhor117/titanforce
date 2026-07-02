# How to Add News & Updates to Your Website

## Current Status
✅ Website code is complete and ready  
✅ Admin panel is integrated  
✅ News section displays on homepage  
❌ News items table needs to be created in Supabase  

---

## Step 1: Create the News Items Table

### Option A: Using Supabase SQL Editor (Recommended - 5 minutes)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your "titanforce" project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Paste Migration SQL**
   - Copy the entire content from:
     `supabase/migrations/20260702_create_news_items_proper_table.sql`
   
4. **Run the Query**
   - Click the "Run" button (or Cmd/Ctrl + Enter)
   - You should see "Success" message

5. **Verify**
   - Click "Table Editor" in sidebar
   - Look for `news_items` table
   - Should see columns: id, title, content, excerpt, image, category, status, featured, views, author_id, created_at, updated_at

---

## Step 2: Add Your First News Article

### Via Admin Panel (Best for Content)

1. **Login to Admin Panel**
   - Go to: `https://your-site.com/admin`
   - Login with your credentials

2. **Navigate to News Section**
   - Click "News" or go to: `/admin/news`

3. **Create New Article**
   - Click "+ Add News Item" button
   - Fill in the form:
     - **Title**: News headline (e.g., "Team Wins Championship!")
     - **Content**: Full article text (supports markdown)
     - **Excerpt**: Short preview (100-200 chars)
     - **Image**: Upload image or paste URL
     - **Category**: Select from dropdown (e.g., "Club News", "Match Report", "Player Update")
     - **Status**: Set to "Published" (not Draft)
     - **Featured**: Check if you want it on homepage

4. **Publish**
   - Click "Publish" button
   - Article is now live!

### Via Supabase (For Bulk Import)

If you want to add multiple articles at once via Supabase:

1. Go to Table Editor → news_items
2. Click "+ Insert" → "Insert row"
3. Fill in:
   ```
   title: Your news title
   content: Full article content
   excerpt: Short preview
   image: URL to image
   category: Club News
   status: published
   featured: false
   ```

---

## Step 3: View News on Website

### Homepage
- Scroll down on homepage
- See "Latest News" section with up to 4 featured articles

### News Page
- Visit: `/news`
- See all published news articles
- Click article to read full content

### Individual Article
- Click on any news card
- View at: `/news/{article-id}`
- See full content, image, date

---

## Admin Features Available

Once table is created, admin panel supports:

### Create
- New article with all fields
- Set publication status
- Mark as featured
- Add images
- Auto-save drafts

### Edit
- Update existing articles
- Change status (draft → published → archived)
- Modify featured status
- View edit history

### Delete
- Remove articles permanently
- Soft delete to archive

### Manage
- Filter by status (published, draft, archived)
- Filter by category
- Search by title or content
- Sort by date, views, featured
- Bulk actions (coming soon)

### Publish Options
- **Draft**: Hidden from public, only admins see
- **Published**: Visible on website
- **Archived**: Hidden but kept for records

---

## News Section On Website

### Homepage
- Shows top 4 latest published articles
- Grid layout with images
- Category badge
- Publication date
- "View all news" link

### News Page (`/news`)
- All published articles in list
- Search functionality
- Category filters
- Date sorting
- Read time estimate

### Individual Article Page (`/news/{id}`)
- Full article with image
- Author and date info
- Related articles
- Share buttons
- Comments section (if enabled)

---

## Troubleshooting

### "Table doesn't exist" error
- ✓ Run the SQL migration (Step 1)
- ✓ Verify table appears in Table Editor

### News shows "No news available"
- ✓ Create an article in admin panel
- ✓ Make sure status is "Published"
- ✓ Refresh website (F5)

### Images not showing
- ✓ Use full URL (https://example.com/image.jpg)
- ✓ Image must be publicly accessible
- ✓ Supported formats: JPG, PNG, WebP

### Admin panel shows error
- ✓ Make sure you're logged in
- ✓ Check that news_items table exists
- ✓ Verify your user has admin role

---

## Sample News Article

Try creating this sample article first:

**Title:** Titan Force Wins Season Opener  
**Category:** Match Report  
**Content:**
```
Titan Force Mulikandi started their season with a decisive 3-1 victory 
against local rivals. The team showed exceptional form throughout the match, 
with standout performances from our midfield.

Key highlights:
- Strong defensive play in first half
- Clinical finishing in second half  
- Excellent teamwork and positioning

Next match: This Saturday at home
```

**Excerpt:** Titan Force opens season with exciting 3-1 victory  
**Featured:** Yes (to show on homepage)

---

## Full Migration SQL

If the SQL file is missing, here's the complete migration:

```sql
CREATE TABLE IF NOT EXISTS public.news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  category TEXT DEFAULT 'Club News',
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes
CREATE INDEX idx_news_items_status ON public.news_items(status);
CREATE INDEX idx_news_items_created_at ON public.news_items(created_at DESC);

-- Enable RLS
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public can view published news items" ON public.news_items
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admin can manage all news items" ON public.news_items
  USING (auth.jwt() ->> 'role' = 'admin');
```

---

## Next Steps

1. ✅ Create `news_items` table
2. ✅ Add your first news article
3. ✅ Visit homepage to see it live
4. ✅ Create more articles as needed
5. ✅ Mark favorites as featured
6. ✅ Archive old articles when done

---

## Support

If you need help:
1. Check Supabase dashboard for errors
2. Verify table structure in Table Editor
3. Check browser console (F12) for JS errors
4. Review this guide again for each step

**Everything is now ready - just need to add content!** 🚀
