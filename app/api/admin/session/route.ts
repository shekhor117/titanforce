import { NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "@/lib/admin-api-helper"

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth(request)
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  return NextResponse.json({
    id: auth.user.id,
    email: auth.user.email,
    role: auth.role,
  })
}
