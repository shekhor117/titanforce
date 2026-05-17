'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Heart, Handshake, ArrowLeft, Loader2, Mail, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { mockSignUp } from '@/lib/auth-utils'

type Role = 'player' | 'fan' | 'partner'
type AuthStep = 'credentials' | 'otp'

interface AuthPageProps {
  defaultView?: 'login' | 'signup'
  defaultRole?: Role
  showAllRoles?: boolean
  enableOTP?: boolean
}

export default function AuthPage({ defaultView = 'login', defaultRole = 'fan', showAllRoles = false, enableOTP = true }: AuthPageProps) {
  const router = useRouter()
  const supabase = createClient()
  const { login } = useAuth()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  const [view, setView] = useState<'login' | 'signup'>(defaultView)
  const [authStep, setAuthStep] = useState<AuthStep>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isFacebookLoading, setIsFacebookLoading] = useState(false)
  const [isAppleLoading, setIsAppleLoading] = useState(false)
  const [otpSentEmail, setOtpSentEmail] = useState('')
  const [otpResendTimer, setOtpResendTimer] = useState(0)

  const roles: { id: Role; label: string; labelBn: string; icon: React.ReactNode }[] = [
    { id: 'player', label: 'Player', labelBn: 'খেলোয়াড়', icon: <User className="w-4 h-4" /> },
    { id: 'fan', label: 'Fan', labelBn: 'অনুরাগী', icon: <Heart className="w-4 h-4" /> },
    { id: 'partner', label: 'Partner', labelBn: 'অংশীদার', icon: <Handshake className="w-4 h-4" /> },
  ]

  // Generate a 6-digit mock OTP (in production, this would be sent to email)
  const generateMockOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Store OTP in session (in production, send via email)
  const sendOTPEmail = async (emailAddress: string) => {
    try {
      const mockOTP = generateMockOTP()
      // In production, send via email service
      // For now, store in sessionStorage for demo
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('otp_code', mockOTP)
        sessionStorage.setItem('otp_email', emailAddress)
        // OTP valid for 5 minutes
        sessionStorage.setItem('otp_expiry', (Date.now() + 5 * 60 * 1000).toString())
        console.log("[v0] Mock OTP sent to", emailAddress, "- Demo OTP:", mockOTP)
      }
      setOtpSentEmail(emailAddress)
      setOtpResendTimer(60) // 60 second cooldown
    } catch (err) {
      console.error("[v0] Error sending OTP:", err)
      throw err
    }
  }

  // Verify OTP code
  const verifyOTPCode = (code: string): boolean => {
    if (typeof window === 'undefined') return false
    
    const storedOTP = sessionStorage.getItem('otp_code')
    const otpExpiry = sessionStorage.getItem('otp_expiry')
    
    if (!storedOTP || !otpExpiry) return false
    if (Date.now() > parseInt(otpExpiry)) {
      setError(isBn ? 'OTP এর মেয়াদ শেষ হয়েছে' : 'OTP has expired')
      return false
    }
    
    return code === storedOTP
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      if (view === 'login') {
        // Check credentials first
        if (authStep === 'credentials') {
          // Validate credentials with mock auth or Supabase
          try {
            const { mockSignInWithEmail } = await import('@/lib/mock-auth')
            const mockUser = mockSignInWithEmail(email, password)
            if (!mockUser) {
              throw new Error(isBn ? 'অবৈধ শংসাপত্র' : 'Invalid credentials')
            }
          } catch (credErr) {
            // Try Supabase
            try {
              const { data } = await supabase.auth.signInWithPassword({
                email,
                password,
              })
              if (!data.user) {
                throw new Error(isBn ? 'অবৈধ শংসাপত্র' : 'Invalid credentials')
              }
            } catch (supabaseErr) {
              throw credErr
            }
          }

          // If OTP is enabled, proceed to OTP verification
          if (enableOTP) {
            await sendOTPEmail(email)
            setAuthStep('otp')
            setIsLoading(false)
            return
          }

          // Otherwise login directly
          await login(email, password, selectedRole)
          router.push('/profile')
        } else if (authStep === 'otp') {
          // Verify OTP
          if (!verifyOTPCode(otp)) {
            throw new Error(isBn ? 'অবৈধ OTP' : 'Invalid OTP code')
          }

          // OTP verified, complete login
          await login(email, password, selectedRole)
          // Clear OTP data
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('otp_code')
            sessionStorage.removeItem('otp_email')
            sessionStorage.removeItem('otp_expiry')
          }
          router.push('/profile')
        }
      } else {
        // Signup flow
        if (authStep === 'credentials') {
          // Try Supabase first, fall back to mock if not configured
          try {
            const { error } = await supabase.auth.signUp({
              email,
              password,
              options: {
                data: {
                  full_name: fullName,
                  role: selectedRole,
                },
                emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
                  `${window.location.origin}/auth/callback?role=${selectedRole}`,
              },
            })
            if (error) throw error
          } catch (supabaseErr) {
            console.log("[v0] Supabase signup failed, attempting mock signup...")
            await mockSignUp(email, password, fullName, selectedRole)
          }

          // Proceed to OTP verification if enabled
          if (enableOTP) {
            await sendOTPEmail(email)
            setAuthStep('otp')
            setIsLoading(false)
            return
          }

          router.push('/auth/sign-up-success')
        } else if (authStep === 'otp') {
          // Verify OTP for signup
          if (!verifyOTPCode(otp)) {
            throw new Error(isBn ? 'অবৈধ OTP' : 'Invalid OTP code')
          }

          // OTP verified, complete signup
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('otp_code')
            sessionStorage.removeItem('otp_email')
            sessionStorage.removeItem('otp_expiry')
          }
          router.push('/auth/sign-up-success')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (isBn ? 'প্রমাণীকরণ ব্যর্থ হয়েছে' : 'Authentication failed'))
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      if (provider === 'google') setIsGoogleLoading(true)
      if (provider === 'facebook') setIsFacebookLoading(true)
      if (provider === 'apple') setIsAppleLoading(true)
      setError(null)

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
            `${window.location.origin}/auth/callback${view === 'signup' ? `?role=${selectedRole}` : ''}`,
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

  const handleResendOTP = async () => {
    try {
      if (otpResendTimer > 0) return
      setIsLoading(true)
      setError(null)
      await sendOTPEmail(otpSentEmail)
      setOtp('')
    } catch (err) {
      setError(err instanceof Error ? err.message : (isBn ? 'OTP পুনরায় পাঠাতে ব্যর্থ' : 'Failed to resend OTP'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToCredentials = () => {
    setAuthStep('credentials')
    setOtp('')
    setError(null)
    setOtpResendTimer(0)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 left-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={isBn ? "পিছনে যান" : "Go back"}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm font-medium">{isBn ? "পিছনে" : "Back"}</span>
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
            {authStep === 'otp' ? (isBn ? 'OTP যাচাই করুন' : 'Verify OTP') : (view === 'login' ? (isBn ? 'লগইন' : 'Log In') : (isBn ? 'সাইন আপ' : 'Sign Up'))}
          </h1>
          <p className="text-base font-medium text-muted-foreground">
            {authStep === 'otp' ? (
              <>
                {isBn ? 'আমরা একটি OTP পাঠিয়েছি' : 'We sent an OTP to'} <span className="font-semibold text-foreground">{otpSentEmail}</span>
              </>
            ) : view === 'login' ? (
              <>
                {isBn ? 'অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setView('signup')}
                  className="text-primary hover:underline cursor-pointer transition-colors"
                >
                  {isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create an account'}
                </button>
              </>
            ) : (
              <>
                {isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
                <button
                  onClick={() => setView('login')}
                  className="text-primary hover:underline cursor-pointer transition-colors"
                >
                  {isBn ? 'লগইন করুন' : 'Log In'}
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
            <p className="text-sm text-muted-foreground mb-3 text-center">
              {isBn ? 'আপনার ভূমিকা নির্বাচন করুন' : 'Select your role'}
            </p>
            <div className={`grid ${showAllRoles ? 'grid-cols-3' : 'grid-cols-2'} gap-3`}>
              {roles.filter((role) => showAllRoles || role.id !== 'player').map((role) => (
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
                  <span className="font-semibold text-sm">{isBn ? role.labelBn : role.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="w-full space-y-4">
          {authStep === 'otp' ? (
            <>
              {/* OTP Input Section */}
              <div className="space-y-4">
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    {isBn ? 'আপনার ইমেলে পাঠানো 6-ডিজিট কোড প্রবেশ করুন' : 'Enter the 6-digit code sent to your email'}
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="w-full p-4 text-center text-2xl tracking-widest font-mono bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-colors text-base disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {isLoading ? (isBn ? 'যাচাই করছি...' : 'Verifying...') : (isBn ? 'চালিয়ে যান' : 'Continue')}
                </button>

                <div className="text-center space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={otpResendTimer > 0 || isLoading}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isBn ? 'কোড পুনরায় পাঠান' : 'Resend code'}
                    {otpResendTimer > 0 && ` (${otpResendTimer}s)`}
                  </button>
                  <button
                    type="button"
                    onClick={handleBackToCredentials}
                    className="block w-full text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors"
                  >
                    {isBn ? 'পিছনে ফিরুন' : 'Go back'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Credentials Input Section */}
          {view === 'signup' && (
            <input
              type="text"
              placeholder={isBn ? "পুর��� নাম" : "Full Name"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={view === 'signup'}
              className="w-full p-4 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors placeholder:text-muted-foreground text-foreground"
            />
          )}

          <input
            type="email"
            placeholder={view === 'login' ? (isBn ? "ইমেল বা সাপোর্টার আইডি" : "Email or Supporter ID") : (isBn ? "ইমেল ঠিকানা" : "Email Address")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-colors placeholder:text-muted-foreground text-foreground"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={isBn ? "পাসওয়ার্ড" : "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 pr-14 text-base bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring transition-all placeholder:text-muted-foreground text-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? (isBn ? "পাসওয়ার্ড লুকান" : "Hide password") : (isBn ? "পাসওয়ার্ড দেখান" : "Show password")}
            >
              {showPassword ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-colors text-base disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isLoading
              ? (isBn ? 'অপেক্ষা করুন...' : 'Loading...')
              : view === 'login'
                ? (isBn ? 'লগইন করুন' : 'Continue')
                : (isBn ? 'অ্যাকাউন্ট তৈরি করুন' : 'Create Account')}
          </button>

          {view === 'login' && (
            <div className="flex justify-center gap-4 pt-2">
              <button 
                type="button" 
                onClick={() => router.push('/auth/forgot-password')}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline transition-colors"
              >
                {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot password?"}
              </button>
            </div>
          )}
            </>
          )}
        </form>

        {/* Divider */}
        <div className="w-full flex items-center py-2">
          <div className="flex-grow border-t border-border"></div>
          <span className="px-4 text-base text-muted-foreground">{isBn ? "অথবা" : "Or"}</span>
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
            {isAppleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <svg className="w-5 h-5 mr-3 fill-foreground" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
            )}
            <span className="text-base font-bold text-foreground">
              {isAppleLoading ? (isBn ? 'অপেক্ষা করুন...' : 'Loading...') : (isBn ? `Apple দিয়ে ${view === 'login' ? 'সাইন ইন' : 'সাইন আপ'}` : `Sign ${view === 'login' ? 'in' : 'up'} with Apple`)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center p-4 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
            )}
            <span className="text-base font-bold text-foreground">
              {isGoogleLoading ? (isBn ? 'অপেক্ষা করুন...' : 'Loading...') : (isBn ? `Google দিয়ে ${view === 'login' ? 'সাইন ইন' : 'সাইন আপ'}` : `Sign ${view === 'login' ? 'in' : 'up'} with Google`)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('facebook')}
            disabled={isFacebookLoading}
            className="w-full flex items-center justify-center p-4 bg-muted border border-border rounded-xl hover:bg-muted/80 transition-all disabled:opacity-50"
          >
            {isFacebookLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-3" />
            ) : (
              <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
                <path fill="#3F51B5" d="M42 37c0 2.762-2.238 5-5 5H11c-2.761 0-5-2.238-5-5V11c0-2.762 2.239-5 5-5h26c2.762 0 5 2.238 5 5v26z" />
                <path fill="#FFF" d="M34.368 25H31v13h-5V25h-3v-4h3v-2.41c0-4.088 2.056-6.59 5.607-6.59c1.699 0 2.483.126 2.909.183v4.133h-2.383c-1.446 0-1.745.719-1.745 2.012V21h4.15l-.67 4z" />
              </svg>
            )}
            <span className="text-base font-bold text-foreground">
              {isFacebookLoading ? (isBn ? 'অপ��ক্ষা করুন...' : 'Loading...') : (isBn ? `Facebook দিয়ে ${view === 'login' ? 'সাইন ইন' : 'সাইন আপ'}` : `Sign ${view === 'login' ? 'in' : 'up'} with Facebook`)}
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            {isBn ? "লগইন করতে সমস্যা হ��্ছে?" : "Having trouble logging in?"}{' '}
            <a href="/contact" className="font-bold text-foreground hover:underline">
              {isBn ? "সাহায্য নিন" : "Get Help"}
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
