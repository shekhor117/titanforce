"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Save, Globe, Palette, Bell, Shield, Database, Image } from "lucide-react"

export default function AdminSettingsPage() {
  const { language } = useLanguage()
  const isBn = language === "bn"
  
  const [settings, setSettings] = useState({
    // Site Settings
    siteName: "Titan Force FC",
    siteNameBn: "টাইটান ফোর্স এফসি",
    siteDescription: "Mulikandi's Premier Football Club",
    siteDescriptionBn: "মুলিকান্দির প্রিমিয়ার ফুটবল ক্লাব",
    contactEmail: "info@titanforce.com",
    contactPhone: "+880 1234 567890",
    address: "Mulikandi, Bangladesh",
    
    // Social Media
    facebook: "https://facebook.com/titanforce",
    instagram: "https://instagram.com/titanforce",
    twitter: "https://twitter.com/titanforce",
    youtube: "https://youtube.com/titanforce",
    
    // Appearance
    primaryColor: "#D4AF37",
    darkMode: true,
    showAnimations: true,
    
    // Notifications
    emailNotifications: true,
    newFanAlerts: true,
    matchReminders: true,
    
    // Security
    requireEmailVerification: false,
    allowPublicRegistration: true,
    maintenanceMode: false,
  })

  const [hasChanges, setHasChanges] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  const handleChange = (key: string, value: string | boolean) => {
    setSettings({ ...settings, [key]: value })
    setHasChanges(true)
  }

  const handleSave = () => {
    localStorage.setItem("titanforce_settings", JSON.stringify(settings))
    setHasChanges(false)
    alert(isBn ? "সেটিংস সংরক্ষিত!" : "Settings saved!")
  }

  const tabs = [
    { key: "general", label: isBn ? "সাধারণ" : "General", icon: <Globe className="w-4 h-4" /> },
    { key: "appearance", label: isBn ? "চেহারা" : "Appearance", icon: <Palette className="w-4 h-4" /> },
    { key: "notifications", label: isBn ? "বিজ্ঞপ্তি" : "Notifications", icon: <Bell className="w-4 h-4" /> },
    { key: "security", label: isBn ? "নিরাপত্তা" : "Security", icon: <Shield className="w-4 h-4" /> },
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
                  {isBn ? "সাইটের নাম (ইংরেজি)" : "Site Name (English)"}
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium text-foreground/70 mb-2 font-[var(--font-bengali)]`}>
                  {isBn ? "সাইটের নাম (বাংলা)" : "Site Name (Bengali)"}
                </label>
                <input
                  type="text"
                  value={settings.siteNameBn}
                  onChange={(e) => handleChange("siteNameBn", e.target.value)}
                  className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none font-[var(--font-bengali)]"
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
                {isBn ? "ঠিকানা" : "Address"}
              </label>
              <textarea
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                rows={2}
                className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none resize-none"
              />
            </div>

            <h3 className={`text-lg font-bold text-foreground pt-4 border-t border-secondary ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "সামাজিক মিডিয়া" : "Social Media"}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {["facebook", "instagram", "twitter", "youtube"].map((social) => (
                <div key={social}>
                  <label className="block text-sm font-medium text-foreground/70 mb-2 capitalize">
                    {social}
                  </label>
                  <input
                    type="url"
                    value={settings[social as keyof typeof settings] as string}
                    onChange={(e) => handleChange(social, e.target.value)}
                    className="w-full px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "appearance" && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "চেহারা সেটিংস" : "Appearance Settings"}
            </h2>
            
            <div>
              <label className={`block text-sm font-medium text-foreground/70 mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "প্রাথমিক রঙ" : "Primary Color"}
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="w-16 h-10 rounded border-2 border-secondary cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleChange("primaryColor", e.target.value)}
                  className="px-4 py-2 rounded border-2 border-secondary bg-background text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleChange("darkMode", e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-secondary accent-primary"
                />
                <span className={`text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "ডার্ক মোড ডিফল্ট" : "Dark Mode Default"}
                </span>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showAnimations}
                  onChange={(e) => handleChange("showAnimations", e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-secondary accent-primary"
                />
                <span className={`text-foreground ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                  {isBn ? "অ্যানিমেশন দেখান" : "Show Animations"}
                </span>
              </label>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "বিজ্ঞপ্তি সেটিংস" : "Notification Settings"}
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-secondary accent-primary"
                />
                <div>
                  <span className={`text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইমেইল বিজ্ঞপ্তি" : "Email Notifications"}
                  </span>
                  <span className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "গুরুত্বপূর্ণ আপডেটের জন্য ইমেইল পান" : "Receive emails for important updates"}
                  </span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.newFanAlerts}
                  onChange={(e) => handleChange("newFanAlerts", e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-secondary accent-primary"
                />
                <div>
                  <span className={`text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "নতুন ভক্ত অ্যালার্ট" : "New Fan Alerts"}
                  </span>
                  <span className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "নতুন ভক্ত নিবন্ধনের বিজ্ঞপ্তি" : "Get notified when new fans register"}
                  </span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.matchReminders}
                  onChange={(e) => handleChange("matchReminders", e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-secondary accent-primary"
                />
                <div>
                  <span className={`text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ম্যাচ রিমাইন্ডার" : "Match Reminders"}
                  </span>
                  <span className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "আসন্ন ম্যাচের জন্য রিমাইন্ডার" : "Reminders for upcoming matches"}
                  </span>
                </div>
              </label>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <h2 className={`text-xl font-bold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {isBn ? "নিরাপত্তা সেটিংস" : "Security Settings"}
            </h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleChange("requireEmailVerification", e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-secondary accent-primary"
                />
                <div>
                  <span className={`text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "ইমেইল যাচাইকরণ প্রয়োজন" : "Require Email Verification"}
                  </span>
                  <span className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "নতুন ব্যবহারকারীদের ইমেইল যাচাই করতে হবে" : "New users must verify their email"}
                  </span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowPublicRegistration}
                  onChange={(e) => handleChange("allowPublicRegistration", e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-secondary accent-primary"
                />
                <div>
                  <span className={`text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "পাবলিক রেজিস্ট্রেশন অনুমতি" : "Allow Public Registration"}
                  </span>
                  <span className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "যে কেউ অ্যাকাউন্ট তৈরি করতে পারবে" : "Anyone can create an account"}
                  </span>
                </div>
              </label>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-secondary accent-primary"
                />
                <div>
                  <span className={`text-foreground block ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "মেইনটেনেন্স মোড" : "Maintenance Mode"}
                  </span>
                  <span className={`text-sm text-foreground/60 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                    {isBn ? "সাইট অস্থায়ীভাবে বন্ধ রাখুন" : "Temporarily disable the site"}
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-4 border-t border-secondary">
              <h3 className={`text-lg font-bold text-red-400 mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "বিপজ্জনক জোন" : "Danger Zone"}
              </h3>
              <button className={`px-4 py-2 border-2 border-red-500 text-red-400 rounded hover:bg-red-500/20 transition ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
                {isBn ? "সমস্ত ডেটা রিসেট করুন" : "Reset All Data"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
