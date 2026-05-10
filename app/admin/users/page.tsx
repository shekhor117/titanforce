"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { dataStore, AdminUser, useDataStore } from "@/lib/data-store"
import { Search, UserPlus, Edit, Trash2, Shield, User, Users, X, Save, Mail, Calendar, Clock } from "lucide-react"

export default function AdminUsersPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const users = useDataStore(dataStore.getAdminUsers, "adminUsers")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "fan" as AdminUser["role"],
    status: "active" as AdminUser["status"],
  })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === "all" || user.role === filterRole
    return matchesSearch && matchesRole
  })

  const handleDelete = (id: string) => {
    if (confirm(isBn ? "আপনি কি নিশ্চিত?" : "Are you sure?")) {
      dataStore.deleteAdminUser(id)
    }
  }

  const handleEdit = (user: AdminUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert(isBn ? "নাম এবং ইমেইল প্রয়োজন" : "Name and email are required")
      return
    }

    if (editingUser) {
      dataStore.updateAdminUser(editingUser.id, formData)
    } else {
      dataStore.addAdminUser({
        ...formData,
        joinedAt: new Date().toISOString().split("T")[0],
      })
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", role: "fan", status: "active" })
    setShowModal(false)
    setEditingUser(null)
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

  const getRoleLabel = (role: string) => {
    const labels: Record<string, { en: string; bn: string }> = {
      admin: { en: "Admin", bn: "অ্যাডমিন" },
      player: { en: "Player", bn: "খেলোয়াড়" },
      fan: { en: "Fan", bn: "ভক্ত" },
      partner: { en: "Partner", bn: "অংশীদার" },
    }
    return labels[role]?.[isBn ? "bn" : "en"] || role
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
            {users.length} {isBn ? "জন ব্যবহারকারী" : "users"}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true) }}
          className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <UserPlus className="w-4 h-4" />
          {isBn ? "নতুন ব্যবহারকারী" : "Add User"}
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
        <div className="flex gap-2 flex-wrap">
          {(["all", "admin", "player", "fan", "partner"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filterRole === role
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
              } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {role === "all" ? (isBn ? "সব" : "All") : getRoleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border-2 border-primary p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {editingUser 
                  ? (isBn ? "ব্যবহারকারী সম্পাদনা" : "Edit User")
                  : (isBn ? "নতুন ব্যবহারকারী" : "New User")
                }
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-secondary/20 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "নাম" : "Name"}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  placeholder={isBn ? "নাম লিখুন" : "Enter name"}
                />
              </div>
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ইমেইল" : "Email"}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  placeholder={isBn ? "ইমেইল লিখুন" : "Enter email"}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ভূমিকা" : "Role"}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as AdminUser["role"] }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  >
                    <option value="admin">{isBn ? "অ্যাডমিন" : "Admin"}</option>
                    <option value="player">{isBn ? "খেলোয়াড়" : "Player"}</option>
                    <option value="fan">{isBn ? "ভক্ত" : "Fan"}</option>
                    <option value="partner">{isBn ? "অংশীদার" : "Partner"}</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "অবস্থা" : "Status"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as AdminUser["status"] }))}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                  >
                    <option value="active">{isBn ? "সক্রিয়" : "Active"}</option>
                    <option value="inactive">{isBn ? "নিষ্ক্রিয়" : "Inactive"}</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleSave}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  <Save className="w-4 h-4" />
                  {editingUser ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "সংরক্ষণ করুন" : "Save")}
                </button>
                <button
                  onClick={resetForm}
                  className={`px-4 py-2 rounded border-2 border-secondary hover:bg-secondary/10 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs uppercase ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs uppercase ${user.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}>
                      {user.status === "active" ? (isBn ? "সক্রিয়" : "Active") : (isBn ? "নিষ্ক্রিয়" : "Inactive")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {user.joinedAt}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded hover:bg-primary/20 text-primary transition"
                        title={isBn ? "সম্পাদনা করুন" : "Edit"}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-2 rounded hover:bg-red-500/20 text-red-400 transition"
                        title={isBn ? "মুছুন" : "Delete"}
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
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
              {isBn ? "কোন ব্যবহারকারী পাওয়া যায়নি" : "No users found"}
            </p>
            <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "নতুন ব্যবহারকারী যোগ করতে উপরের বোতাম ক্লিক করুন" : "Click the button above to add a new user"}
            </p>
          </div>
        )}
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
