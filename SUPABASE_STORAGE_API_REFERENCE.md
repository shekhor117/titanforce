# Supabase Storage API Reference

## Quick Start

```typescript
// 1. Upload a file
import { uploadPlayerPhoto } from '@/lib/supabase-storage'

const result = await uploadPlayerPhoto(file, userId, playerId)

if ('error' in result) {
  console.error('Upload failed:', result.error)
} else {
  // Save to database
  await updateDatabase({
    photo_url: result.signedUrl,
    photo_path: result.path
  })
}

// 2. Delete a file
import { deleteFile } from '@/lib/supabase-storage'

await deleteFile(filePath)

// 3. Get a new signed URL
import { getSignedUrl } from '@/lib/supabase-storage'

const { url } = await getSignedUrl(filePath)
```

---

## API Reference

### Upload Functions

#### `uploadFile(file, featureName, itemId, userId)`
Generic upload function for any file type.

**Parameters:**
- `file` (File) - The file to upload
- `featureName` (string) - Category: "player-photos", "news-images", "team-covers", "fan-avatars"
- `itemId` (string) - Associated item ID (playerId, newsPostId, etc.)
- `userId` (string) - User ID (auth.uid())

**Returns:**
```typescript
{
  path: string,        // "userId/feature/itemId/uuid.ext"
  signedUrl: string    // Full signed URL for display
} | {
  error: string        // Error message
}
```

**Example:**
```typescript
const result = await uploadFile(
  file,
  'player-photos',
  playerId,
  currentUser.id
)
```

---

#### `uploadPlayerPhoto(file, userId, playerId)`
Upload a player profile photo. Validates image type.

**Parameters:**
- `file` (File) - Image file
- `userId` (string) - Player's user ID
- `playerId` (string) - Player profile ID

**Returns:** Same as `uploadFile()`

**Path:** `${userId}/player-photos/${playerId}/${uuid}.${ext}`

**Example:**
```typescript
const result = await uploadPlayerPhoto(
  selectedFile,
  user.id,
  user.id // or player profile ID
)
```

---

#### `uploadNewsImage(file, userId, newsPostId)`
Upload a news post image. Validates image type.

**Parameters:**
- `file` (File) - Image file
- `userId` (string) - Admin user ID
- `newsPostId` (string) - News post ID

**Returns:** Same as `uploadFile()`

**Path:** `${userId}/news-images/${newsPostId}/${uuid}.${ext}`

**Example:**
```typescript
const result = await uploadNewsImage(
  imageFile,
  currentUser.id,
  newsPostId
)
```

---

#### `uploadTeamCover(file, userId)`
Upload a team cover/banner image. Validates image type.

**Parameters:**
- `file` (File) - Image file
- `userId` (string) - Admin user ID

**Returns:** Same as `uploadFile()`

**Path:** `${userId}/team-covers/main/${uuid}.${ext}`

**Example:**
```typescript
const result = await uploadTeamCover(
  bannerFile,
  currentUser.id
)
```

---

#### `uploadFanAvatar(file, userId)`
Upload a fan profile avatar. Validates image type.

**Parameters:**
- `file` (File) - Image file
- `userId` (string) - Fan user ID

**Returns:** Same as `uploadFile()`

**Path:** `${userId}/fan-avatars/${userId}/${uuid}.${ext}`

**Example:**
```typescript
const result = await uploadFanAvatar(
  avatarFile,
  currentUser.id
)
```

---

### Deletion Functions

#### `deleteFile(filePath)`
Delete a file from Supabase Storage.

**Parameters:**
- `filePath` (string) - Full file path from upload result

**Returns:**
```typescript
{
  success: boolean
} | {
  error: string
}
```

**Example:**
```typescript
const result = await deleteFile(
  'userId/player-photos/playerId/uuid.jpg'
)

if ('error' in result) {
  console.error('Delete failed:', result.error)
}
```

---

### URL Functions

#### `getSignedUrl(filePath, expiresIn)`
Get a signed URL for a private file.

**Parameters:**
- `filePath` (string) - File path from upload or database
- `expiresIn` (number) - Expiration in seconds (default: 31536000 = 1 year)

**Returns:**
```typescript
{
  url: string  // Signed URL
} | {
  error: string
}
```

**Example:**
```typescript
// Get URL that expires in 1 year (default)
const { url } = await getSignedUrl(filePath)

// Get URL that expires in 1 hour
const { url } = await getSignedUrl(filePath, 3600)
```

---

### Utility Functions

#### `getFileExtension(filename)`
Extract file extension from filename.

**Parameters:**
- `filename` (string) - Filename (e.g., "photo.jpg")

**Returns:** `string` (e.g., "jpg")

```typescript
const ext = getFileExtension('photo.jpg') // "jpg"
```

---

#### `formatFileSize(bytes)`
Format bytes to human-readable size.

**Parameters:**
- `bytes` (number) - File size in bytes

**Returns:** `string` (e.g., "2.5 MB")

```typescript
const size = formatFileSize(2621440) // "2.5 MB"
```

---

#### `extractUserIdFromPath(filePath)`
Extract user ID from file path.

**Parameters:**
- `filePath` (string) - Full file path

**Returns:** `string` (User ID)

```typescript
const userId = extractUserIdFromPath(
  '123e4567/player-photos/456/uuid.jpg'
) // "123e4567"
```

---

#### `extractFeatureFromPath(filePath)`
Extract feature name from file path.

**Parameters:**
- `filePath` (string) - Full file path

**Returns:** `string` (Feature name)

```typescript
const feature = extractFeatureFromPath(
  '123e4567/player-photos/456/uuid.jpg'
) // "player-photos"
```

---

## Complete Workflow Example

```typescript
import {
  uploadPlayerPhoto,
  deleteFile,
  getSignedUrl
} from '@/lib/supabase-storage'

// 1. Get file from input
const handleFileSelect = async (file: File) => {
  const currentUser = await getAuthUser()

  // 2. Upload to Supabase Storage
  const uploadResult = await uploadPlayerPhoto(
    file,
    currentUser.id,
    currentUser.playerId
  )

  if ('error' in uploadResult) {
    showError(uploadResult.error)
    return
  }

  // 3. Save to database
  await updateDatabase({
    photo_url: uploadResult.signedUrl,
    photo_path: uploadResult.path
  })

  // 4. Display to user
  displayPreview(uploadResult.signedUrl)
}

// Later, when updating:
const handlePhotoUpdate = async (newFile: File, oldPath: string) => {
  // 5. Delete old file
  await deleteFile(oldPath)

  // 6. Upload new file
  const result = await uploadPlayerPhoto(
    newFile,
    currentUser.id,
    currentUser.playerId
  )

  // 7. Update database
  await updateDatabase({
    photo_url: result.signedUrl,
    photo_path: result.path
  })
}

// When displaying later:
const refreshPhoto = async (filePath: string) => {
  // 8. Get fresh signed URL (useful if expired)
  const { url } = await getSignedUrl(filePath)
  displayPreview(url)
}
```

---

## Storage Limits

- **File Size:** 5 MB per file
- **Bucket:** "app-files" (private)
- **Signed URL Expiry:** 1 year (default)
- **File Types:** Images (player-photos, news-images, team-covers, fan-avatars)

---

## Error Handling

All functions return error objects on failure:

```typescript
const result = await uploadFile(...)

if ('error' in result) {
  // Handle error
  console.error(result.error)
} else {
  // Use result.path and result.signedUrl
  console.log(result.path)
  console.log(result.signedUrl)
}
```

---

## Security

- ✅ Files stored in private bucket
- ✅ User-scoped paths prevent cross-access
- ✅ RLS policies enforce ownership
- ✅ Signed URLs expire after 1 year
- ✅ File type validation on upload
- ✅ File size limits enforced

---

## Console Logging

All operations log to console with `[v0]` prefix:

```
[v0] Uploading file to: userId/player-photos/playerId/uuid.jpg
[v0] File uploaded successfully: userId/player-photos/playerId/uuid.jpg
[v0] File deleted: userId/player-photos/playerId/uuid.jpg
```

Use this for debugging uploads and deletions.
