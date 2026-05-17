'use client'

import AuthPage from '@/components/auth-page'

export default function PlayerSignupPage() {
  return <AuthPage defaultView="signup" defaultRole="player" showAllRoles={true} />
}
