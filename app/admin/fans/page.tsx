"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { dataStore, Fan } from "@/lib/data-store"
import { CheckCircle, XCircle, Clock, Users, Trash2, Edit, X, Save, Plus, Search } from "lucide-react"
import { PageEntrance } from '@/components/page-entrance'

export default function AdminFans() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [filter, setFilter] = useState<"all" | "regular" | "premium" | "vip">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingFan, setEditingFan] = useState<Fan | null>(null)
  const [fans, setFans] = useState<Fan[]>([])
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membershipType: "regular" as Fan["membershipType"],
    status: "active" as Fan["status"],
  })
  
  useEffect(() => {
    setIsClient(true)
    const fansData = dataStore.getFans()
    setFans(Array.isArray(fansData) ? fansData : [])
  }, [])

  const handleSaveFan = () => {
    if (!formData.name || !formData.email) {
      alert(isBn ? "নাম এবং ইমেইল প্রয়োজন" : "Name and email are required")
      return
    }

    const fanData: Omit<Fan, "id"> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      membershipType: formData.membershipType,
      joinDate: new Date().toLocaleDateString(),
      status: formData.status,
    }

    if (editingFan) {
      dataStore.updateFan(editingFan.id, fanData)
    } else {
      dataStore.addFan(fanData)
    }
    
    resetForm()
  }

  const handleEditFan = (fan: Fan) => {
    setEditingFan(fan)
    setFormData({
      name: fan.name,
      email: fan.email,
      phone: fan.phone || "",
      membershipType: fan.membershipType,
      status: fan.status,
    })
    setShowForm(true)
  }

  const handleDeleteFan = async (fanId: string) => {
    if (!confirm(isBn ? "এই অনুরাগী মুছতে চান?" : "Delete this fan?")) return
    dataStore.deleteFan(fanId)
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", membershipType: "regular", status: "active" })
    setShowForm(false)
    setEditingFan(null)
  }

  const filteredFans = fans
    .filter(f => filter === "all" || f.membershipType === filter)
    .filter(f => 
      searchTerm === "" || 
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const totalFans = fans.filter(f => f.status === "active").length

  const membershipBadge = (type: Fan["membershipType"]) => {
    const styles = {
      regular: "bg-gray-500/20 text-gray-400",
      premium: "bg-blue-500/20 text-blue-400",
      vip: "bg-yellow-500/20 text-yellow-400",
    }
    const labels = {
      regular: isBn ? "রেগুলার" : "Regular",
      premium: isBn ? "প্রিমিয়াম" : "Premium",
      vip: "VIP",
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[type]}`}>
        {labels[type]}
      </span>
    )
  }

  const statusBadge = (status: Fan["status"]) => {
    const styles = {
      active: "bg-green-500/20 text-green-400",
      pending: "bg-yellow-500/20 text-yellow-400",
    }
    const labels = {
      active: isBn ? "সক্রিয়" : "Active",
      pending: isBn ? "অপেক্ষমান" : "Pending",
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "অনুরাগী ব্যবস্থাপনা" : "Fan Management"}
          </h1>
          <p className="text-foreground/60 text-sm mt-1">
            {fans.length} {isBn ? "জন অনুরাগী" : "fans"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 neo-input/30">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <div className="text-2xl font-[var(--font-display)] text-primary">{totalFans}</div>
              <div className={`text-xs text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "মোট অনুরাগী" : "Total Fans"}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            <Plus className="w-4 h-4" />
            {isBn ? "অনুরাগী যোগ করুন" : "Add Fan"}
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder={isBn ? "খোঁজ করুন..." : "Search fans..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "regular", "premium", "vip"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filter === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
              }`}
            >
              {tab === "all" && (isBn ? "সব" : "All")}
              {tab === "regular" && (isBn ? "রেগুলার" : "Regular")}
              {tab === "premium" && (isBn ? "প্রিমিয়াম" : "Premium")}
              {tab === "vip" && "VIP"}
            </button>
          ))}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="rounded-xl border-2 border-primary bg-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {editingFan 
                ? (isBn ? "অনুরাগী সম্পাদনা" : "Edit Fan")
                : (isBn ? "নতুন অনুরাগী" : "New Fan")
              }
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-secondary/20 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder={isBn ? "নাম" : "Name"}
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
              />
              <input
                type="email"
                placeholder={isBn ? "ইমেইল" : "Email"}
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
              />
              <input
                type="tel"
                placeholder={isBn ? "ফোন (ঐচ্ছিক)" : "Phone (optional)"}
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <select
                value={formData.membershipType}
                onChange={(e) => setFormData((prev) => ({ ...prev, membershipType: e.target.value as Fan["membershipType"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
              >
                <option value="regular">{isBn ? "রেগুলার" : "Regular"}</option>
                <option value="premium">{isBn ? "প্রিমিয়াম" : "Premium"}</option>
                <option value="vip">VIP</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as Fan["status"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent outline-none"
              >
                <option value="active">{isBn ? "সক্রিয়" : "Active"}</option>
                <option value="pending">{isBn ? "অপেক্ষমান" : "Pending"}</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSaveFan}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <Save className="w-4 h-4" />
                {editingFan ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "সংরক্ষণ করুন" : "Save")}
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
      )}

      {/* Fans Table */}
      <div className="rounded-xl border-2 border-secondary bg-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "নাম" : "Name"}
              </th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold">Email</th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সদস্যপদ" : "Membership"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অবস্থা" : "Status"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "যোগ হয়েছে" : "Joined"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "কার্যক্রম" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFans.map((fan) => (
              <tr key={fan.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                      {fan.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm text-foreground">{fan.name}</span>
                      {fan.phone && <p className="text-xs text-foreground/60">{fan.phone}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground/80">{fan.email}</td>
                <td className="px-4 py-3">{membershipBadge(fan.membershipType)}</td>
                <td className="px-4 py-3">{statusBadge(fan.status)}</td>
                <td className="px-4 py-3 text-sm text-foreground">{fan.joinDate}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleEditFan(fan)}
                      className="p-2 rounded hover:bg-primary/20 transition text-primary"
                      title={isBn ? "সম্পাদনা করুন" : "Edit"}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFan(fan.id)}
                      className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
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
        {filteredFans.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
              {isBn ? "কোন অনুরাগী পাওয়া যায়নি" : "No fans found"}
            </p>
            <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "নতুন অনুরাগী যোগ করতে উপরের বোতাম ক্লিক করুন" : "Click the button above to add a new fan"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
