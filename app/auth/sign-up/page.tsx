'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { User, Heart, Handshake } from 'lucide-react'

type Role = 'player' | 'fan' | 'partner'

export default function SignUpPage() {
  const supabase = createClient()
  const [selectedRole, setSelectedRole] = useState<Role>('player')
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)

  const roles: { id: Role; label: string; icon: React.ReactNode; description: string }[] = [
    { id: 'player', label: 'Player', icon: <User className="w-5 h-5" />, description: 'Join the squad' },
    { id: 'fan', label: 'Fan', icon: <Heart className="w-5 h-5" />, description: 'Support the team' },
    { id: 'partner', label: 'Partner', icon: <Handshake className="w-5 h-5" />, description: 'Business collaboration' },
  ]

  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${selectedRole}`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google')
      setIsGoogleLoading(false)
    }
  }

  const handleFacebookSignUp = async () => {
    try {
      setIsFacebookLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?role=${selectedRole}`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up with Facebook')
      setIsFacebookLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">Join Titan Force</CardTitle>
          <CardDescription className="text-zinc-400">
            Select your role and sign up
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-md border border-red-800">
              {error}
            </div>
          )}

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center gap-2 py-4 px-2 rounded-lg transition-all ${
                  selectedRole === role.id
                    ? 'bg-red-600 text-white'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {role.icon}
                <span className="font-semibold text-sm">{role.label}</span>
              </button>
            ))}
          </div>

          <p className="text-xs text-zinc-500 text-center">
            {roles.find(r => r.id === selectedRole)?.description}
          </p>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleSignUp}
              disabled={isGoogleLoading}
              className="w-full py-6 bg-white text-black hover:bg-zinc-200 font-semibold"
            >
              {isGoogleLoading ? 'Signing up...' : 'Continue with Google'}
            </Button>

            <Button
              onClick={handleFacebookSignUp}
              disabled={isFacebookLoading}
              className="w-full py-6 bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              {isFacebookLoading ? 'Signing up...' : 'Continue with Facebook'}
            </Button>
          </div>

          <p className="text-xs text-zinc-500 text-center">
            Player / Fan / Partner accounts are verified by Titan Force Admin
          </p>

          <div className="text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-red-500 hover:underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
