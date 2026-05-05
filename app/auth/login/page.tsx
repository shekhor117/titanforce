'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Get user role from profiles
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, is_approved')
          .eq('id', data.user.id)
          .single()

        if (profile) {
          if (!profile.is_approved && profile.role !== 'fan') {
            router.push(`/auth/pending-approval?role=${profile.role}`)
            return
          }
          router.push(`/dashboard/${profile.role}`)
          return
        }
      }

      router.push('/dashboard/fan')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Google')
      setIsGoogleLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    try {
      setIsFacebookLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login with Facebook')
      setIsFacebookLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to your Titan Force account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="bg-red-900/20 text-red-400 text-sm p-3 rounded-md border border-red-800">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="w-full py-6 bg-white text-black hover:bg-zinc-200 font-semibold"
            >
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </Button>

            <Button
              onClick={handleFacebookLogin}
              disabled={isFacebookLoading}
              className="w-full py-6 bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              {isFacebookLoading ? 'Signing in...' : 'Continue with Facebook'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">
                Or login with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full py-6 bg-red-600 hover:bg-red-700 text-white font-semibold"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="text-center text-sm text-zinc-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="text-red-500 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
