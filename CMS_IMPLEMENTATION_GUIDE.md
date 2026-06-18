# Content Management System (CMS) - Implementation Guide

## Overview
A complete Content Management System has been integrated into your admin panel with support for articles, pages, and events. The system features rich text editing, image uploads, scheduling, and draft/publish workflows.

## Features Implemented

### 1. **Database Schema**
Three main tables have been created in Supabase:

#### Articles Table
- Full-text content with rich formatting support
- Featured images with alt text
- SEO fields (title, description, keywords)
- Categorization and tagging
- Draft/Published/Archived status
- Scheduled publishing support
- View count tracking
- Row-level security for admin access

#### Pages Table
- Static pages (About, Rules, FAQs, etc.)
- Parent-child page hierarchy
- SEO metadata
- Featured images
- Draft/Published status
- Timestamps for audit trail

#### Events Table
- Match tracking with opponent info, time, and scores
- Tournament management
- Training sessions
- General event support
- Location and registration info
- Status tracking (draft, published, cancelled, archived)
- Event-specific fields for different types

### 2. **Components & Services**

#### Core Services (`lib/services/`)
- `article-service.ts` - CRUD operations for articles with filtering and pagination
- `page-service.ts` - Page management with hierarchy support
- `event-service.ts` - Event and match management
- `media-service.ts` - Image uploads to Vercel Blob with validation

#### UI Components (`components/cms/`)
- **RichTextEditor** - TipTap-based editor with formatting tools
  - Text formatting (bold, italic, strikethrough)
  - Headings (H2, H3)
  - Lists (bullet and numbered)
  - Block quotes
  - Links and image insertion
  - Undo/Redo support

- **ImageUploader** - Drag-and-drop image upload
  - Image preview
  - File validation (10MB max, JPEG/PNG/WebP/GIF)
  - Drag-and-drop support
  - Progress indicator

- **ArticleManager** - Complete article management
  - Create, read, update, delete (CRUD)
  - Search and filter by status/category
  - Bulk publish/archive actions
  - Featured image management
  - SEO metadata fields

- **PageManager** - Static page management
  - Page creation and editing
  - Meta description and keywords
  - Status management (draft/published)

- **EventManager** - Event and match tracking
  - Event type selection (match, tournament, training, other)
  - Match-specific fields (opponent, time, score)
  - Date range support
  - Location tracking

### 3. **Admin Dashboard** (`app/admin/cms/page.tsx`)
Unified CMS interface with three tabs:
- **Articles & News** - Blog and news article management
- **Pages** - Static page management
- **Events & Matches** - Event and match scheduling

## How to Use

### Accessing the CMS
1. Log in to the admin panel with your credentials
2. Navigate to **CMS** section (if available in admin menu)
3. Choose which content type to manage

### Creating an Article
1. Click "New Article" in the Articles tab
2. Fill in the title (slug auto-generates)
3. Upload a featured image
4. Write content using the rich text editor
5. Add category, tags, and SEO information
6. Save as draft or publish immediately
7. Optional: Schedule for future publishing

### Creating a Page
1. Click "New Page" in the Pages tab
2. Enter page title and slug
3. Add featured image if needed
4. Write page content
5. Add meta description for SEO
6. Publish or save as draft

### Creating an Event
1. Click "New Event" in the Events tab
2. Select event type (match, tournament, etc.)
3. Set start and end dates
4. For matches, add opponent and match time
5. Add location and description
6. Publish or save as draft

## Technical Stack

- **Database**: Supabase PostgreSQL with Row-Level Security
- **File Storage**: Vercel Blob for image uploads
- **Rich Text Editing**: TipTap
- **UI Framework**: React with shadcn/ui components
- **Styling**: Tailwind CSS

## Database Migrations

Three migration files have been created:
1. `20260619_create_articles_table.sql` - Articles schema
2. `20260619_create_pages_table.sql` - Pages schema
3. `20260619_create_events_table.sql` - Events schema

These are automatically applied through Supabase migrations.

## Security

- All tables have Row-Level Security (RLS) policies enabled
- Only authenticated admin users can create/edit/delete content
- Public users can only view published content
- Image uploads are validated for type and size

## File Structure

```
components/cms/
├── article-manager.tsx
├── event-manager.tsx
├── image-uploader.tsx
├── page-manager.tsx
└── rich-text-editor.tsx

lib/services/
├── article-service.ts
├── event-service.ts
├── media-service.ts
└── page-service.ts

app/admin/cms/
└── page.tsx

supabase/migrations/
├── 20260619_create_articles_table.sql
├── 20260619_create_events_table.sql
└── 20260619_create_pages_table.sql
```

## Next Steps

1. **Test the CMS** - Create sample articles, pages, and events
2. **Customize Styling** - Adjust colors and fonts in components as needed
3. **Add More Fields** - Extend the database schema for custom requirements
4. **Set Up Webhooks** - Configure content change notifications if needed
5. **Analytics** - Add view tracking and engagement metrics

## Troubleshooting

**Issue**: Images not uploading
- Check Vercel Blob integration is connected
- Verify file size is under 10MB
- Ensure file format is supported (JPEG, PNG, WebP, GIF)

**Issue**: Content not saving
- Check browser console for errors
- Verify Supabase connection and authentication
- Ensure you have admin role in app_users table

**Issue**: Rich text formatting not working
- Clear browser cache
- Try in incognito mode
- Check that TipTap dependencies are installed

## API Reference

### Article Service
```typescript
getArticles(page, limit, filters?)
getArticleBySlug(slug)
getArticleById(id)
createArticle(article)
updateArticle(id, updates)
deleteArticle(id)
publishArticle(id)
archiveArticle(id)
scheduleArticle(id, publishAt)
```

### Page Service
```typescript
getPages(page, limit, filters?)
getPageBySlug(slug)
getPageById(id)
createPage(page)
updatePage(id, updates)
deletePage(id)
publishPage(id)
saveDraftPage(id)
```

### Event Service
```typescript
getEvents(page, limit, filters?)
getEventBySlug(slug)
getEventById(id)
createEvent(event)
updateEvent(id, updates)
deleteEvent(id)
publishEvent(id)
cancelEvent(id)
archiveEvent(id)
updateMatchScore(id, homeScore, awayScore, result)
```

## Support

For issues or questions about the CMS implementation, refer to:
- Supabase documentation: https://supabase.com/docs
- Vercel Blob docs: https://vercel.com/docs/storage/vercel-blob
- TipTap editor: https://tiptap.dev
