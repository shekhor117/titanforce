import sharp from 'sharp'

const MAX_DIMENSION = 4096
const MAX_PIXELS = 16_000_000
export const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const

export function hasValidImageSignature(bytes: Uint8Array, contentType: string) {
  if (!SUPPORTED_IMAGE_TYPES.includes(contentType as (typeof SUPPORTED_IMAGE_TYPES)[number])) return false
  if (contentType === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
  if (contentType === 'image/png') return [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte)
  if (contentType === 'image/gif') return bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46
  return bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
}

export async function normalizeImage(bytes: Uint8Array, contentType: string) {
  const image = sharp(bytes, { limitInputPixels: MAX_PIXELS })
  const metadata = await image.metadata()
  if (!metadata.width || !metadata.height || metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
    throw new Error('Image dimensions exceed the allowed limit')
  }

  const normalized = await image.rotate().webp({ quality: 88 }).toBuffer()
  return { bytes: normalized, contentType: 'image/webp', extension: 'webp' }
}
