import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim()
  if (!token) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

  const adminClient = createAdminClient()
  const { data: { user }, error: authError } = await adminClient.auth.getUser(token)
  const email = user?.email?.toLowerCase()

  if (authError || !email) return NextResponse.json({ error: "Authentication required" }, { status: 401 })

  const { data: appUser, error } = await adminClient
    .from("app_users")
    .select("id, email, role, is_active")
    .eq("email", email)
    .maybeSingle()

  if (error) return NextResponse.json({ error: "Authentication service unavailable" }, { status: 500 })
  if (!appUser || appUser.is_active !== true || !["admin", "super_admin", "moderator"].includes(appUser.role)) {
    return NextResponse.json({ error: "Your account does not have admin access" }, { status: 403 })
  }

  return NextResponse.json({ id: user.id, email, role: appUser.role })
}
