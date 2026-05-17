"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Save, Globe, Palette, Bell, Shield, RefreshCw } from "lucide-react"
import { dataStore, SiteSettings } from "@/lib/data-store"

export default function AdminSettingsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("general")
  const [isClient, setIsClient] = useState(false)

  // Initialize settings from localStorage on client side only
  useEffect(() => {
    setIsClient(true)
    const storedSettings = dataStore.getSettings()
    setSettings(storedSettings)
  }, [])

  const handleChange = (key: keyof SiteSettings, value: string) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
    setHasChanges(true)
  }

  const handleSocialChange = (key: keyof SiteSettings["socialLinks"], value: string) => {
    if (!settings) return
    setSettings({ 
      ...settings, 
      socialLinks: { ...settings.socialLinks, [key]: value } 
    })
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!settings) return
    dataStore.setSettings(settings)
    setHasChanges(false)
    alert(isBn ? "সেটিংস সংরক্ষিত!" : "Settings saved!")
  }

  const handleResetToDefaults = () => {
    if (!confirm(isBn ? "সমস্ত ডেটা রিসেট করতে চান? এটি পূর্বাবস্থায় ফেরানো যাবে না।" : "Reset all data? This cannot be undone.")) return
    dataStore.resetToDefaults()
    const defaultSettings = dataStore.getSettings()
    setSettings(defaultSettings)
    setHasChanges(false)
    alert(isBn ? "সমস্ত ডেটা রিসেট হয়েছে!" : "All data has been reset!")
  }

  // Show loading state while client is not ready
  if (!isClient || !settings) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-foreground/60">Loading settings...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: "general", label: isBn ? "সাধারণ" : "General", icon: <Globe className="w-4 h-4" /> },
    { key: "hero", label: isBn ? "হিরো" : "Hero Section", icon: <Palette className="w-4 h-4" /> },
    { key: "about", label: isBn ? "সম্পর্কে" : "About Section", icon: <Bell className="w-4 h-4" /> },
    { key: "advanced", label: isBn ? "উন্নত" : "Advanced", icon: <Shield className="w-4 h-4" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`font-[var(--font-display)] text-4xl tracking-wider text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "সাইট সেটিংস" : "Site Settings"}
          </h1>
          <p className={`text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "ওয়েবসাইট কনফিগারেশন পরিচালনা করুন" : "Manage website configuration"}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed ${isBn ? "font-[var(--font-bengali)]" : ""}`}
        >
          <Save className="w-4 h-4" />
          {isBn ? "সংরক্ষণ করুন" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded whitespace-nowrap transition ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border-2 border-secondary text-foreground/70 hover:border-primary hover:text-primary"
            } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="rounded-xl border-2 border-secondary bg-card p-6">
        {activeTab === "general" && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সাধারণ সেটিংস" : "General Settings"}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "সাইটের নাম" : "Site Name"}
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ট্যাগলাইন" : "Tagline"}
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleChange("tagline", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "যোগাযোগ ইমেইল" : "Contact Email"}
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange("contactEmail", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "যোগাযোগ ফোন" : "Contact Phone"}
                </label>
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => handleChange("contactPhone", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "বিবরণ" : "Description"}
              </label>
              <textarea
                value={settings.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none resize-none"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "ঠিকানা" : "Address"}
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
              />
            </div>

            <h3 className={`text-lg font-bold text-foreground pt-4 border-t border-secondary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সামাজিক মিডিয়া" : "Social Media"}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Facebook</label>
                <input
                  type="url"
                  value={settings.socialLinks.facebook || ""}
                  onChange={(e) => handleSocialChange("facebook", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Instagram</label>
                <input
                  type="url"
                  value={settings.socialLinks.instagram || ""}
                  onChange={(e) => handleSocialChange("instagram", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Twitter</label>
                <input
                  type="url"
                  value={settings.socialLinks.twitter || ""}
                  onChange={(e) => handleSocialChange("twitter", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">YouTube</label>
                <input
                  type="url"
                  value={settings.socialLinks.youtube || ""}
                  onChange={(e) => handleSocialChange("youtube", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "hero" && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "হিরো সেকশন সেটিংস" : "Hero Section Settings"}
            </h2>
            
            <div>
              <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "হিরো শিরোনাম" : "Hero Title"}
              </label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => handleChange("heroTitle", e.target.value)}
                className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "হিরো সাবটাইটেল" : "Hero Subtitle"}
              </label>
              <input
                type="text"
                value={settings.heroSubtitle}
                onChange={(e) => handleChange("heroSubtitle", e.target.value)}
                className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
              />
            </div>

            <div className="p-4 bg-secondary/20 rounded-lg">
              <p className={`text-sm text-foreground/70 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn 
                  ? "প্রিভিউ: হিরো সেকশনে এই টেক্সট দেখানো হবে।" 
                  : "Preview: This text will be displayed in the hero section."}
              </p>
              <div className="mt-4 text-center">
                <h3 className="font-[var(--font-display)] text-3xl text-primary">{settings.heroTitle}</h3>
                <p className="text-foreground/70">{settings.heroSubtitle}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সম্পর্কে সেকশন সেটিংস" : "About Section Settings"}
            </h2>
            
            <div>
              <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সম্পর্কে শিরোনাম" : "About Title"}
              </label>
              <input
                type="text"
                value={settings.aboutTitle}
                onChange={(e) => handleChange("aboutTitle", e.target.value)}
                className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সম্পর্কে বিবরণ" : "About Description"}
              </label>
              <textarea
                value={settings.aboutDescription}
                onChange={(e) => handleChange("aboutDescription", e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "উন্নত সেটিংস" : "Advanced Settings"}
            </h2>

            <div className="p-4 border-2 border-red-500/30 rounded-lg bg-red-500/5">
              <h3 className={`text-lg font-bold text-red-400 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "বিপজ্জনক জোন" : "Danger Zone"}
              </h3>
              <p className={`text-sm text-foreground/70 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn 
                  ? "এই অ্যাকশনগুলি পূর্বাবস্থায় ফেরানো যাবে না। সাবধানে ব্যবহার করুন।" 
                  : "These actions cannot be undone. Use with caution."}
              </p>
              <button 
                onClick={handleResetToDefaults}
                className={`flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-400 rounded hover:bg-red-500/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}
              >
                <RefreshCw className="w-4 h-4" />
                {isBn ? "সমস্ত ডেটা রিসেট করুন" : "Reset All Data"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
