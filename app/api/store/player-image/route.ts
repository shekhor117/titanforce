import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const value = request.nextUrl.searchParams.get("path")?.trim() ?? ""
  let path = value

  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value)
      const markers = ["/storage/v1/object/sign/app-files/", "/storage/v1/object/public/app-files/"]
      const marker = markers.find((item) => url.pathname.includes(item))
      if (!marker) return NextResponse.json({ error: "Invalid player image path" }, { status: 400 })
      path = url.pathname.slice(url.pathname.indexOf(marker) + marker.length)
    }
    path = decodeURIComponent(path.replace(/^\/+/, ""))
  } catch {
    return NextResponse.json({ error: "Invalid player image path" }, { status: 400 })
  }

  if (!path.includes("/player-photos/") || path.includes("..") || path.length > 500) {
    return NextResponse.json({ error: "Invalid player image path" }, { status: 400 })
  }

  const { data, error } = await createAdminClient().storage.from("app-files").createSignedUrl(path, 300)
  if (error || !data?.signedUrl) return NextResponse.json({ error: "Player image unavailable" }, { status: 404 })

  return NextResponse.redirect(data.signedUrl, {
    headers: { "Cache-Control": "public, max-age=240, stale-while-revalidate=60" },
  })
}
