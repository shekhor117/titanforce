import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path")?.trim() ?? ""

  if (!path.startsWith("products/") || path.includes("..") || path.length > 500) {
    return NextResponse.json({ error: "Invalid product image path" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.storage.from("app-files").createSignedUrl(path, 300)

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: "Product image unavailable" }, { status: 404 })
  }

  return NextResponse.redirect(data.signedUrl, {
    headers: { "Cache-Control": "public, max-age=240, stale-while-revalidate=60" },
  })
}
