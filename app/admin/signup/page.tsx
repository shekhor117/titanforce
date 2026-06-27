import { Metadata } from "next"
import { SignupPage } from "@/components/signup-page"
import { PageEntrance } from "@/components/page-entrance"

export const metadata: Metadata = {
  title: "Sign Up | Titan Force FC Admin",
  description: "Create an admin account"
}

export default function Page() {
  return (
    <PageEntrance delay={0.2} duration={0.6} variant="fadeInUp">
      <SignupPage />
    </PageEntrance>
  )
}
