"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock, ExternalLink, X, Save } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"

interface Partner {
  id: string
  name: string
  email: string
  company_name: string
  partnership_type: "sponsor" | "media" | "equipment" | "other"
  website: string | null
  value: string
  logo_url?: string
  status: "pending" | "approved" | "rejected"
}

export default function AdminPartners() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_name: "",
    partnership_type: "sponsor" as Partner["partnership_type"],
    website: "",
    value: "",
    logo: { signedUrl: "", filePath: "" },
  })
  const [partners, setPartners] = useState<Partner[]>([])

  const handleLogoUpload = (data: { signedUrl: string; filePath: string }) => {
    setFormData((prev) => ({ ...prev, logo: data }))
  }

  const handleLogoDelete = () => {
    setFormData((prev) => ({ ...prev, logo: { signedUrl: "", filePath: "" } }))
  }

  const handleApprove = async (partnerId: string) => {
    setPartners(partners.map(p => 
      p.id === partnerId ? { ...p, status: "approved" as const } : p
    ))
  }

  const handleReject = async (partnerId: string) => {
    if (!confirm(isBn ? "এই অংশীদারিত্ব প্রত্যাখ্যান করতে চান?" : "Reject this partnership?")) return
    setPartners(partners.map(p => 
      p.id === partnerId ? { ...p, status: "rejected" as const } : p
    ))
  }

  const handleSavePartner = () => {
    if (!formData.company_name || !formData.email) {
      alert(isBn ? "সব ফিল্ড পূরণ করুন" : "Please fill all required fields")
      return
    }

    if (editingPartner) {
      setPartners(partners.map(p => 
        p.id === editingPartner.id 
          ? { 
              ...p,
              name: formData.name,
              email: formData.email,
              company_name: formData.company_name,
              partnership_type: formData.partnership_type,
              website: formData.website || null,
              value: formData.value,
              logo_url: formData.logo.signedUrl,
            } 
          : p
      ))
      setEditingPartner(null)
    } else {
      const newPartner: Partner = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        company_name: formData.company_name,
        partnership_type: formData.partnership_type,
        website: formData.website || null,
        value: formData.value,
        logo_url: formData.logo.signedUrl,
        status: "approved",
      }
      setPartners([...partners, newPartner])
    }
    
    resetForm()
  }

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      email: partner.email,
      company_name: partner.company_name,
      partnership_type: partner.partnership_type,
      website: partner.website || "",
      value: partner.value,
      logo: { signedUrl: partner.logo_url || "", filePath: "" },
    })
    setShowForm(true)
  }

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm(isBn ? "এই অংশীদার মুছতে চান?" : "Delete this partner?")) return
    setPartners(partners.filter((p) => p.id !== partnerId))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      company_name: "",
      partnership_type: "sponsor",
      website: "",
      value: "",
      logo: { signedUrl: "", filePath: "" },
    })
    setShowForm(false)
    setEditingPartner(null)
  }

  const filteredPartners = filter === "all" ? partners : partners.filter(p => p.status === filter)
  const pendingCount = partners.filter(p => p.status === "pending").length

  const statusBadge = (status: Partner["status"]) => {
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

  const typeBadge = (type: Partner["partnership_type"]) => {
    const styles = {
      sponsor: "bg-primary/20 text-primary",
      media: "bg-blue-500/20 text-blue-400",
      equipment: "bg-purple-500/20 text-purple-400",
      other: "bg-gray-500/20 text-gray-400",
    }
    const labels = {
      sponsor: isBn ? "স্পন্সর" : "Sponsor",
      media: isBn ? "মিডিয়া" : "Media",
      equipment: isBn ? "সরঞ্জাম" : "Equipment",
      other: isBn ? "অন্যান্য" : "Other",
    }
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[type]}`}>
        {labels[type]}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-3xl tracking-wider text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "অংশীদার ব্যবস্থাপনা" : "Partner Management"}
          </h1>
          {pendingCount > 0 && (
            <p className="text-yellow-500 text-sm mt-1 flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {pendingCount} {isBn ? "অনুমোদনের অপেক্ষায়" : "pending approval"}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "অংশীদার যোগ করুন" : "Add Partner"}
        </button>
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
              {editingPartner 
                ? (isBn ? "অংশীদার সম্পাদনা" : "Edit Partner")
                : (isBn ? "নতুন অংশীদার" : "New Partner")
              }
            </h3>
            <button onClick={resetForm} className="p-2 hover:bg-secondary/20 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "লোগো" : "Logo"}
              </label>
              <PhotoUpload
                currentPhoto={formData.logo.signedUrl}
                currentFilePath={formData.logo.filePath}
                onPhotoUpload={handleLogoUpload}
                onPhotoDelete={handleLogoDelete}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={isBn ? "কোম্পানির নাম" : "Company Name"}
                value={formData.company_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, company_name: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <input
                type="text"
                placeholder={isBn ? "যোগাযোগকারীর নাম" : "Contact Name"}
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
                type="url"
                placeholder={isBn ? "ওয়েবসাইট" : "Website"}
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <select
                value={formData.partnership_type}
                onChange={(e) => setFormData((prev) => ({ ...prev, partnership_type: e.target.value as Partner["partnership_type"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="sponsor">{isBn ? "স্পন্সর" : "Sponsor"}</option>
                <option value="media">{isBn ? "মিডিয়া" : "Media"}</option>
                <option value="equipment">{isBn ? "সরঞ্জাম" : "Equipment"}</option>
                <option value="other">{isBn ? "অন্যান্য" : "Other"}</option>
              </select>
              <input
                type="text"
                placeholder={isBn ? "মূল্য (যেমন $5000)" : "Value (e.g. $5000)"}
                value={formData.value}
                onChange={(e) => setFormData((prev) => ({ ...prev, value: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSavePartner}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <Save className="w-4 h-4" />
                {editingPartner ? (isBn ? "আপডেট করুন" : "Update") : (isBn ? "সংরক্ষণ করুন" : "Save")}
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

      {/* Partners Table */}
      <div className="rounded-xl border-2 border-secondary bg-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-secondary">
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "কোম্পানি" : "Company"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ধরন" : "Type"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "মূল্য" : "Value"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "অবস্থা" : "Status"}
              </th>
              <th className={`px-4 py-3 text-left text-xs uppercase tracking-wider font-semibold ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "কার্যক্রম" : "Actions"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPartners.map((partner) => (
              <tr key={partner.id} className="border-b border-secondary hover:bg-secondary/20 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {partner.logo_url && (
                      <img src={partner.logo_url} alt={partner.company_name} className="w-10 h-10 rounded object-cover" />
                    )}
                    <div>
                      <div className="text-sm font-medium text-foreground">{partner.company_name}</div>
                      <div className="text-xs text-foreground/60">{partner.email}</div>
                      {partner.website && (
                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                          <ExternalLink className="w-3 h-3" /> Website
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{typeBadge(partner.partnership_type)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">{partner.value || "-"}</td>
                <td className="px-4 py-3">{statusBadge(partner.status)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {partner.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(partner.id)}
                          className="p-2 rounded hover:bg-green-500/20 transition text-green-400"
                          title={isBn ? "অনুমোদন করুন" : "Approve"}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReject(partner.id)}
                          className="p-2 rounded hover:bg-red-500/20 transition text-red-400"
                          title={isBn ? "প্রত্যাখ্যান করুন" : "Reject"}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => handleEditPartner(partner)}
                      className="p-2 rounded hover:bg-primary/20 transition text-primary"
                      title={isBn ? "সম্পাদনা করুন" : "Edit"}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePartner(partner.id)}
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
        {filteredPartners.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
              {isBn ? "কোন অংশীদার পাওয়া যায়নি" : "No partners found"}
            </p>
            <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "নতুন অংশীদার যোগ করতে উপরের বোতাম ক্লিক করুন" : "Click the button above to add a new partner"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
