"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { dataStore, Partner, useDataStore } from "@/lib/data-store"
import { Plus, Edit, Trash2, ExternalLink, X, Save, Search } from "lucide-react"
import { PhotoUpload } from "@/components/photo-upload"

export default function AdminPartners() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [filter, setFilter] = useState<"all" | "title" | "main" | "official" | "media">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    type: "official" as Partner["type"],
    website: "",
    description: "",
    logo: { signedUrl: "", filePath: "" },
    status: "active" as Partner["status"],
  })
  
  const partners = useDataStore(dataStore.getPartners, "partners")

  const handleLogoUpload = (data: { signedUrl: string; filePath: string }) => {
    setFormData((prev) => ({ ...prev, logo: data }))
  }

  const handleLogoDelete = () => {
    setFormData((prev) => ({ ...prev, logo: { signedUrl: "", filePath: "" } }))
  }

  const handleSavePartner = () => {
    if (!formData.name) {
      alert(isBn ? "নাম প্রয়োজন" : "Name is required")
      return
    }

    const partnerData: Omit<Partner, "id"> = {
      name: formData.name,
      type: formData.type,
      website: formData.website || undefined,
      description: formData.description || undefined,
      logo: formData.logo.signedUrl || undefined,
      status: formData.status,
    }

    if (editingPartner) {
      dataStore.updatePartner(editingPartner.id, partnerData)
    } else {
      dataStore.addPartner(partnerData)
    }
    
    resetForm()
  }

  const handleEditPartner = (partner: Partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      type: partner.type,
      website: partner.website || "",
      description: partner.description || "",
      logo: { signedUrl: partner.logo || "", filePath: "" },
      status: partner.status,
    })
    setShowForm(true)
  }

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm(isBn ? "এই অংশীদার মুছতে চান?" : "Delete this partner?")) return
    dataStore.deletePartner(partnerId)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "official",
      website: "",
      description: "",
      logo: { signedUrl: "", filePath: "" },
      status: "active",
    })
    setShowForm(false)
    setEditingPartner(null)
  }

  const filteredPartners = partners
    .filter(p => filter === "all" || p.type === filter)
    .filter(p => 
      searchTerm === "" || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const typeBadge = (type: Partner["type"]) => {
    const styles = {
      title: "bg-yellow-500/20 text-yellow-400",
      main: "bg-blue-500/20 text-blue-400",
      official: "bg-green-500/20 text-green-400",
      media: "bg-purple-500/20 text-purple-400",
    }
    const labels = {
      title: isBn ? "টাইটেল স্পন্সর" : "Title Sponsor",
      main: isBn ? "মেইন স্পন্সর" : "Main Sponsor",
      official: isBn ? "অফিশিয়াল পার্টনার" : "Official Partner",
      media: isBn ? "মিডিয়া পার্টনার" : "Media Partner",
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
          <p className="text-foreground/60 text-sm mt-1">
            {partners.length} {isBn ? "জন অংশীদার" : "partners"}
          </p>
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

      {/* Search & Filter */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
          <input
            type="text"
            placeholder={isBn ? "খোঁজ করুন..." : "Search partners..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "title", "main", "official", "media"] as const).map((tab) => (
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
              {tab === "title" && (isBn ? "টাইটেল" : "Title")}
              {tab === "main" && (isBn ? "মেইন" : "Main")}
              {tab === "official" && (isBn ? "অফিশিয়াল" : "Official")}
              {tab === "media" && (isBn ? "মিডিয়া" : "Media")}
            </button>
          ))}
        </div>
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
                placeholder={isBn ? "নাম" : "Name"}
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value as Partner["type"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="title">{isBn ? "টাইটেল স্পন্সর" : "Title Sponsor"}</option>
                <option value="main">{isBn ? "মেইন স্পন্সর" : "Main Sponsor"}</option>
                <option value="official">{isBn ? "অফিশিয়াল পার্টনার" : "Official Partner"}</option>
                <option value="media">{isBn ? "মিডিয়া পার্টনার" : "Media Partner"}</option>
              </select>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="url"
                placeholder={isBn ? "ওয়েবসাইট" : "Website URL"}
                value={formData.website}
                onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as Partner["status"] }))}
                className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
              >
                <option value="active">{isBn ? "সক্রিয়" : "Active"}</option>
                <option value="pending">{isBn ? "অপেক্ষমান" : "Pending"}</option>
              </select>
            </div>
            <textarea
              placeholder={isBn ? "বিবরণ" : "Description"}
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none resize-none"
            />
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

      {/* Partners Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPartners.map((partner) => (
          <div key={partner.id} className="rounded-xl border-2 border-secondary bg-card p-4 hover:border-primary/50 transition">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="font-[var(--font-display)] text-xl text-primary">{partner.name[0]}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {typeBadge(partner.type)}
                </div>
                <h3 className="font-semibold truncate">{partner.name}</h3>
                {partner.description && (
                  <p className="text-sm text-foreground/60 line-clamp-2 mt-1">{partner.description}</p>
                )}
                {partner.website && (
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {isBn ? "ওয়েবসাইট" : "Website"}
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-secondary">
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                partner.status === "active" 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-yellow-500/20 text-yellow-400"
              }`}>
                {partner.status === "active" ? (isBn ? "সক্রিয়" : "Active") : (isBn ? "অপেক্ষমান" : "Pending")}
              </span>
              <div className="flex items-center gap-1">
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
            </div>
          </div>
        ))}
      </div>

      {filteredPartners.length === 0 && (
        <div className="text-center py-12 text-foreground/60 rounded-xl border-2 border-secondary bg-card">
          <p className={isBn ? "font-[var(--font-bengali)]" : ""}>
            {isBn ? "কোন অংশীদার পাওয়া যায়নি" : "No partners found"}
          </p>
          <p className={`text-sm mt-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "নতুন অংশীদার যোগ করতে উপরের বোতাম ক্লিক করুন" : "Click the button above to add a new partner"}
          </p>
        </div>
      )}
    </div>
  )
}
