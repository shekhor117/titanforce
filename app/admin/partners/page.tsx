"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Plus, Edit, Trash2, X, Save } from "lucide-react"
import { getDataService } from "@/lib/data-service"
import type { Partner } from "@/lib/data-service"

export default function AdminPartners() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    logo_url: "",
    status: "active" as "active" | "inactive",
  })

  useEffect(() => {
    loadPartners()
  }, [])

  const loadPartners = async () => {
    try {
      setIsLoading(true)
      const dataService = getDataService()
      const data = await dataService.getPartners()
      setPartners(Array.isArray(data) ? data : [])
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const handleSavePartner = async () => {
    if (!formData.name) {
      alert(isBn ? "নাম প্রয়োজন" : "Name required")
      return
    }

    try {
      const dataService = getDataService()
      const partnerData = {
        name: formData.name,
        website: formData.website,
        description: formData.description,
        logo_url: formData.logo_url,
        status: formData.status,
      }

      if (editingPartner) {
        await dataService.updatePartner(editingPartner.id, partnerData)
      } else {
        await dataService.createPartner(partnerData)
      }

      await loadPartners()
      resetForm()
    } catch (error) {
    }
  }

  const handleDeletePartner = async (id: string) => {
    if (!confirm(isBn ? "নিশ্চিত?" : "Sure?")) return

    try {
      const dataService = getDataService()
      await dataService.deletePartner(id)
      await loadPartners()
    } catch (error) {
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      website: "",
      description: "",
      logo_url: "",
      status: "active",
    })
    setEditingPartner(null)
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{isBn ? "অংশীদার পরিচালনা" : "Partners"}</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded"
          >
            <Plus className="w-4 h-4" /> {isBn ? "নতুন" : "Add"}
          </button>
        </div>

        {showForm && (
          <div className="bg-muted p-4 rounded-lg mb-6 space-y-3">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-border rounded" />
            <input type="url" placeholder="Website" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} className="w-full px-3 py-2 border border-border rounded" />
            <input type="url" placeholder="Logo URL" value={formData.logo_url} onChange={(e) => setFormData({...formData, logo_url: e.target.value})} className="w-full px-3 py-2 border border-border rounded" />
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-border rounded" />
            <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-border rounded">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleSavePartner} className="flex-1 bg-green-600 text-white py-2 rounded">Save</button>
              <button onClick={resetForm} className="flex-1 bg-gray-600 text-white py-2 rounded">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {partners.map(partner => (
            <div key={partner.id} className="border border-border rounded-lg p-4">
              <h3 className="font-bold">{partner.name}</h3>
              <p className="text-sm text-muted-foreground">{partner.status}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => { setEditingPartner(partner); setFormData({...formData, name: partner.name}); setShowForm(true); }} className="flex-1 bg-blue-600 text-white py-1 rounded text-sm">Edit</button>
                <button onClick={() => handleDeletePartner(partner.id)} className="flex-1 bg-red-600 text-white py-1 rounded text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
