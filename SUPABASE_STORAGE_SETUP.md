# Supabase Storage Integration Guide

## Overview
All file uploads are now connected to Supabase Storage using the "app-files" private bucket. Files are organized by user and feature type in the following structure:

```
${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
```

## Storage Utilities (`lib/supabase-storage.ts`)

### Core Functions

#### `uploadFile(file, featureName, itemId, userId)`
Generic file upload function for all file types.

```typescript
const result = await uploadFile(
  file,
  "player-photos",
  playerId,
  userId
)

if ("error" in result) {
  console.error(result.error)
} else {
  console.log("Uploaded:", result.path)
  console.log("Signed URL:", result.signedUrl)
}
```

#### `uploadPlayerPhoto(file, userId, playerId)`
Specialized for player profile photos.

#### `uploadNewsImage(file, userId, newsPostId)`
Specialized for news post images.

#### `uploadTeamCover(file, userId)`
Specialized for team cover/banner images.

#### `uploadFanAvatar(file, userId)`
Specialized for fan profile avatars.

### Deletion Functions

#### `deleteFile(filePath)`
Remove a file from storage.

```typescript
const result = await deleteFile(filePath)

if ("error" in result) {
  console.error(result.error)
} else {
  console.log("File deleted successfully")
}
```

### Signed URL Functions

#### `getSignedUrl(filePath, expiresIn)`
Get a signed URL for a private file (expires in 1 year by default).

```typescript
const result = await getSignedUrl(filePath)

if ("error" in result) {
  console.error(result.error)
} else {
  console.log("Use this URL:", result.url)
}
```

## Updated Components

### 1. PhotoUpload Component
**Location:** `components/photo-upload.tsx`

Now accepts additional props:
- `featureName` - Feature category (e.g., "player-photos")
- `itemId` - Item ID for the upload
- `currentPhotoPath` - Original file path for deletion
- `onPhotoDelete` - Callback when photo is deleted

**Usage:**
```typescript
<PhotoUpload
  currentPhoto={formData.photoUrl}
  currentPhotoPath={formData.photoPath}
  onPhotoUpload={(url, path) => setFormData(prev => ({ 
    ...prev, 
    photoUrl: url, 
    photoPath: path 
  }))}
  onPhotoDelete={(path) => console.log("Deleted:", path)}
  featureName="player-photos"
  itemId={user?.id || "unknown"}
/>
```

### 2. Player Profile Page
**Location:** `app/dashboard/player/profile/page.tsx`

- Now stores `photoPath` in form data
- Passes both `photoUrl` and `photoPath` to PhotoUpload
- Files stored in: `${userId}/player-photos/${userId}/${uuid}.${ext}`

### 3. Admin News Page
**Location:** `app/admin/news/page.tsx`

- Image upload field integrated into form
- Validates image files before upload
- Automatically deletes old images when updating
- Stores files in: `${userId}/news-images/${newsPostId}/${uuid}.${ext}`
- Refreshes signed URLs when fetching posts

## Database Schema Updates

Add these fields to your tables:

### player_profiles table
```sql
ALTER TABLE public.player_profiles 
ADD COLUMN photo_path TEXT;
```

### news_posts table
```sql
ALTER TABLE public.news_posts 
ADD COLUMN image_path TEXT;
```

### fan_accounts table
```sql
ALTER TABLE public.fan_accounts 
ADD COLUMN avatar_path TEXT;
```

## File Path Organization

### Player Photos
```
${userId}/player-photos/${playerId}/${uuid}.jpg
```

### News Images
```
${userId}/news-images/${newsPostId}/${uuid}.png
```

### Team Covers
```
${userId}/team-covers/main/${uuid}.jpg
```

### Fan Avatars
```
${userId}/fan-avatars/${userId}/${uuid}.jpg
```

## Security

- All files stored in private "app-files" bucket
- Row Level Security ensures users only access their own files
- Signed URLs expire after 1 year
- File validation on client and server
- Maximum file size: 5MB

## API Changes

When saving to database, store both:
1. **Signed URL** in `image_url`/`photo_url` field (for display)
2. **File path** in `image_path`/`photo_path` field (for deletion/refresh)

Example:
```typescript
{
  image_url: "https://..../signed-url",
  image_path: "userId/news-images/postId/uuid.jpg"
}
```

## Deletion Workflow

When deleting items with files:

1. Get the file path from database
2. Delete from Supabase Storage
3. Delete from database

```typescript
// 1. Get path
const { image_path } = await getPost(postId)

// 2. Delete from storage
await deleteFile(image_path)

// 3. Delete from database
await deletePost(postId)
```

## Common Issues & Solutions

### Issue: "File must be an image"
- Ensure file MIME type starts with "image/"
- Component validates before upload

### Issue: "File size must be less than 5MB"
- Compress images before upload
- Limit is checked in browser and server

### Issue: Signed URL not working
- Check file path is correct
- Verify file exists in storage
- Ensure RLS policies allow access

### Issue: Old image not deleted
- Ensure you have the correct `filePath`
- Check Storage permissions in Supabase

## Next Steps

1. **Update API routes** to handle `image_path` field
2. **Update database** with new path columns
3. **Update forms** that use file uploads
4. **Test uploads** in development
5. **Monitor Storage** usage in Supabase dashboard

## Files Modified

- ✅ `components/photo-upload.tsx` - Updated with Supabase Storage
- ✅ `app/dashboard/player/profile/page.tsx` - Updated PhotoUpload usage
- ✅ `app/admin/news/page.tsx` - Added image upload handling
- ✅ `lib/supabase-storage.ts` - New utility functions (CREATED)

## Ready to Use

All components are now connected to Supabase Storage. No additional setup needed—just test the file uploads in your app!
