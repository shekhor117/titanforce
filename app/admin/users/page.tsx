"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Search, UserPlus, Edit, Trash2, Shield, User, Users } from "lucide-react"

interface UserData {
  id: string
  name: string
  email: string
  role: "admin" | "player" | "fan" | "partner"
  status: "active" | "inactive"
  joinedAt: string
}

const mockUsers: UserData[] = [
  { id: "1", name: "Admin User", email: "admin@titanforce.com", role: "admin", status: "active", joinedAt: "2026-08-9" },,
]

export default function AdminUsersPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [users, setUsers] = useState<UserData[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleDelete = (id: string) => {
    if (confirm(isBn ? "আপনি কি নিশ্চিত?" : "Are you sure?")) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/20 text-red-400"
      case "player": return "bg-green-500/20 text-green-400"
      case "fan": return "bg-blue-500/20 text-blue-400"
      case "partner": return "bg-yellow-500/20 text-yellow-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="w-4 h-4" />
      case "player": return <User className="w-4 h-4" />
      case "fan": return <Users className="w-4 h-4" />
      case "partner": return <Users className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ব্যবহারকারী ব্যবস্থাপনা" : "User Management"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "সমস্ত ব্যবহারকারী পরিচালনা করুন" : "Manage all registered users"}
          </p>
        </div>
        <button
          onClick={() => { setEditingUser(null); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span className={isBn ? "font-[var(--font-bengali)]" : ""}>{isBn ? "নতুন ব্যবহারকারী" : "Add User"}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder={isBn ? "ব্যবহারকারী খুঁজুন..." : "Search users..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:border-primary outline-none ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className={`px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:border-primary outline-none ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <option value="all">{isBn ? "সব ভূমিকা" : "All Roles"}</option>
          <option value="admin">{isBn ? "অ্যাডমিন" : "Admin"}</option>
          <option value="player">{isBn ? "খেলোয়াড়" : "Player"}</option>
          <option value="fan">{isBn ? "ভক্ত" : "Fan"}</option>
          <option value="partner">{isBn ? "অংশীদার" : "Partner"}</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border-2 border-secondary bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/50">
              <tr>
                <th className={`text-left px-4 py-3 text-sm uppercase tracking-wider text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "নাম" : "Name"}
                </th>
                <th className={`text-left px-4 py-3 text-sm uppercase tracking-wider text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ইমেইল" : "Email"}
                </th>
                <th className={`text-left px-4 py-3 text-sm uppercase tracking-wider text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ভূমিকা" : "Role"}
                </th>
                <th className={`text-left px-4 py-3 text-sm uppercase tracking-wider text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "অবস্থা" : "Status"}
                </th>
                <th className={`text-left px-4 py-3 text-sm uppercase tracking-wider text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "যোগদান" : "Joined"}
                </th>
                <th className={`text-right px-4 py-3 text-sm uppercase tracking-wider text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "কার্যক্রম" : "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-secondary/30 transition">
                  <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                  <td className="px-4 py-3 text-foreground/70">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs uppercase ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs uppercase ${user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{user.joinedAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingUser(user); setShowModal(true) }}
                        className="p-2 rounded hover:bg-primary/20 text-primary transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded hover:bg-red-500/20 text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: isBn ? "মোট ব্যবহারকারী" : "Total Users", value: users.length, color: "text-primary" },
          { label: isBn ? "অ্যাডমিন" : "Admins", value: users.filter(u => u.role === "admin").length, color: "text-red-400" },
          { label: isBn ? "খেলোয়াড়" : "Players", value: users.filter(u => u.role === "player").length, color: "text-green-400" },
          { label: isBn ? "ভক্ত" : "Fans", value: users.filter(u => u.role === "fan").length, color: "text-blue-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`text-xs text-foreground/60 uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
