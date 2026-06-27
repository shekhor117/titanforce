"use client"

import { AdminLoginPage } from "@/components/admin-login-page"
import { PageEntrance } from "@/components/page-entrance"

export default function AdminLoginRoute() {
  return (
    <PageEntrance delay={0.2} duration={0.6} variant="fadeInUp">
      <AdminLoginPage />
    </PageEntrance>
  )
}
