// Mock authentication for local development without Supabase
// This stores credentials in memory - only for development/demo purposes

interface MockUser {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "moderator" | "user"
  emailVerified: boolean
  phone?: string
  address?: string
  bio?: string
  avatar?: string
  website?: string
  dateOfBirth?: string
  position?: string
  jersey?: string
  height?: string
  weight?: string
  experience?: string
  foot?: string
  about?: string
}

// In-memory user storage
let mockUsers: MockUser[] = [
  {
    id: "admin-1",
    email: "admin@titanforce.com",
    password: "admin123",
    name: "Admin User",
    role: "admin",
    emailVerified: true,
    phone: "+880171234567",
    address: "Sylhet, Bangladesh",
    bio: "System Administrator",
  },
  {
    id: "admin-2",
    email: "shekhormohanray01@gmail.com",
    password: "1234567",
    name: "Shekhor Mohanray",
    role: "admin",
    emailVerified: true,
    phone: "+880171111111",
    address: "Mulikandi, Sylhet",
    bio: "Founder & Club Administrator",
    position: "Forward",
    jersey: "7",
    height: "5'10\"",
    weight: "75kg",
    experience: "10+ years",
    foot: "Right",
  },
  {
    id: "mod-1",
    email: "moderator@titanforce.com",
    password: "mod123",
    name: "Moderator User",
    role: "moderator",
    emailVerified: true,
    phone: "+880172222222",
    address: "Dhaka, Bangladesh",
    bio: "Content Moderator",
  },
]

// In-memory session storage
let mockSessions: Map<string, MockUser> = new Map()

export function mockSignInWithEmail(email: string, password: string): MockUser {
  const user = mockUsers.find((u) => u.email === email && u.password === password)
  
  if (!user) {
    throw new Error("Invalid email or password")
  }

  // Create session
  const sessionToken = `session-${Date.now()}-${Math.random()}`
  mockSessions.set(sessionToken, user)
  
  // Store in localStorage for client-side persistence
  if (typeof window !== "undefined") {
    localStorage.setItem("mockAuthToken", sessionToken)
    localStorage.setItem("mockAuthUser", JSON.stringify(user))
  }

  return user
}

export function mockGetSession(): MockUser | null {
  if (typeof window === "undefined") return null
  
  const sessionToken = localStorage.getItem("mockAuthToken")
  const userJson = localStorage.getItem("mockAuthUser")
  
  if (sessionToken && userJson) {
    try {
      const user = JSON.parse(userJson) as MockUser
      return user
    } catch {
      return null
    }
  }

  return null
}

export function mockSignOut(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("mockAuthToken")
    localStorage.removeItem("mockAuthUser")
  }
}

export function mockSignUpWithEmail(email: string, password: string, name: string): MockUser {
  const existing = mockUsers.find((u) => u.email === email)
  if (existing) {
    throw new Error("User already exists")
  }

  const newUser: MockUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
    role: "user",
    emailVerified: false,
  }

  mockUsers.push(newUser)
  return newUser
}

export function mockUpdateUserProfile(userId: string, updates: Partial<MockUser>): MockUser {
  const userIndex = mockUsers.findIndex((u) => u.id === userId)
  if (userIndex === -1) {
    throw new Error("User not found")
  }

  // Don't allow updating password or email through this method
  const { password, email, role, id, ...safeUpdates } = updates
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...safeUpdates }
  
  // Update localStorage if this is the current session
  if (typeof window !== "undefined") {
    const userJson = localStorage.getItem("mockAuthUser")
    if (userJson) {
      try {
        const currentUser = JSON.parse(userJson) as MockUser
        if (currentUser.id === userId) {
          localStorage.setItem("mockAuthUser", JSON.stringify(mockUsers[userIndex]))
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  return mockUsers[userIndex]
}

export function mockGetUserById(userId: string): MockUser | null {
  return mockUsers.find((u) => u.id === userId) || null
}

export function isMockAuthConfigured(): boolean {
  return true // Mock auth is always configured
}
