"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { getDataService, AppUser } from "@/lib/data-service"
import { FeatureProtectedRoute } from "@/components/feature-protected-route"
import { Search, UserPlus, Edit, Trash2, Shield, User, Users, X, Save, Mail, Calendar, Clock, Loader2, AlertCircle } from "lucide-react"

export default function AdminUsersPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [users, setUsers] = useState<AppUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState<AppUser | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user" as AppUser["role"],
    status: "active" as AppUser["status"],
    phone: "",
    location: "",
    bio: "",
  })

  const loadUsers = async () => {
    const retryOperation = async (operation: () => Promise<any>, maxRetries = 3): Promise<any> => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          return await operation()
        } catch (err) {
          if (i === maxRetries - 1) throw err
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
    }

    setIsLoading(true)
    setError(null)
    try {
      const dataService = getDataService()
      const filters: any = {}
      if (filterRole !== "all") filters.role = filterRole
      if (filterStatus !== "all") filters.status = filterStatus
      
      const usersData = await retryOperation(() => dataService.getAppUsers(filters))
      setUsers(usersData || [])
    } catch (err) {
      console.error("[v0] Error loading users:", err)
      setError(isBn ? "ব্যবহারকারী লোড করতে ব্যর্থ" : "Failed to load users")
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [filterRole, filterStatus])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleDelete = async (id: string) => {
    if (!confirm(isBn ? "আপনি কি নিশ্চিত?" : "Are you sure?")) return

    try {
      const dataService = getDataService()
      await dataService.deleteAppUser(id)
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      console.error("[v0] Error deleting user:", err)
      alert(isBn ? "ব্যবহারকারী মুছতে ব্যর্থ" : "Failed to delete user")
    }
  }

  const handleEdit = (user: AppUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      phone: user.phone || "",
      location: user.location || "",
      bio: user.bio || "",
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert(isBn ? "নাম এবং ইমেইল প্রয়োজন" : "Name and email are required")
      return
    }

    setIsSaving(true)
    try {
      const dataService = getDataService()

      if (editingUser) {
        const updated = await dataService.updateAppUser(editingUser.id, formData)
        setUsers(users.map(u => u.id === editingUser.id ? updated : u))
      } else {
        const newUser = await dataService.createAppUser({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          status: formData.status,
          phone: formData.phone || undefined,
          location: formData.location || undefined,
          bio: formData.bio || undefined,
        })
        setUsers([newUser, ...users])
      }

      resetForm()
    } catch (err) {
      console.error("[v0] Error saving user:", err)
      alert(isBn ? "ব্যবহারকারী সংরক্ষণ করতে ব্যর্থ" : "Failed to save user")
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "user",
      status: "active",
      phone: "",
      location: "",
      bio: "",
    })
    setShowModal(false)
    setEditingUser(null)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "player": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "fan": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "partner": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-400"
      case "inactive": return "bg-yellow-500/20 text-yellow-400"
      case "banned": return "bg-red-500/20 text-red-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <FeatureProtectedRoute requiredRole="admin" fallback="You don't have permission to access this page">
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="py-12 px-4 border-b border-secondary/20">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {isBn ? "ব্যবহারকারী ব্যবস্থাপনা" : "User Management"}
            </h1>
            <p className="text-foreground/60">
              {isBn ? "সমস্ত ব্যবহারকারী পরিচালনা করুন এবং তাদের ভূমিকা আপডেট করুন" : "Manage all users and update their roles"}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border-2 border-red-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex-1 relative w-full lg:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  placeholder={isBn ? "নাম বা ইমেইল দ্বারা অনুসন্ধান করুন..." : "Search by name or email..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground placeholder-foreground/40 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex gap-3 w-full lg:w-auto flex-wrap lg:flex-nowrap">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="flex-1 lg:flex-none px-4 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">{isBn ? "সব ভূমিকা" : "All Roles"}</option>
                  <option value="admin">{isBn ? "প্রশাসক" : "Admin"}</option>
                  <option value="player">{isBn ? "খেলোয়াড়" : "Player"}</option>
                  <option value="fan">{isBn ? "ভক্ত" : "Fan"}</option>
                  <option value="partner">{isBn ? "অংশীদার" : "Partner"}</option>
                  <option value="user">{isBn ? "ব্যবহারকারী" : "User"}</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="flex-1 lg:flex-none px-4 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="all">{isBn ? "সব স্ট্যাটাস" : "All Status"}</option>
                  <option value="active">{isBn ? "সক্রিয়" : "Active"}</option>
                  <option value="inactive">{isBn ? "নিষ্ক্রিয়" : "Inactive"}</option>
                  <option value="banned">{isBn ? "নিষিদ্ধ" : "Banned"}</option>
                </select>

                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-foreground hover:opacity-90 transition font-semibold"
                >
                  <UserPlus className="w-5 h-5" />
                  {isBn ? "নতুন ব্যবহারকারী" : "Add User"}
                </button>
              </div>
            </div>

            {/* Users Table */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-foreground/30 mx-auto mb-4" />
                <p className="text-foreground/60">{isBn ? "কোন ব্যবহারকারী পাওয়া যায়নি" : "No users found"}</p>
              </div>
            ) : (
              <div className="overflow-x-auto border-2 border-secondary/30 rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-secondary/30 bg-secondary/10">
                      <th className="px-4 py-3 text-left font-bold text-foreground">{isBn ? "নাম" : "Name"}</th>
                      <th className="px-4 py-3 text-left font-bold text-foreground">{isBn ? "ইমেইল" : "Email"}</th>
                      <th className="px-4 py-3 text-left font-bold text-foreground">{isBn ? "ভূমিকা" : "Role"}</th>
                      <th className="px-4 py-3 text-left font-bold text-foreground">{isBn ? "স্ট্যাটাস" : "Status"}</th>
                      <th className="px-4 py-3 text-left font-bold text-foreground">{isBn ? "যোগ দিয়েছেন" : "Joined"}</th>
                      <th className="px-4 py-3 text-right font-bold text-foreground">{isBn ? "ক্রিয়া" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-secondary/30 hover:bg-secondary/10 transition">
                        <td className="px-4 py-3 font-medium text-foreground">{user.name}</td>
                        <td className="px-4 py-3 text-foreground/60 text-sm">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getRoleColor(user.role)}`}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground/60">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-1.5 rounded hover:bg-blue-500/20 text-blue-400 transition"
                              title={isBn ? "সম্পাদনা করুন" : "Edit"}
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-red-400 transition"
                              title={isBn ? "মুছুন" : "Delete"}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-secondary rounded-lg p-6 max-w-md w-full border-2 border-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground">
                  {editingUser ? (isBn ? "ব্যবহারকারী সম্পাদনা করুন" : "Edit User") : (isBn ? "নতুন ব্যবহারকারী যোগ করুন" : "Add New User")}
                </h3>
                <button onClick={resetForm} className="text-foreground/60 hover:text-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {isBn ? "নাম" : "Name"}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {isBn ? "ইমেইল" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {isBn ? "ভূমিকা" : "Role"}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as AppUser["role"] })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="user">{isBn ? "ব্যবহারকারী" : "User"}</option>
                    <option value="player">{isBn ? "খেলোয়াড়" : "Player"}</option>
                    <option value="fan">{isBn ? "ভক্ত" : "Fan"}</option>
                    <option value="partner">{isBn ? "অংশীদার" : "Partner"}</option>
                    <option value="admin">{isBn ? "প্রশাসক" : "Admin"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {isBn ? "স্ট্যাটাস" : "Status"}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AppUser["status"] })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="active">{isBn ? "সক্রিয়" : "Active"}</option>
                    <option value="inactive">{isBn ? "নিষ্ক্রিয়" : "Inactive"}</option>
                    <option value="banned">{isBn ? "নিষিদ্ধ" : "Banned"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {isBn ? "ফোন" : "Phone"}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {isBn ? "অবস্থান" : "Location"}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-1">
                    {isBn ? "জীবনী" : "Bio"}
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border-2 border-secondary/30 bg-secondary/10 text-foreground focus:outline-none focus:border-primary resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary transition font-semibold"
                >
                  {isBn ? "বাতিল করুন" : "Cancel"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-foreground hover:opacity-90 transition font-semibold disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {isBn ? "সংরক্ষণ করছি..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isBn ? "সংরক্ষণ করুন" : "Save"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </FeatureProtectedRoute>
  )
}
