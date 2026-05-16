import { Metadata } from "next"
import { SignupPage } from "@/components/signup-page"

export const metadata: Metadata = {
  title: "Sign Up | Titan Force FC Admin",
  description: "Create an admin account"
}

export default function Page() {
  return <SignupPage />
}
