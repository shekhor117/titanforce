"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { FeatureProtectedRoute } from "@/components/feature-protected-route"
import { getDataService } from "@/lib/data-service"
import { Search, Mail, MailOpen, Trash2, Reply, Eye, Phone, Plus, X, Save, CheckCircle } from "lucide-react"

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "unread" | "read" | "replied"
  created_at: string
}

export default function AdminContactsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [contacts, setContacts] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    loadContacts()
    
    // Set up auto-refresh every 5 seconds to catch new messages
    const interval = setInterval(() => {
      loadContacts()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadContacts = async () => {
    try {
      setError(null)
      const service = getDataService()
      const contactsData = await service.getContactMessages()
      console.log('[v0] Loaded contacts:', contactsData)
      setContacts(contactsData)
      setLoading(false)
    } catch (err) {
      console.error('[v0] Error loading contacts:', err)
      setError(err instanceof Error ? err.message : "Failed to load messages")
      setLoading(false)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (confirm(isBn ? "আপনি কি নিশ্চিত?" : "Are you sure?")) {
      try {
        setError(null)
        const service = getDataService()
        await service.deleteContactMessage(id)
        setSuccessMessage(isBn ? "বার্তা মুছে ফেলা হয়েছে" : "Message deleted successfully")
        if (selectedMessage?.id === id) setSelectedMessage(null)
        await loadContacts()
        setTimeout(() => setSuccessMessage(null), 3000)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete message")
      }
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      setError(null)
      const service = getDataService()
      await service.updateContactMessage(id, { status: "read" })
      await loadContacts()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update message")
    }
  }

  const handleMarkAsReplied = async (id: string) => {
    try {
      setError(null)
      const service = getDataService()
      await service.updateContactMessage(id, { status: "replied" })
      setSuccessMessage(isBn ? "বার্তা উত্তর দেওয়া হিসেবে চিহ্নিত করা হয়েছে" : "Message marked as replied")
      await loadContacts()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update message")
    }
  }

  const handleSelectMessage = async (contact: ContactMessage) => {
    setSelectedMessage(contact)
    if (contact.status === "unread") {
      await handleMarkAsRead(contact.id)
    }
  }

  const handleAddContact = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      setError(isBn ? "নাম, ইমেইল এবং বার্তা প্রয়োজন" : "Name, email and message are required")
      return
    }

    try {
      setError(null)
      const service = getDataService()
      await service.createContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject || "General Inquiry",
        message: formData.message,
        status: "unread",
      })

      setSuccessMessage(isBn ? "বার্তা যোগ করা হয়েছে" : "Message added successfully")
      await loadContacts()
      resetForm()
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add message")
    }
  }

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <FeatureProtectedRoute featureName="Contacts Management" category="team">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground/60">{isBn ? "বার্তা লোড হচ্ছে..." : "Loading messages..."}</p>
          </div>
        </div>
      </FeatureProtectedRoute>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "bg-red-500/20 text-red-400"
      case "read": return "bg-yellow-500/20 text-yellow-400"
      case "replied": return "bg-green-500/20 text-green-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { en: string; bn: string }> = {
      unread: { en: "Unread", bn: "অপঠিত" },
      read: { en: "Read", bn: "পঠিত" },
      replied: { en: "Replied", bn: "উত্তর দেওয়া" },
    }
    return labels[status]?.[isBn ? "bn" : "en"] || status
  }

  const unreadCount = contacts.filter(c => c.status === "unread").length

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(isBn ? "bn-BD" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <FeatureProtectedRoute featureName="Contacts Management" category="team">
      <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-950 border border-red-900 text-red-200 px-4 py-3 rounded-lg flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold">{isBn ? "ত্রুটি" : "Error"}</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-green-950 border border-green-900 text-green-200 px-4 py-3 rounded-lg flex items-start gap-3">
          <span className="text-xl">✓</span>
          <p className="font-semibold">{successMessage}</p>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "যোগাযোগ বার্তা" : "Contact Messages"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {unreadCount > 0 
              ? `${unreadCount} ${isBn ? "টি অপঠিত বার্তা" : "unread messages"}`
              : (isBn ? "সব বার্তা পঠিত" : "All messages read")
            }
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowAddForm(true) }}
          className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {isBn ? "বার্তা যোগ করুন" : "Add Message"}
        </button>
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border-2 border-primary p-6 max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-[var(--font-display)] text-xl tracking-wider ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "নতুন বার্তা" : "New Message"}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-secondary/20 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder={isBn ? "নাম" : "Name"}
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                />
                <input
                  type="email"
                  placeholder={isBn ? "ইমেইল" : "Email"}
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder={isBn ? "ফোন (ঐচ্ছিক)" : "Phone (optional)"}
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                />
                <input
                  type="text"
                  placeholder={isBn ? "বিষয়" : "Subject"}
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none"
                />
              </div>
              <textarea
                placeholder={isBn ? "বার্তা" : "Message"}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 rounded border-2 border-secondary bg-transparent focus:border-primary outline-none resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddContact}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  <Save className="w-4 h-4" />
                  {isBn ? "সংরক্ষণ করুন" : "Save"}
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
          <input
            type="text"
            placeholder={isBn ? "বার্তা খুঁজুন..." : "Search messages..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:border-primary outline-none ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "unread", "read", "replied"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                filterStatus === status
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/30 text-foreground/60 hover:bg-secondary/50"
              } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {status === "all" ? (isBn ? "সব" : "All") : getStatusLabel(status)}
              {status === "unread" && unreadCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="rounded-xl border-2 border-secondary bg-card overflow-hidden">
          <div className="divide-y divide-secondary max-h-[600px] overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleSelectMessage(contact)}
                className={`p-4 cursor-pointer hover:bg-secondary/30 transition ${selectedMessage?.id === contact.id ? "bg-secondary/50" : ""} ${contact.status === "unread" ? "border-l-4 border-l-primary" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {contact.status === "unread" ? (
                      <Mail className="w-4 h-4 text-primary" />
                    ) : contact.status === "replied" ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-foreground/50" />
                    )}
                    <span className="font-medium text-foreground">{contact.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs uppercase ${getStatusColor(contact.status)}`}>
                    {getStatusLabel(contact.status)}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground/80 mb-1">{contact.subject}</p>
                <p className="text-xs text-foreground/50 line-clamp-1">{contact.message}</p>
                <p className="text-xs text-foreground/40 mt-2">{formatDate(contact.created_at)}</p>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className={`p-8 text-center text-foreground/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                {isBn ? "কোনো বার্তা নেই" : "No messages found"}
              </div>
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="rounded-xl border-2 border-secondary bg-card p-6">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground">{selectedMessage.subject}</h2>
                  <p className="text-sm text-foreground/60">{selectedMessage.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail className="w-3 h-3 text-foreground/50" />
                    <span className="text-sm text-foreground/60">{selectedMessage.email}</span>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3 text-foreground/50" />
                      <span className="text-sm text-foreground/60">{selectedMessage.phone}</span>
                    </div>
                  )}
                  <p className="text-xs text-foreground/40 mt-2">{formatDate(selectedMessage.created_at)}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs uppercase ${getStatusColor(selectedMessage.status)}`}>
                  {getStatusLabel(selectedMessage.status)}
                </span>
              </div>

              <div className="border-t border-secondary pt-4">
                <p className="text-foreground/80 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-secondary">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  onClick={() => handleMarkAsReplied(selectedMessage.id)}
                  className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  <Reply className="w-4 h-4" />
                  {isBn ? "উত��তর দিন" : "Reply"}
                </a>
                {selectedMessage.status !== "replied" && (
                  <button
                    onClick={() => handleMarkAsReplied(selectedMessage.id)}
                    className={`flex items-center gap-2 px-4 py-2 border-2 border-green-500 text-green-400 rounded hover:bg-green-500/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    {isBn ? "উত্তর দেওয়া হয়েছে" : "Mark as Replied"}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className={`flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-400 rounded hover:bg-red-500/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
                >
                  <Trash2 className="w-4 h-4" />
                  {isBn ? "মুছুন" : "Delete"}
                </button>
              </div>
            </div>
          ) : (
            <div className={`h-full flex items-center justify-center text-foreground/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              <div className="text-center">
                <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>{isBn ? "একটি বার্তা নির্বাচন করুন" : "Select a message to view"}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: isBn ? "মোট বার্তা" : "Total", value: contacts.length, color: "text-primary" },
          { label: isBn ? "অপঠিত" : "Unread", value: contacts.filter(c => c.status === "unread").length, color: "text-red-400" },
          { label: isBn ? "উত্তর দেওয়া" : "Replied", value: contacts.filter(c => c.status === "replied").length, color: "text-green-400" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border-2 border-secondary bg-card p-4 text-center">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className={`text-xs text-foreground/60 uppercase ${isBn ? "font-[var(--font-bengali)]" : ""}`}>{stat.label}</div>
          </div>
        ))}
      </div>
      </div>
    </FeatureProtectedRoute>
  )
}
