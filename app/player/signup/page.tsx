'use client'

import AuthPage from '@/components/auth-page'
import { PageEntrance } from '@/components/page-entrance'

export default function PlayerSignupPage() {
  return <AuthPage defaultView="signup" defaultRole="player" showAllRoles={true} />
}
