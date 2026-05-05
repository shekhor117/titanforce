'use client'

import { useState } from 'react'
import { useLanguage } from '@/lib/language-context'
import { Check, X, User, Heart, Handshake, Clock, CheckCircle, XCircle } from 'lucide-react'

type UserRole = 'player' | 'fan' | 'partner'
type ApprovalStatus = 'pending' | 'approved' | 'rejected'

interface PendingUser {
  id: string
  name: string
  email: string
  role: UserRole
  status: ApprovalStatus
  createdAt: string
  avatar?: string
}

// Mock data - replace with Supabase queries
const mockUsers: PendingUser[] = [
  { id: '1', name: 'Rahim Ahmed', email: 'rahim@example.com', role: 'player', status: 'pending', createdAt: '2024-01-15' },
  { id: '2', name: 'Karim Sports Ltd', email: 'contact@karimsports.com', role: 'partner', status: 'pending', createdAt: '2024-01-14' },
  { id: '3', name: 'Jamal Khan', email: 'jamal@example.com', role: 'player', status: 'approved', createdAt: '2024-01-13' },
  { id: '4', name: 'Farhan Ali', email: 'farhan@example.com', role: 'fan', status: 'approved', createdAt: '2024-01-12' },
  { id: '5', name: 'Sporting Goods Inc', email: 'info@sportinggoods.com', role: 'partner', status: 'rejected', createdAt: '2024-01-11' },
]

export default function AdminUsersPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  const [users, setUsers] = useState<PendingUser[]>(mockUsers)
  const [filter, setFilter] = useState<'all' | UserRole>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | ApprovalStatus>('all')

  const handleApprove = async (userId: string) => {
    // TODO: Update Supabase
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'approved' as ApprovalStatus } : u))
  }

  const handleReject = async (userId: string) => {
    // TODO: Update Supabase
    setUsers(users.map(u => u.id === userId ? { ...u, status: 'rejected' as ApprovalStatus } : u))
  }

  const filteredUsers = users.filter(u => {
    if (filter !== 'all' && u.role !== filter) return false
    if (statusFilter !== 'all' && u.status !== statusFilter) return false
    return true
  })

  const pendingCount = users.filter(u => u.status === 'pending').length

  const roleIcons: Record<UserRole, React.ReactNode> = {
    player: <User className="w-4 h-4" />,
    fan: <Heart className="w-4 h-4" />,
    partner: <Handshake className="w-4 h-4" />,
  }

  const statusColors: Record<ApprovalStatus, string> = {
    pending: 'bg-yellow-500/20 text-yellow-500',
    approved: 'bg-green-500/20 text-green-500',
    rejected: 'bg-red-500/20 text-red-500',
  }

  const statusIcons: Record<ApprovalStatus, React.ReactNode> = {
    pending: <Clock className="w-3 h-3" />,
    approved: <CheckCircle className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
            {isBn ? 'ব্যবহারকারী অনুমোদন' : 'User Approvals'}
          </h1>
          <p className={`text-foreground/60 ${isBn ? 'font-[var(--font-bengali)]' : ''}`}>
            {isBn ? 'নতুন সদস্যদের অনুমোদন পরিচালনা করুন' : 'Manage new member approvals'}
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="px-4 py-2 bg-yellow-500/20 text-yellow-500 rounded-lg font-semibold">
            {pendingCount} {isBn ? 'অপেক্ষমান' : 'Pending'}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          <span className="text-foreground/60 text-sm self-center">{isBn ? 'ভূমিকা:' : 'Role:'}</span>
          {(['all', 'player', 'fan', 'partner'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                filter === r 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {r === 'all' ? (isBn ? 'সব' : 'All') : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <span className="text-foreground/60 text-sm self-center">{isBn ? 'স্ট্যাটাস:' : 'Status:'}</span>
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                statusFilter === s 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-foreground hover:bg-secondary/80'
              }`}
            >
              {s === 'all' ? (isBn ? 'সব' : 'All') : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border-2 border-secondary bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/50">
            <tr>
              <th className="text-left p-4 text-foreground/60 text-sm font-medium">{isBn ? 'ব্যবহারকারী' : 'User'}</th>
              <th className="text-left p-4 text-foreground/60 text-sm font-medium">{isBn ? 'ভূমিকা' : 'Role'}</th>
              <th className="text-left p-4 text-foreground/60 text-sm font-medium">{isBn ? 'স্ট্যাটাস' : 'Status'}</th>
              <th className="text-left p-4 text-foreground/60 text-sm font-medium">{isBn ? 'তারিখ' : 'Date'}</th>
              <th className="text-right p-4 text-foreground/60 text-sm font-medium">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-secondary hover:bg-secondary/20 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-foreground font-medium">{user.name}</div>
                      <div className="text-foreground/50 text-sm">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-foreground/80">
                    {roleIcons[user.role]}
                    <span className="capitalize">{user.role}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                    {statusIcons[user.status]}
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="p-4 text-foreground/60 text-sm">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {user.status === 'pending' && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApprove(user.id)}
                        className="p-2 rounded-lg bg-green-500/20 text-green-500 hover:bg-green-500/30 transition"
                        title="Approve"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(user.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center text-foreground/50">
            {isBn ? 'কোনো ব্যবহারকারী পাওয়া যায়নি' : 'No users found'}
          </div>
        )}
      </div>
    </div>
  )
}
