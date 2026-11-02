export function resolvePlayerImageUrl(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return ""
  const image = value.trim()
  if (image.startsWith("data:")) return image

  let path = image
  if (/^https?:\/\//i.test(image)) {
    try {
      const url = new URL(image)
      const markers = [
        "/storage/v1/object/public/app-files/",
        "/storage/v1/object/sign/app-files/",
      ]
      const marker = markers.find((candidate) => url.pathname.includes(candidate))
      if (!marker) return image
      path = url.pathname.slice(url.pathname.indexOf(marker) + marker.length)
    } catch {
      return ""
    }
  }

  path = decodeURIComponent(path.replace(/^\/+/, "").replace(/^app-files\//, ""))
  path = path.replace(/^player image\//i, "")
  if (!path.toLowerCase().startsWith("squad/") && !path.toLowerCase().includes("/squad/")) return ""
  return `/api/storage/player-image?path=${encodeURIComponent(path)}`
}
