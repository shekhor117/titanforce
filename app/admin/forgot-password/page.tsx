import { Metadata } from "next"
import { ForgotPasswordPage } from "@/components/forgot-password-page"
import { PageEntrance } from "@/components/page-entrance"

export const metadata: Metadata = {
  title: "Forgot Password | Titan Force FC Admin",
  description: "Reset your admin password"
}

export default function Page() {
  return (
    <PageEntrance delay={0.2} duration={0.6} variant="fadeInUp">
      <ForgotPasswordPage />
    </PageEntrance>
  )
}
