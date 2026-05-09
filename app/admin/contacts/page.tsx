"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Search, Mail, MailOpen, Trash2, Reply, Eye } from "lucide-react"

interface ContactMessage {
  id: string
  userId?: string
  name: string
  email: string
  subject?: string
  message: string
  status: "unread" | "read" | "replied"
  timestamp?: string
  createdAt?: string
}

const mockContacts: ContactMessage[] = [
  { id: "1", name: "John Doe", email: "john@example.com", subject: "Sponsorship Inquiry", message: "We are interested in sponsoring your team for the upcoming season. Please contact us to discuss partnership opportunities.", status: "unread", createdAt: "2024-03-20" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", subject: "Fan Membership", message: "How can I become an official fan member? What are the benefits?", status: "read", createdAt: "2024-03-18" },
  { id: "3", name: "Mike Wilson", email: "mike@example.com", subject: "Player Inquiry", message: "I am a scout looking for talented players. Can we arrange a meeting?", status: "replied", createdAt: "2024-03-15" },
  { id: "4", name: "Sarah Johnson", email: "sarah@example.com", subject: "Media Request", message: "I am a journalist and would like to interview the team captain.", status: "unread", createdAt: "2024-03-19" },
]

export default function AdminContactsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [contacts, setContacts] = useState<ContactMessage[]>(mockContacts)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("titanforce_messages")
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages)
        // Format loaded messages to match the interface
        const formatted = parsed.map((msg: any) => ({
          id: msg.id,
          userId: msg.userId,
          name: msg.name,
          email: msg.email,
          subject: msg.subject || "Message",
          message: msg.message,
          status: msg.status || "unread",
          createdAt: new Date(msg.timestamp || new Date()).toLocaleDateString(),
        }))
        // Combine with mock data, prioritizing user-submitted messages
        setContacts([...formatted, ...mockContacts])
      } catch (error) {
        console.error("[v0] Error loading messages:", error)
      }
    }
  }, [])

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const handleDelete = (id: string) => {
    if (confirm(isBn ? "আপনি কি নিশ্চিত?" : "Are you sure?")) {
      setContacts(contacts.filter(c => c.id !== id))
      if (selectedMessage?.id === id) setSelectedMessage(null)
    }
  }

  const handleMarkAsRead = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, status: "read" } : c))
  }

  const handleMarkAsReplied = (id: string) => {
    setContacts(contacts.map(c => c.id === id ? { ...c, status: "replied" } : c))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unread": return "bg-red-500/20 text-red-400"
      case "read": return "bg-yellow-500/20 text-yellow-400"
      case "replied": return "bg-green-500/20 text-green-400"
      default: return "bg-gray-500/20 text-gray-400"
    }
  }

  const unreadCount = contacts.filter(c => c.status === "unread").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? "যোগাযোগ বার্তা" : "Contact Messages"}
        </h1>
        <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
          {isBn ? `${unreadCount} টি অপঠিত বার্তা` : `${unreadCount} unread messages`}
        </p>
      </div>

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
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-4 py-2 rounded border-2 border-secondary bg-card text-foreground focus:border-primary outline-none ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <option value="all">{isBn ? "সব অবস্থা" : "All Status"}</option>
          <option value="unread">{isBn ? "অপঠিত" : "Unread"}</option>
          <option value="read">{isBn ? "পঠিত" : "Read"}</option>
          <option value="replied">{isBn ? "উত্তর দেওয়া" : "Replied"}</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="rounded-xl border-2 border-secondary bg-card overflow-hidden">
          <div className="divide-y divide-secondary max-h-[600px] overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => { setSelectedMessage(contact); handleMarkAsRead(contact.id) }}
                className={`p-4 cursor-pointer hover:bg-secondary/30 transition ${selectedMessage?.id === contact.id ? "bg-secondary/50" : ""} ${contact.status === "unread" ? "border-l-4 border-l-primary" : ""}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {contact.status === "unread" ? (
                      <Mail className="w-4 h-4 text-primary" />
                    ) : (
                      <MailOpen className="w-4 h-4 text-foreground/50" />
                    )}
                    <span className="font-medium text-foreground">{contact.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs uppercase ${getStatusColor(contact.status)}`}>
                    {contact.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground/80 mb-1">{contact.subject}</p>
                <p className="text-xs text-foreground/50 line-clamp-1">{contact.message}</p>
                <p className="text-xs text-foreground/40 mt-2">{contact.createdAt}</p>
              </div>
            ))}
            {filteredContacts.length === 0 && (
              <div className={`p-8 text-center text-foreground/50 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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
                  <p className="text-sm text-foreground/60">{selectedMessage.name} &lt;{selectedMessage.email}&gt;</p>
                  <p className="text-xs text-foreground/40 mt-1">{selectedMessage.createdAt}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs uppercase ${getStatusColor(selectedMessage.status)}`}>
                  {selectedMessage.status}
                </span>
              </div>

              <div className="border-t border-secondary pt-4">
                <p className="text-foreground/80 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              <div className="flex gap-2 pt-4 border-t border-secondary">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  onClick={() => handleMarkAsReplied(selectedMessage.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition"
                >
                  <Reply className="w-4 h-4" />
                  <span className={isBn ? "font-[var(--font-bengali)]" : ""}>{isBn ? "উত্তর দিন" : "Reply"}</span>
                </a>
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-400 rounded hover:bg-red-500/20 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className={isBn ? "font-[var(--font-bengali)]" : ""}>{isBn ? "মুছুন" : "Delete"}</span>
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
  )
}
