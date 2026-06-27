# NEWS & UPDATES System Setup

## Overview
A complete NEWS & UPDATES management system has been implemented with Supabase integration and an admin panel for managing news updates.

## Database Table Structure

### `news_updates` Table
The following fields are available for news updates:

- **id** (UUID): Unique identifier
- **title** (TEXT): News title (required)
- **content** (TEXT): Full news content (required)
- **summary** (TEXT): Brief summary of the news
- **category** (TEXT): One of:
  - `match_update` - Match related news
  - `transfer_news` - Transfer/player movement news
  - `injury_report` - Player injury updates
  - `general_news` - General team news
  - `announcement` - Official announcements
  
- **priority** (TEXT): Priority level:
  - `low` - Standard news
  - `medium` - Important news (default)
  - `high` - Very important news
  - `urgent` - Critical news requiring immediate attention

- **featured** (BOOLEAN): Mark news as featured on homepage
- **status** (TEXT): Publication status:
  - `draft` - Work in progress
  - `scheduled` - Scheduled for future publishing
  - `published` - Live and visible to public
  - `archived` - Archived but not deleted

- **published_by** (UUID): User ID who published the update
- **scheduled_at** (TIMESTAMP): When to publish if scheduled
- **published_at** (TIMESTAMP): When the news was published
- **image_url** (TEXT): URL to news image
- **image_alt** (TEXT): Alt text for the image
- **views_count** (INTEGER): Number of views
- **created_at** (TIMESTAMP): Creation timestamp
- **updated_at** (TIMESTAMP): Last updated timestamp

## Backend Implementation

### Data Service (`lib/data-service.ts`)

Added `NewsUpdate` interface and methods:

```typescript
// Get news updates
async getNewsUpdates(includeUnpublished = false): Promise<NewsUpdate[]>

// Create a new news update
async createNewsUpdate(update: Omit<NewsUpdate, 'id' | 'created_at' | 'updated_at'>): Promise<NewsUpdate>

// Update an existing news update
async updateNewsUpdate(id: string, updates: Partial<NewsUpdate>): Promise<NewsUpdate>

// Delete a news update
async deleteNewsUpdate(id: string): Promise<void>

// Subscribe to real-time news updates
subscribeToNewsUpdates(callback: DataCallback<NewsUpdate>, onError?: ErrorCallback): () => void
```

## Admin Panel

### Admin Navigation
- Added "News Updates" menu item in the admin sidebar
- Path: `/admin/news-updates`
- Icon: 📰
- Bilingual support (English/Bengali)

### Components

#### NewsUpdatesManager (`components/NewsUpdatesManager.tsx`)
A comprehensive component for managing news updates with features:
- **Create** new news updates with all fields
- **Edit** existing updates
- **Delete** updates
- **Filter** by status and category
- **Search** functionality
- **Form validation**
- Real-time updates via Supabase subscriptions

#### Admin Page (`app/admin/news-updates/page.tsx`)
The main admin page for news management featuring:
- Load all news updates from Supabase
- Add new updates
- Edit existing updates
- Delete updates
- Error handling with retry logic
- Real-time synchronization

## Security Features

### Row Level Security (RLS) Policies
- **Public users**: Can view only published news updates that are not scheduled for future dates
- **Authenticated users**: Can view all published updates
- **Admins/Moderators**: Can create, read, update, and delete all news updates

### Database Indexes
Optimized queries with indexes on:
- `status` - Fast filtering by publication status
- `category` - Quick category-based searches
- `published_at` - Efficient sorting by publication date
- `created_at` - Sorting by creation date
- `featured` - Finding featured news
- `priority` - Filtering by priority level

### Automatic Timestamp Management
- `updated_at` field automatically updates on every change
- Trigger function: `update_news_updates_updated_at()`

## Usage Examples

### From Admin Panel
1. Navigate to `/admin/news-updates`
2. Click "Add News Update" button
3. Fill in the form:
   - Title (required)
   - Content (required)
   - Summary
   - Category
   - Priority
   - Status (draft, scheduled, published, archived)
   - Featured toggle
   - Image URL and alt text
4. Submit to save

### From Code (Backend)
```typescript
import { getDataService } from '@/lib/data-service'

const service = getDataService()

// Create a news update
const newsUpdate = await service.createNewsUpdate({
  title: 'Breaking News',
  content: 'Full news content here...',
  category: 'announcement',
  priority: 'high',
  status: 'published',
  featured: true,
  summary: 'Quick summary',
  image_url: 'https://example.com/image.jpg',
  image_alt: 'Image description',
  views_count: 0
})

// Get all published news
const published = await service.getNewsUpdates(false)

// Get all news including drafts
const all = await service.getNewsUpdates(true)

// Update a news update
await service.updateNewsUpdate(newsUpdate.id, {
  views_count: 100,
  featured: false
})

// Delete a news update
await service.deleteNewsUpdate(newsUpdate.id)

// Subscribe to real-time updates
const unsubscribe = service.subscribeToNewsUpdates(
  (updates) => console.log('News updated:', updates),
  (error) => console.error('Subscription error:', error)
)
```

## Frontend Display (Future Implementation)
To display news on the public website, create a component that:
1. Calls `service.getNewsUpdates(false)` to get published news
2. Filters by `status === 'published'`
3. Sorts by `published_at` in descending order
4. Optionally filters for `featured === true` for homepage highlights

## Files Modified/Created
- ✅ Database: `news_updates` table with RLS policies
- ✅ Data Service: `lib/data-service.ts` - Added NewsUpdate type and CRUD methods
- ✅ Admin Component: `components/NewsUpdatesManager.tsx` - Full CRUD UI
- ✅ Admin Page: `app/admin/news-updates/page.tsx` - Admin interface
- ✅ Sidebar: `components/admin-sidebar.tsx` - Added navigation link
- ✅ Migration: `supabase/migrations/20260628_create_news_updates_table.sql`

## Environment Variables Required
None additional - uses existing Supabase integration

## Next Steps
1. Create a public-facing news feed component to display updates
2. Add filtering and search on the admin panel
3. Implement image upload to Vercel Blob storage
4. Add email notifications when news is published
5. Create RSS feed for news updates
