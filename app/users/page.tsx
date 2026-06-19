'use client'

import { useEffect, useState } from 'react'
import { Search, Users, Shield, Users2 } from 'lucide-react'
import { getDataService, type AppUser } from '@/lib/data-service'

function UserCard({ user }: { user: AppUser }) {
  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/20 text-red-400 border-red-500/30',
    player: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    fan: 'bg-green-500/20 text-green-400 border-green-500/30',
    partner: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    user: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Shield
      case 'player':
        return Users2
      default:
        return Users
    }
  }

  const RoleIcon = getRoleIcon(user.role)

  return (
    <div className="rounded-lg border-2 border-secondary/30 bg-secondary/10 backdrop-blur-sm p-4 hover:border-primary/50 transition-all group hover:scale-105">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border-2 border-primary/30"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 border-2 border-primary/30">
            <Users className="w-8 h-8 text-foreground/60" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {user.name}
          </h3>
          <p className="text-sm text-foreground/60 truncate">{user.email}</p>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${roleColors[user.role]}`}>
              <RoleIcon className="w-3.5 h-3.5" />
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
            {user.location && (
              <span className="text-xs text-foreground/50 px-2.5 py-1 rounded-full bg-secondary/50">
                {user.location}
              </span>
            )}
          </div>

          {user.bio && (
            <p className="text-xs text-foreground/50 mt-2 line-clamp-2">
              {user.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function UserGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-lg border-2 border-secondary/30 bg-secondary/10 p-4 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-secondary" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-secondary rounded w-2/3" />
              <div className="h-4 bg-secondary rounded w-1/2" />
              <div className="h-6 bg-secondary rounded w-1/4 mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function UsersContent() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const dataService = getDataService()
        const fetchedUsers = await dataService.getAppUsers({ status: 'active' })
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('[v0] Error fetching users:', error)
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <UserGridSkeleton />
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">No Users Found</h3>
        <p className="text-foreground/60">There are no active users to display.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  )
}

export default function UsersPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 px-4 border-b border-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Users className="w-6 h-6 text-foreground" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Our Community</h1>
          </div>
          <p className="text-lg text-foreground/60 max-w-2xl">
            Meet the members of our vibrant TitanForce Mulikandi community. Connect with players, fans, and partners who share the passion for football.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 border-b border-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Users Grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <UsersContent />
        </div>
      </section>
    </main>
  )
}
