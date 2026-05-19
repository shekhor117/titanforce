# Gallery Upload System Guide

## Overview

The Titan Force gallery system provides complete image upload and management functionality with Supabase Storage integration. Admins can upload, organize, and manage gallery images through the admin panel, and changes automatically sync to the website in real-time.

## Architecture

### Storage Structure

```
Supabase Storage Bucket: "Gallery"
├── images/
│   ├── {timestamp}-{filename}.jpg
│   ├── {timestamp}-{filename}.png
│   └── ...
```

### Database Table: `gallery`

```sql
CREATE TABLE gallery (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  type TEXT NOT NULL, -- 'match' | 'team-events' | 'training' | 'merchandise' | 'news'
  is_featured BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

## Gallery Types

- **Match**: Images from match days
- **Team Events**: Team gatherings, celebrations
- **Training**: Practice sessions, training drills
- **Merchandise**: Product photos, jerseys, gear
- **News**: News article images

## Admin Gallery Management

### Access

Navigate to: `/admin/gallery`

### Features

#### 1. Upload Images
- Click "Add New" button
- Fill in form:
  - **Title**: Image title (required)
  - **Description**: Image details (optional)
  - **Image**: Select image file (required, any image format)
  - **Type**: Choose category
  - **Mark as Featured**: Toggle to feature on homepage

#### 2. Search and Filter
- **Search**: Text search by title or description
- **Filter**: Filter by gallery type (Match, Team Events, etc.)

#### 3. Manage Images
- **View Stats**: See total, featured, and by-type counts
- **Toggle Featured**: Click star icon to mark/unmark as featured
- **Delete**: Remove images with confirmation

#### 4. Real-time Sync
- Changes instantly appear on website gallery
- Featured items immediately update on homepage
- No page refresh needed

## Gallery Upload Service

### Methods

```typescript
// Upload image to Supabase Storage
uploadGalleryImage(file: File, fileName: string): Promise<string | null>
// Returns public URL of uploaded image

// Add gallery item to database
addItem(item: GalleryItemData, userId?: string): Promise<GalleryItem | null>

// Get all gallery items
getGalleryItems(type?: GalleryType): Promise<GalleryItem[]>

// Get featured items
getFeaturedItems(limit: number): Promise<GalleryItem[]>

// Update gallery item
updateItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem | null>

// Delete gallery item
deleteItem(id: string): Promise<boolean>

// Toggle featured status
toggleFeatured(id: string): Promise<boolean>

// Search items
searchItems(query: string): Promise<GalleryItem[]>

// Delete image from storage
deleteGalleryImage(filePath: string): Promise<boolean>
```

## Website Gallery Display

### Gallery Showcase Component

Located at: `components/gallery-showcase.tsx`

Features:
- Carousel display of featured items
- Auto-refresh from realtime subscriptions
- Responsive grid layout
- Bilingual support (English/Bengali)

### Real-time Updates

```typescript
const { mediaItems, loading, error } = useMediaItems()
// Automatically syncs when admin uploads new images
```

## Upload Flow

```
Admin Panel
    ↓
1. Select Image File
    ↓
2. Upload to Supabase Storage (Gallery bucket)
    ↓
3. Get Public URL from Supabase
    ↓
4. Save Gallery Item to Database
    ↓
5. Realtime Event Triggered
    ↓
6. Website Refreshes Data
    ↓
7. Gallery Component Updates
    ↓
8. Users See New Image Instantly
```

## Image Optimization

### Recommended Sizes

- **Match Photos**: 800x600px or larger
- **Team Events**: 1200x800px for banners
- **Training**: 1024x768px
- **Merchandise**: 600x600px for products
- **News**: 800x600px

### Supported Formats

- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)
- GIF (.gif)

### File Size

- Limit: 50MB per file (Supabase bucket setting)
- Recommended: 2-5MB for web optimization

## Bilingual Support

The admin gallery page is fully bilingual:

**English**: Default language
**Bengali**: Automatic translation for all UI elements

Switch language using the language selector in the admin header.

## Storage Configuration

### Supabase Bucket Settings

Bucket: `gallery`
- **Policies**: 4 policies for authenticated access
- **File Size Limit**: Unset (50 MB default)
- **Allowed MIME Types**: Any

### RLS Policies

```sql
-- Admins can upload
CREATE POLICY "Admins upload"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'admin')

-- Public can view
CREATE POLICY "Public read"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery')
```

## Troubleshooting

### Image Upload Fails

**Issue**: "Failed to upload image"
- Check file size (< 50MB)
- Verify file format is supported
- Ensure Supabase Storage is configured
- Check bucket permissions

### Images Not Appearing

**Issue**: Gallery page shows no images
- Verify images are uploaded to Supabase Storage
- Check gallery database records exist
- Clear browser cache
- Check browser console for errors

### Realtime Sync Not Working

**Issue**: New images don't appear on website
- Verify Supabase realtime is enabled
- Check WebSocket connection in browser DevTools
- Restart dev server
- Check browser console for subscription errors

### Featured Items Not Updating

**Issue**: Featured toggle doesn't update website
- Ensure database update succeeded
- Check realtime subscription is active
- Verify component uses `useMediaItems()` hook

## Best Practices

1. **Use Descriptive Titles**: Help organize and search images
2. **Add Descriptions**: Provides context for images
3. **Select Appropriate Type**: Helps categorize and filter
4. **Mark Best Images as Featured**: Homepage rotates featured items
5. **Optimize Images**: Resize before upload for faster loading
6. **Organized Naming**: Use consistent naming convention (date-type-description)

## Examples

### Uploading a Match Photo

1. Go to Admin → Gallery
2. Click "Add New"
3. Fill form:
   - Title: "Titan Force vs Rivals - Goal Moment"
   - Description: "Crucial winning goal in championship match"
   - Image: Select match-photo.jpg
   - Type: Match
   - Featured: Check to show on homepage
4. Click "Add"
5. Image appears instantly on website

### Creating Featured Gallery

1. Upload 5-6 high-quality images
2. Mark each as "Featured"
3. Homepage carousel automatically rotates them
4. Images update in real-time as you add more

## Performance

- Images stored in Supabase CDN (global distribution)
- Public URLs cached by browsers
- Realtime syncs only when images change
- No impact on page load time

## Limits

- File size: 50MB per image
- Gallery items: No limit
- Concurrent uploads: 1 per session
- Featured items: No limit (homepage shows first 6)

## Backup and Recovery

All images are:
- Stored in Supabase Storage (backed up daily)
- Referenced in database with URLs
- Can be recovered if accidentally deleted

## Future Enhancements

Planned features:
- Batch image upload
- Image cropping/resizing tool
- Video support
- Gallery albums/collections
- Image analytics/view counts

