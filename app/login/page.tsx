import AuthPage from '@/components/auth-page'
import { PageEntrance } from '@/components/page-entrance'

export default function LoginPage() {
  return (
    <PageEntrance delay={0.2} duration={0.6} variant="fadeInUp">
      <AuthPage />
    </PageEntrance>
  )
}
