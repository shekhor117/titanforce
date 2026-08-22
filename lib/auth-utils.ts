import { createClient } from "@/lib/supabase/client"

export interface AuthUser {
  id: string
  email: string
  name: string
  role: "admin" | "moderator" | "user"
  emailVerified: boolean
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<{ user: AuthUser; requiresVerification: boolean }> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? 
        `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error("Failed to create user")
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email || "",
      name: name,
      role: "user",
      emailVerified: data.user.email_confirmed_at ? true : false,
    },
    requiresVerification: !data.user.email_confirmed_at,
  }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const supabase = createClient()
  if (!supabase) {
    throw new Error("Authentication is not configured")
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  if (!data.user) {
    throw new Error("Failed to sign in")
  }

  // Get admin role from user metadata
  const role = (data.user.user_metadata?.role as "admin" | "moderator") || "user"

  return {
    id: data.user.id,
    email: data.user.email || "",
    name: data.user.user_metadata?.full_name || "User",
    role,
    emailVerified: data.user.email_confirmed_at ? true : false,
  }
}

export async function signOut(): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createClient()
  
  if (!supabase) {
    return null
  }

  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    return null
  }

  const role = (data.user.user_metadata?.role as "admin" | "moderator") || "user"

  return {
    id: data.user.id,
    email: data.user.email || "",
    name: data.user.user_metadata?.full_name || "User",
    role,
    emailVerified: data.user.email_confirmed_at ? true : false,
  }
}

export async function signUpWithRole(
  email: string,
  password: string,
  name: string,
  role: "player" | "fan" | "partner"
): Promise<void> {
  await signUpWithEmail(email, password, name)

  const supabase = createClient()
  const { error } = await supabase.auth.updateUser({
    data: { signupRole: role },
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function sendPasswordReset(email: string): Promise<void> {
  const supabase = createClient()
  
  if (!supabase) {
    throw new Error("Authentication is not configured")
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/auth/reset-password`,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export function validatePassword(password: string): {
  isValid: boolean
  strength: "weak" | "medium" | "strong"
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters")
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain lowercase letters")
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain uppercase letters")
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain numbers")
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push("Password must contain special characters")
  }

  let strength: "weak" | "medium" | "strong" = "weak"
  if (errors.length === 0) {
    strength = "strong"
  } else if (errors.length <= 2) {
    strength = "medium"
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  }
}

export function getPasswordStrengthColor(strength: "weak" | "medium" | "strong"): string {
  switch (strength) {
    case "weak":
      return "bg-red-500"
    case "medium":
      return "bg-yellow-500"
    case "strong":
      return "bg-green-500"
  }
}
