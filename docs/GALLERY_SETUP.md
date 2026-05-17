# Gallery Setup Guide

## Overview

The gallery system is now integrated with Supabase storage and database. All gallery data is stored in the `gallery` table, and images are stored in the `Gallery` storage bucket.

## Components

### 1. **Database Table: `gallery`**
Location: Supabase PostgreSQL
- `id`: UUID (Primary Key)
- `title`: Text (Required)
- `description`: Text
- `image_url`: Text (Required)
- `type`: Enum ('match', 'team-events', 'training', 'merchandise', 'news')
- `is_featured`: Boolean (Default: false)
- `uploaded_by`: UUID (Foreign Key to profiles)
- `created_at`: Timestamp
- `updated_at`: Timestamp

### 2. **Storage Bucket: `Gallery`**
- **Location**: Supabase Storage
- **Public**: Yes (anyone can view)
- **Access**: Admin-only upload/modify/delete

### 3. **Gallery Data Service**
Location: `/lib/gallery-data-service.ts`

**Key Methods:**
- `getGalleryItems(type?)` - Fetch all items or by type
- `getFeaturedItems(limit)` - Fetch featured items
- `getItemById(id)` - Fetch single item
- `addItem(item, userId)` - Add new item
- `updateItem(id, updates)` - Update item
- `deleteItem(id)` - Delete item
- `toggleFeatured(id)` - Toggle featured status
- `searchItems(query)` - Search items
- `uploadGalleryImage(file, fileName)` - Upload image to storage
- `deleteGalleryImage(filePath)` - Delete image from storage

### 4. **Row Level Security (RLS) Policies**

**Gallery Table:**
- **SELECT**: Public (anyone can view)
- **INSERT**: Admin users only
- **UPDATE**: Admin users only
- **DELETE**: Admin users only

**Storage Bucket:**
- **View**: Public
- **Upload**: Admin users only
- **Update**: Admin users only
- **Delete**: Admin users only

## How to Use

### Adding Gallery Items (Admin)

1. Go to `/admin/gallery`
2. Click "Add New" button
3. Fill in the form:
   - Title
   - Description
   - Image (file upload)
   - Type (match, team-events, training, merchandise, news)
   - Mark as Featured (checkbox)
4. Submit

The image will be automatically uploaded to the `Gallery` bucket and the item will be added to the database.

### Viewing Gallery

Users can view the gallery in two places:
- **Homepage**: Featured items in the gallery showcase
- **Gallery Page**: `/gallery` - Full gallery with filters and search

### Managing Gallery Items

Admin features:
- Toggle featured status
- Delete items
- Search and filter by type
- View statistics

## Initial Data

To seed the gallery with sample data, call the API endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/gallery/seed
```

This will add 6 sample gallery items if the gallery is empty.

## RLS Setup Summary

Both the `gallery` table and `storage.objects` have RLS enabled:

- **Admin checks** use: `auth.uid() IN (SELECT id FROM public.profiles WHERE position = 'admin')`
- **Public access** is allowed for viewing only
- **Modifications** require admin status

## Environment Variables

Ensure these are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Error Handling

- File uploads must be valid image files
- Gallery items require a title and image
- Admin users are determined by the `position` field in the profiles table
- Network errors are logged to console

## Future Enhancements

Possible improvements:
- Image compression and optimization
- Batch upload
- Gallery albums/collections
- Rating/comments system
- Analytics tracking
- CDN integration
