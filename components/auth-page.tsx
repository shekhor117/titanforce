'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Heart, Handshake, ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type Role = 'player' | 'fan' | 'partner'

interface AuthPageProps {
  defaultView?: 'login' | 'signup'
}

export default function AuthPage({ defaultView = 'login' }: AuthPageProps) {
  const router = useRouter()
  const supabase = createClient()
  
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
  const [loginSuccess, setLoginSuccess] = useState(false)

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

      if (!supabase) {
        setError('Authentication is not configured. Please contact support.')
        setIsLoading(false)
        return
      }

      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        setLoginSuccess(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push('/profile')
      } else {
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
        
        setLoginSuccess(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push('/auth/sign-up-success')
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
        setError('Authentication is not configured. Please contact support.')
        setIsGoogleLoading(false)
        setIsFacebookLoading(false)
        setIsAppleLoading(false)
        return
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback${view === 'signup' ? `?role=${selectedRole}` : ''}`,
        },
      })

      if (error) throw error
      
      setLoginSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${view === 'login' ? 'login' : 'sign up'} with ${provider}`)
      setIsGoogleLoading(false)
      setIsFacebookLoading(false)
      setIsAppleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        onClick={() => {
          window.location.href = "/"
        }}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Go back to home"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">Back</span>
      </motion.button>

      {/* Success Animation Overlay */}
      {loginSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, ease: 'linear' }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-primary/60 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: [1, 0.8, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="text-white text-2xl"
              >
                ✓
              </motion.div>
            </motion.div>
            <p className="text-white text-lg font-semibold">{view === 'login' ? 'Welcome back!' : 'Account created!'}</p>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md flex flex-col items-center gap-8"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-2"
        >
          <h2 className="text-4xl font-bold text-primary font-[family-name:var(--font-display)]">TF</h2>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-center space-y-2"
        >
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
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20"
          >
            {error}
          </motion.div>
        )}

        {/* Role Selection (Sign Up only) */}
        {view === 'signup' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role, idx) => (
                <motion.button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.05 }}
                  whileHover={{ y: -2 }}
                  className={`flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-colors ${
                    selectedRole === role.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {role.icon}
                  <span className="font-semibold text-sm">{role.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="w-full space-y-4">
          {view === 'signup' && (
            <motion.input
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={view === 'signup'}
              className="w-full p-4 text-base bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
            />
          )}

          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            type="email"
            placeholder={view === 'login' ? 'Email or Username' : 'Email Address'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 text-base bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
          />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="relative"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 pr-12 text-base bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            type="submit"
            disabled={isLoading}
            whileHover={{ y: isLoading ? 0 : -2 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-lg transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{view === 'login' ? 'Logging in...' : 'Creating account...'}</span>
              </>
            ) : (
              view === 'login' ? 'Continue' : 'Create Account'
            )}
          </motion.button>

          {view === 'login' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="flex justify-center gap-4 pt-2"
            >
              <button type="button" className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors">
                Forgot password?
              </button>
            </motion.div>
          )}
        </form>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full flex items-center py-2"
        >
          <div className="flex-grow border-t border-border"></div>
          <span className="px-4 text-base text-muted-foreground">Or</span>
          <div className="flex-grow border-t border-border"></div>
        </motion.div>

        {/* Social Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="w-full space-y-3"
        >
          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('apple')}
            disabled={isAppleLoading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center p-3 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            {isAppleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2 fill-foreground" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
            )}
            <span className="text-base font-semibold text-foreground">
              {isAppleLoading ? 'Signing in...' : `Sign ${view === 'login' ? 'in' : 'up'} with Apple`}
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={isGoogleLoading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center p-3 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
            )}
            <span className="text-base font-semibold text-foreground">
              {isGoogleLoading ? 'Signing in...' : `Sign ${view === 'login' ? 'in' : 'up'} with Google`}
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => handleOAuthLogin('facebook')}
            disabled={isFacebookLoading}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center p-3 bg-muted border border-border rounded-lg hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            {isFacebookLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                <path fill="#3F51B5" d="M42 37c0 2.762-2.238 5-5 5H11c-2.761 0-5-2.238-5-5V11c0-2.762 2.239-5 5-5h26c2.762 0 5 2.238 5 5v26z" />
                <path fill="#FFF" d="M34.368 25H31v13h-5V25h-3v-4h3v-2.41c0-4.088 2.056-6.59 5.607-6.59c1.699 0 2.483.126 2.909.183v4.133h-2.383c-1.446 0-1.745.719-1.745 2.012V21h4.15l-.67 4z" />
              </svg>
            )}
            <span className="text-base font-semibold text-foreground">
              {isFacebookLoading ? 'Signing in...' : `Sign ${view === 'login' ? 'in' : 'up'} with Facebook`}
            </span>
          </motion.button>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-2"
        >
          <p className="text-sm text-muted-foreground">
            Having trouble logging in?{' '}
            <a href="#" className="font-semibold text-foreground hover:underline">
              Get Help
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
