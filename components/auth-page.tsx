'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Heart, Handshake, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'

type Role = 'player' | 'fan' | 'partner'

interface AuthPageProps {
  defaultView?: 'login' | 'signup'
}

export default function AuthPage({ defaultView = 'login' }: AuthPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const { login, signup } = useAuth()
  
  const [view, setView] = useState<'login' | 'signup'>(defaultView)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role>('fan')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)

  const roles: { id: Role; label: string; icon: React.ReactNode }[] = [
    { id: 'player', label: 'Player', icon: <User className="w-4 h-4" /> },
    { id: 'fan', label: 'Fan', icon: <Heart className="w-4 h-4" /> },
    { id: 'partner', label: 'Partner', icon: <Handshake className="w-4 h-4" /> },
  ]

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      if (view === 'login') {
        // Use auth context for login - it handles both Supabase and demo mode
        await login(email, password, selectedRole)
        router.push('/profile')
      } else {
        if (!supabase) {
          // Demo mode signup — use the auth context signup helper
          await signup(fullName, email, password, selectedRole)
          router.push('/profile')
          return
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: selectedRole,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?role=${selectedRole}`,
          },
        })
        if (error) throw error
        // Redirect to home with a query param so the page can show a "check your email" notice
        router.push('/?signup=check-email')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      if (provider === 'google') setIsGoogleLoading(true)
      if (provider === 'facebook') setIsFacebookLoading(true)
      if (provider === 'apple') setIsAppleLoading(true)
      setError(null)

      if (!supabase) {
        // Demo mode - simulate OAuth login with localStorage
        const demoUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
          email: `demo@${provider}.com`,
          role: selectedRole,
        }
        localStorage.setItem("titanforce_user", JSON.stringify(demoUser))
        router.push('/profile')
        return
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback${view === 'signup' ? `?role=${selectedRole}` : ''}`,
        },
      })

      if (error) throw error
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${view === 'login' ? 'login' : 'sign up'} with ${provider}`)
      setIsGoogleLoading(false)
      setIsFacebookLoading(false)
      setIsAppleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Go back to home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <div className="mb-2">
          <img
            src="/logo.png"
            alt="Titan Force Logo"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground tracking-tight font-[family-name:var(--font-display)]">
            {view === 'login' ? 'Log In' : 'Sign Up'}
          </h1>
          <p className="text-base font-medium text-muted-foreground">
            {view === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setView('signup')}
                  className="text-primary hover:underline cursor-pointer transition-colors"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setView('login')}
                  className="text-primary hover:underline cursor-pointer transition-colors"
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}

        {/* Role Selection (Sign Up only) */}
        {view === 'signup' && (
          <div className="w-full">
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-colors ${
                    selectedRole === role.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {role.icon}
                  <span className="font-semibold text-sm">{role.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="w-full space-y-4">
          {view === 'signup' && (
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={view === 'signup'}
              className="w-full p-5 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground text-foreground"
            />
          )}

          <input
            type="email"
            placeholder={view === 'login' ? 'Email or Supporter ID' : 'Email Address'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-5 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring transition-colors placeholder:text-muted-foreground text-foreground"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-5 pr-14 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-ring transition-all placeholder:text-muted-foreground text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-colors text-base disabled:opacity-50"
          >
            {isLoading
              ? 'Loading...'
              : view === 'login'
                ? 'Continue'
                : 'Create Account'}
          </button>

          {view === 'login' && (
            <div className="flex justify-center gap-4 pt-2">
              <button type="button" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors">
                Forgot password?
              </button>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="w-full flex items-center py-2">
          <div className="flex-grow border-t border-border"></div>
          <span className="px-4 text-base text-muted-foreground">Or</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Social Buttons */}
        <div className="w-full space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin('apple')}
            disabled={isAppleLoading}
            className="w-full flex items-center justify-center p-4 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-3 fill-foreground" viewBox="0 0 384 512">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            <span className="text-base font-bold text-foreground">
              {isAppleLoading ? 'Loading...' : `Sign ${view === 'login' ? 'in' : 'up'} with Apple`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center p-4 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
            </svg>
            <span className="text-base font-bold text-foreground">
              {isGoogleLoading ? 'Loading...' : `Sign ${view === 'login' ? 'in' : 'up'} with Google`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('facebook')}
            disabled={isFacebookLoading}
            className="w-full flex items-center justify-center p-4 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
              <path fill="#3F51B5" d="M42 37c0 2.762-2.238 5-5 5H11c-2.761 0-5-2.238-5-5V11c0-2.762 2.239-5 5-5h26c2.762 0 5 2.238 5 5v26z" />
              <path fill="#FFF" d="M34.368 25H31v13h-5V25h-3v-4h3v-2.41c0-4.088 2.056-6.59 5.607-6.59c1.699 0 2.483.126 2.909.183v4.133h-2.383c-1.446 0-1.745.719-1.745 2.012V21h4.15l-.67 4z" />
            </svg>
            <span className="text-base font-bold text-foreground">
              {isFacebookLoading ? 'Loading...' : `Sign ${view === 'login' ? 'in' : 'up'} with Facebook`}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Having trouble logging in?{' '}
            <a href="#" className="font-bold text-foreground hover:underline">
              Get Help
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
