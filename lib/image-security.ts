import sharp from 'sharp'

const MAX_DIMENSION = 4096
const MAX_PIXELS = 16_000_000

export async function normalizeImage(bytes: Uint8Array, contentType: string) {
  const image = sharp(bytes, { limitInputPixels: MAX_PIXELS })
  const metadata = await image.metadata()
  if (!metadata.width || !metadata.height || metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    throw new Error('Image dimensions exceed the allowed limit')
  }

  const normalized = await image.rotate().webp({ quality: 88 }).toBuffer()
  return { bytes: normalized, contentType: 'image/webp', extension: 'webp' }
}
