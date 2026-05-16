import { Metadata } from "next"
import { ForgotPasswordPage } from "@/components/forgot-password-page"

export const metadata: Metadata = {
  title: "Forgot Password | Titan Force FC Admin",
  description: "Reset your admin password"
}

export default function Page() {
  return <ForgotPasswordPage />
}
