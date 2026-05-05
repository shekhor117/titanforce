"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, CheckCircle, XCircle, Clock, ExternalLink } from "lucide-react"

interface Partner {
  id: string
  name: string
  email: string
  company_name: string
  partnership_type: "sponsor" | "media" | "equipment" | "other"
  website: string | null
  value: string
  status: "pending" | "approved" | "rejected"
}

export default function AdminPartners() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [partners, setPartners] = useState<Partner[]>([
    { id: "1", name: "Tech Solutions", email: "contact@techsolutions.com", company_name: "Tech Solutions Ltd", partnership_type: "sponsor", website: "https://techsolutions.com", value: "$5000", status: "approved" },
    { id: "2", name: "Sports Gear", email: "info@sportsgear.com", company_name: "Sports Gear Co", partnership_type: "equipment", website: "https://sportsgear.com", value: "$3000", status: "approved" },
    { id: "3", name: "New Partner", email: "new@partner.com", company_name: "New Partner LLC", partnership_type: "sponsor", website: null, value: "$2000", status: "pending" },
  ])

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
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}>
        {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
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
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    )
  }

  return (
    <div className="space-y-6">
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
        <button className={`flex items-center gap-2 px-4 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
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
                  <div>
                    <div className="text-sm font-medium text-foreground">{partner.company_name}</div>
                    <div className="text-xs text-foreground/60">{partner.email}</div>
                    {partner.website && (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" /> Website
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{typeBadge(partner.partnership_type)}</td>
                <td className="px-4 py-3 text-sm font-semibold text-primary">{partner.value}</td>
                <td className="px-4 py-3">{statusBadge(partner.status)}</td>
                <td className="px-4 py-3">
                  {partner.status === "pending" && (
                    <div className="flex items-center gap-2">
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
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPartners.length === 0 && (
          <div className="text-center py-12 text-foreground/60">
            {isBn ? "কোন অংশীদার পাওয়া যায়নি" : "No partners found"}
          </div>
        )}
      </div>
    </div>
  )
}
