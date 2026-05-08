"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { CheckCircle, XCircle, Clock, Users, Trash2, Edit, X, Save, Plus } from "lucide-react"

interface Fan {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export default function AdminFans() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [showForm, setShowForm] = useState(false)
  const [editingFan, setEditingFan] = useState<Fan | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [fans, setFans] = useState<Fan[]>([])

  const handleSaveFan = () => {
    if (!formData.name || !formData.email) {
      alert(isBn ? "নাম এবং ইমেইল প্রয়োজন" : "Name and email are required")
      return
    }

    if (editingFan) {
      setFans(fans.map(f => 
        f.id === editingFan.id 
          ? { 
              ...f, 
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            } 
          : f
      ))
      setEditingFan(null)
    } else {
      const newFan: Fan = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar_url: null,
        status: "approved",
        created_at: new Date().toLocaleDateString(),
      }
      setFans([...fans, newFan])
    }
    
    resetForm()
  }

  const handleEditFan = (fan: Fan) => {
    setEditingFan(fan)
    setFormData({
      name: fan.name,
      email: fan.email,
      phone: fan.phone || "",
    })
    setShowForm(true)
  }

  const handleDeleteFan = async (fanId: string) => {
    if (!confirm(isBn ? "এই অনুরাগী মুছতে চান?" : "Delete this fan?")) return
    setFans(fans.filter((f) => f.id !== fanId))
  }

  const handleApprove = async (fanId: string) => {
    setFans(fans.map(f => 
      f.id === fanId ? { ...f, status: "approved" as const } : f
    ))
  }

  const handleReject = async (fanId: string) => {
    if (!confirm(isBn ? "এই অনুরাগী প্রত্যাখ্যান করতে চান?" : "Reject this fan?")) return
    setFans(fans.map(f => 
      f.id === fanId ? { ...f, status: "rejected" as const } : f
    ))
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "" })
    setShowForm(false)
    setEditingFan(null)
  }

  const filteredFans = filter === "all" ? fans : fans.filter(f => f.status === filter)
  const totalFans = fans.filter(f => f.status === "approved").length
  const pendingCount = fans.filter(f => f.status === "pending").length

  const statusBadge = (status: Fan["status"]) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      approved: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
    }
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      approved: <CheckCircle className="w-3 h-3" />,
      rejected: <XCircle className="w-3 h-3" />,
    }
    const labels = {
      pending: isBn ? "অপেক্ষমান" : "Pending",
      approved: isBn ? "অনুমোদিত" : "Approved",
      rejected: isBn ? "প্রত্যাখ্যান" : "Rejected",
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
        {icons[status]} {labels[status]}
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
          {pendingCount > 0 && (
            <p className="text-yellow-500 text-sm mt-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {pendingCount} {isBn ? "অনুমোদনের অপেক্ষায়" : "pending approval"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 border border-primary/30">
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

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
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
            {tab === "pending" && (isBn ? "অপেক্ষমান" : "Pending")}
            {tab === "approved" && (isBn ? "অনুমোদিত" : "Approved")}
            {tab === "rejected" && (isBn ? "প্রত্যাখ্যান" : "Rejected")}
            {tab === "pending" && pendingCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-xs">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
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
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="email"
                placeholder={isBn ? "ইমেইল" : "Email"}
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="tel"
                placeholder={isBn ? "ফোন (ঐচ্ছিক)" : "Phone (optional)"}
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
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
                {isBn ? "ফোন" : "Phone"}
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
                    <span className="text-sm text-foreground">{fan.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-foreground/80">{fan.email}</td>
                <td className="px-4 py-3 text-sm text-foreground/80">{fan.phone || "-"}</td>
                <td className="px-4 py-3">{statusBadge(fan.status)}</td>
                <td className="px-4 py-3 text-sm text-foreground">{fan.created_at}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {fan.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(fan.id)}
                          className="p-2 rounded hover:bg-green-500/20 transition text-green-400"
                          title={isBn ? "অনুমোদন করুন" : "Approve"}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(fan.id)}
                          className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                          title={isBn ? "প্রত্যাখ্যান করুন" : "Reject"}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
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
