'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, EyeOff, User, Heart, Handshake, ArrowLeft, Loader2, Mail, Lock, Phone, MapPin, Calendar, Instagram, Twitter, Facebook } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { useLanguage } from '@/lib/language-context'
import { mockSignUp } from '@/lib/auth-utils'

type Role = 'player' | 'fan' | 'partner'
type AuthStep = 'credentials' | 'otp' | 'details' | 'preferences'

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

  // Additional signup details
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('')
  const [location, setLocation] = useState('')
  const [instagram, setInstagram] = useState('')
  const [twitter, setTwitter] = useState('')
  const [facebook, setFacebook] = useState('')
  
  // Role-specific fields
  const [favoriteTeam, setFavoriteTeam] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [organizationType, setOrganizationType] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [partnshipType, setPartnershipType] = useState<'sponsor' | 'media' | 'equipment' | 'other' | ''>('')
  
  // Preferences
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false)
  const [shareData, setShareData] = useState(false)

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
      console.log('[v0] Calling send-otp API for:', emailAddress)
      
      // Call the API route to send OTP via Supabase
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailAddress }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send OTP')
      }

      const data = await response.json()
      console.log('[v0] OTP sent successfully:', data)

      setOtpSentEmail(emailAddress)
      setOtpResendTimer(60) // 60 second cooldown
    } catch (err) {
      console.error('[v0] Error sending OTP:', err)
      throw err
    }
  }

  // Verify OTP code via API
  const verifyOTPCode = async (code: string): Promise<boolean> => {
    try {
      console.log('[v0] Verifying OTP code for:', otpSentEmail)
      
      // Call the verify-otp API route
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: otpSentEmail,
          code 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('[v0] OTP verification error:', errorData)
        setError(errorData.error || (isBn ? 'OTP যাচাই ব্যর্থ হয়েছে' : 'OTP verification failed'))
        return false
      }

      const data = await response.json()
      console.log('[v0] OTP verified successfully:', data)
      return true
    } catch (err) {
      console.error('[v0] Error verifying OTP:', err)
      setError(isBn ? 'OTP যাচাই ব্যর্থ হয়েছে' : 'OTP verification failed')
      return false
    }
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      setError(null)

      if (view === 'login') {
        // Check credentials first
        if (authStep === 'credentials') {
          // Validate credentials with Supabase
          try {
            const { data } = await supabase.auth.signInWithPassword({
              email,
              password,
            })
            if (!data.user) {
              throw new Error(isBn ? 'অবৈধ শংসাপত্র' : 'Invalid credentials')
            }
          } catch (err) {
            throw new Error(isBn ? 'অবৈধ শংসাপত্র' : 'Invalid credentials')
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
          const isOtpValid = await verifyOTPCode(otp)
          if (!isOtpValid) {
            throw new Error(isBn ? 'অবৈধ OTP' : 'Invalid OTP code')
          }

          // OTP verified, complete login
          await login(email, password, selectedRole)
          router.push('/profile')
        }
      } else {
        // Signup flow
        if (authStep === 'credentials') {
          // Use real Supabase signup
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
          if (error) {
            throw new Error(error.message || 'Failed to sign up')
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
          const isOtpValid = await verifyOTPCode(otp)
          if (!isOtpValid) {
            throw new Error(isBn ? 'অবৈধ OTP' : 'Invalid OTP code')
          }

          // OTP verified, complete signup
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

  // Signup step navigation
  const handleNextStep = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)

    if (authStep === 'credentials') {
      // Validate credentials
      if (view === 'signup') {
        if (!email || !password || !confirmPassword || !fullName) {
          setError(isBn ? 'সব ফিল্ড পূরণ করুন' : 'Please fill all fields')
          return
        }
        if (password.length < 8) {
          setError(isBn ? 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে' : 'Password must be at least 8 characters')
          return
        }
        if (password !== confirmPassword) {
          setError(isBn ? 'পাসওয়ার্ড মেলে না' : 'Passwords do not match')
          return
        }
      }
      setAuthStep('details')
    } else if (authStep === 'details') {
      // Validate details
      if (!dateOfBirth || !gender || !location) {
        setError(isBn ? 'সব ফিল্ড পূরণ করুন' : 'Please fill all fields')
        return
      }
      
      // Role-specific validation
      if (selectedRole === 'fan' && !favoriteTeam) {
        setError(isBn ? 'প্রিয় দল নির্বাচন করুন' : 'Please select your favorite team')
        return
      }
      if (selectedRole === 'partner' && (!organizationName || !organizationType)) {
        setError(isBn ? 'সংস্থার তথ্য পূরণ করুন' : 'Please fill organization details')
        return
      }
      
      setAuthStep('preferences')
    }
  }

  const handlePreviousStep = () => {
    if (authStep === 'preferences') {
      setAuthStep('details')
    } else if (authStep === 'details') {
      setAuthStep('credentials')
    }
    setError(null)
  }

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!agreeToTerms) {
      setError(isBn ? 'শর্তাবলী গ্রহণ করুন' : 'Please accept terms and conditions')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Create account with full details
      const signupData = {
        email,
        password,
        fullName,
        phone,
        dateOfBirth,
        gender,
        location,
        instagram,
        twitter,
        facebook,
        favoriteTeam: selectedRole === 'fan' ? favoriteTeam : undefined,
        organizationName: selectedRole === 'partner' ? organizationName : undefined,
        organizationType: selectedRole === 'partner' ? organizationType : undefined,
        partnshipType: selectedRole === 'partner' ? partnshipType : undefined,
        subscribeNewsletter,
        shareData,
        role: selectedRole,
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: signupData,
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
            `${window.location.origin}/auth/callback?role=${selectedRole}`,
        },
      })
      if (error) throw error

      // Proceed to OTP verification if enabled
      if (enableOTP) {
        await sendOTPEmail(email)
        setAuthStep('otp')
        setIsLoading(false)
        return
      }

      router.push('/auth/sign-up-success')
    } catch (err) {
      setError(err instanceof Error ? err.message : (isBn ? 'সাইন আপ ব্যর্থ' : 'Sign up failed'))
    } finally {
      setIsLoading(false)
    }
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
          <Image
            src="/logos/titanforce-logo.svg"
            alt="Titan Force Logo"
            width={80}
            height={80}
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
                {isBn ? 'ইতিমধ্যে অ্যাকাউন্ট ���ছে?' : 'Already have an account?'}{' '}
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
        <form onSubmit={(e) => {
          e.preventDefault()
          if (view === 'login') {
            handleEmailAuth(e)
          } else {
            // Signup flow
            if (authStep === 'credentials' || authStep === 'details') {
              handleNextStep(e)
            } else if (authStep === 'preferences') {
              handleCompleteSignup(e)
            } else {
              handleEmailAuth(e)
            }
          }
        }} className="w-full space-y-4">
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
                    className="neo-input w-full p-4 text-center text-2xl tracking-widest font-mono bg-background rounded-lg focus:outline-none transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="neo-btn neo-btn-primary w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-colors text-base disabled:opacity-50 flex items-center justify-center gap-2"
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
          ) : view === 'signup' && authStep === 'details' ? (
            <>
              {/* Details Step */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    required
                    className="neo-input w-full p-3 text-sm bg-muted rounded-lg focus:outline-none transition-colors"
                  />
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    required
                    className="neo-input w-full p-3 text-sm bg-muted rounded-lg focus:outline-none transition-colors"
                  >
                    <option value="">{isBn ? 'লিঙ্গ' : 'Gender'}</option>
                    <option value="male">{isBn ? 'পুরুষ' : 'Male'}</option>
                    <option value="female">{isBn ? 'নারী' : 'Female'}</option>
                    <option value="other">{isBn ? 'অন্যান্য' : 'Other'}</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder={isBn ? "শহর/অবস্থান" : "City/Location"}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="neo-input w-full p-3 text-sm bg-muted rounded-lg focus:outline-none transition-colors"
                />

                <input
                  type="tel"
                  placeholder={isBn ? "ফোন নম্বর (ঐচ্ছিক)" : "Phone Number (Optional)"}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="neo-input w-full p-3 text-sm bg-muted rounded-lg focus:outline-none transition-colors"
                />

                {/* Role-specific fields */}
                {selectedRole === 'fan' && (
                  <input
                    type="text"
                    placeholder={isBn ? "প্রিয় দল" : "Favorite Team"}
                    value={favoriteTeam}
                    onChange={(e) => setFavoriteTeam(e.target.value)}
                    required
                    className="neo-input w-full p-3 text-sm bg-muted rounded-lg focus:outline-none transition-colors"
                  />
                )}

                {selectedRole === 'partner' && (
                  <>
                    <input
                      type="text"
                      placeholder={isBn ? "সংস্থার নাম" : "Organization Name"}
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required
                      className="neo-input w-full p-3 text-sm bg-muted rounded-lg focus:outline-none transition-colors"
                    />
                    <select
                      value={organizationType}
                      onChange={(e) => setOrganizationType(e.target.value)}
                      required
                      className="neo-input w-full p-3 text-sm bg-muted rounded-lg focus:outline-none transition-colors"
                    >
                      <option value="">{isBn ? 'ব্যবসার ধরন' : 'Business Type'}</option>
                      <option value="sports">{isBn ? 'ক্রীড়া' : 'Sports'}</option>
                      <option value="media">{isBn ? 'মিডিয়া' : 'Media'}</option>
                      <option value="equipment">{isBn ? 'সরঞ্জাম' : 'Equipment'}</option>
                      <option value="other">{isBn ? 'অন্যান্য' : 'Other'}</option>
                    </select>
                    <input
                      type="text"
                      placeholder={isBn ? "যোগাযোগ ব্যক্তি" : "Contact Person"}
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="neo-input w-full p-3 text-sm bg-muted rounded-lg focus:outline-none transition-colors"
                    />
                    <select
                      value={organizationType}
                      onChange={(e) => setOrganizationType(e.target.value)}
                      required
                      className="w-full p-3 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    >
                      <option value="">{isBn ? 'ব্যবসার ধর��' : 'Business Type'}</option>
                      <option value="sports">{isBn ? 'ক্রীড়া' : 'Sports'}</option>
                      <option value="media">{isBn ? 'মিডিয়া' : 'Media'}</option>
                      <option value="equipment">{isBn ? 'সরঞ্জাম' : 'Equipment'}</option>
                      <option value="other">{isBn ? 'অন্যান্য' : 'Other'}</option>
                    </select>
                    <input
                      type="text"
                      placeholder={isBn ? "যোগাযোগ ব্যক্তি" : "Contact Person"}
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full p-3 text-sm bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
                    />
                  </>
                )}
              </div>

              {/* Navigation buttons for details step */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 rounded-xl transition-colors"
                >
                  {isBn ? 'পিছনে' : 'Back'}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition-colors"
                >
                  {isBn ? 'পরবর্তী' : 'Next'}
                </button>
              </div>
            </>
          ) : view === 'signup' && authStep === 'preferences' ? (
            <>
              {/* Preferences Step */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">{isBn ? 'সোশ্যাল মিডিয়া (ঐচ্ছিক)' : 'Social Media (Optional)'}</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Instagram className="w-4 h-4 text-foreground/60" />
                      <input
                        type="text"
                        placeholder="Instagram"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Twitter className="w-4 h-4 text-foreground/60" />
                      <input
                        type="text"
                        placeholder="Twitter/X"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <Facebook className="w-4 h-4 text-foreground/60" />
                      <input
                        type="text"
                        placeholder="Facebook"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferences checkboxes */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscribeNewsletter}
                      onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-foreground/80">{isBn ? 'আমাদের নিউজলেটার এবং আপডেট সাবস্ক্রাইব করুন' : 'Subscribe to newsletter and updates'}</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareData}
                      onChange={(e) => setShareData(e.target.checked)}
                      className="mt-1"
                    />
                    <span className="text-sm text-foreground/80">{isBn ? 'আমাকে ব্যক্তিগতকৃত অভিজ্ঞতার জন্য ডেটা শেয়ার করতে দিন' : 'Share my data for personalized experience'}</span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      required
                      className="mt-1"
                    />
                    <span className="text-sm text-foreground/80">
                      {isBn ? 'আমি শর্তাবলী এবং গোপনীয়তা নীতি গ্রহণ করি' : 'I agree to the terms and privacy policy'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Navigation buttons for preferences step */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 rounded-xl transition-colors"
                >
                  {isBn ? 'পিছনে' : 'Back'}
                </button>
                <button
                  type="submit"
                  disabled={!agreeToTerms || isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isBn ? 'অ্যাকাউন���ট তৈরি করুন' : 'Create Account'}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Credentials Input Section */}
              {view === 'signup' && (
                <input
                  type="text"
                  placeholder={isBn ? "পূর্ণ নাম" : "Full Name"}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={view === 'signup'}
                  className="neo-input w-full p-4 text-base bg-muted rounded-xl focus:outline-none transition-colors placeholder:text-muted-foreground text-foreground"
                />
              )}

              <input
                type="email"
                placeholder={view === 'login' ? (isBn ? "ইমেল বা সাপোর্টার আইডি" : "Email or Supporter ID") : (isBn ? "ইমেল ঠিকানা" : "Email Address")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="neo-input w-full p-4 text-base bg-muted rounded-xl focus:outline-none transition-colors placeholder:text-muted-foreground text-foreground"
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isBn ? "পাসওয়ার্ড" : "Password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="neo-input w-full p-4 pr-14 text-base bg-muted rounded-xl focus:outline-none transition-all placeholder:text-muted-foreground text-foreground"
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

              {view === 'signup' && (
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={isBn ? "পাসওয়ার্ড নিশ্চিত করুন" : "Confirm Password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="neo-input w-full p-4 pr-14 text-base bg-muted rounded-xl focus:outline-none transition-all placeholder:text-muted-foreground text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showConfirmPassword ? (isBn ? "পাসওয়ার্ড লুকান" : "Hide password") : (isBn ? "পাসওয়ার্ড দেখান" : "Show password")}
                  >
                    {showConfirmPassword ? <EyeOff size={22} strokeWidth={1.5} /> : <Eye size={22} strokeWidth={1.5} />}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || (authStep === 'details' && view === 'signup' && !dateOfBirth)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-colors text-base disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                {isLoading
                  ? (isBn ? 'অপেক্ষা করুন...' : 'Loading...')
                  : view === 'login'
                    ? (isBn ? 'লগইন করুন' : 'Continue')
                    : authStep === 'credentials'
                      ? (isBn ? 'পরবর্তী' : 'Next')
                      : authStep === 'details'
                        ? (isBn ? 'পরবর্তী' : 'Next')
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

              {/* Show step indicator for signup */}
              {view === 'signup' && authStep !== 'otp' && (
                <div className="flex justify-center gap-2 py-4">
                  {(['credentials', 'details', 'preferences'] as const).map((step) => (
                    <div
                      key={step}
                      className={`h-1 rounded-full transition-all ${
                        authStep === step
                          ? 'w-8 bg-primary'
                          : ['credentials', 'details', 'preferences'].indexOf(step) < ['credentials', 'details', 'preferences'].indexOf(authStep)
                            ? 'w-3 bg-primary/50'
                            : 'w-3 bg-border'
                      }`}
                    />
                  ))}
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
              {isAppleLoading ? (isBn ? '��পেক্ষা করুন...' : 'Loading...') : (isBn ? `Apple দিয়ে ${view === 'login' ? 'সাইন ইন' : 'সাইন আপ'}` : `Sign ${view === 'login' ? 'in' : 'up'} with Apple`)}
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
