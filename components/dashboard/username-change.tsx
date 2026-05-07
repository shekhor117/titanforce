"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { createClient } from "@/lib/supabase/client"
import { AlertCircle, Check, X } from "lucide-react"

interface UsernameChangeProps {
  language: string
}

export function UsernameChangeComponent({ language }: UsernameChangeProps) {
  const { user, profile, refreshProfile } = useAuth()
  const { language: lang } = useLanguage()
  const isBn = lang === "bn"
  
  const [newUsername, setNewUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [remainingChanges, setRemainingChanges] = useState(3)
  const [usernameTaken, setUsernameTaken] = useState(false)

  useEffect(() => {
    const fetchRemainingChanges = async () => {
      if (!user?.id) return

      const supabase = createClient()
      if (!supabase) {
        // Demo mode
        setRemainingChanges(3)
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("username_changes")
        .eq("id", user.id)
        .single()

      if (data) {
        setRemainingChanges(Math.max(0, 3 - (data.username_changes || 0)))
      }
    }

    fetchRemainingChanges()
  }, [user?.id, profile])

  const checkUsernameAvailability = async (username: string) => {
    if (!username) {
      setUsernameTaken(false)
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setUsernameTaken(false)
      return
    }

    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", user?.id || "")

    setUsernameTaken(data && data.length > 0)
  }

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUsername.trim()) {
      setMessage({ type: "error", text: isBn ? "ব্যবহারকারী নাম প্রবেশ করুন" : "Please enter a username" })
      return
    }

    if (remainingChanges <= 0) {
      setMessage({ type: "error", text: isBn ? "আপনি আর ব্যবহারকারী নাম পরিবর্তন করতে পারবেন না" : "You have no more username changes available" })
      return
    }

    if (usernameTaken) {
      setMessage({ type: "error", text: isBn ? "এই ব্যবহারকারী নাম ইতিমধ্যে নেওয়া হয়েছে" : "This username is already taken" })
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      if (!supabase) {
        // Demo mode
        setMessage({ type: "success", text: isBn ? "ব্যবহারকারী নাম সফলভাবে পরিবর্তন করা হয়েছে" : "Username changed successfully" })
        setNewUsername("")
        setRemainingChanges(Math.max(0, remainingChanges - 1))
        await refreshProfile()
        return
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          username: newUsername,
          username_changes: (remainingChanges - 1),
          last_username_change_at: new Date().toISOString(),
        })
        .eq("id", user?.id)

      if (error) {
        setMessage({ type: "error", text: error.message })
      } else {
        setMessage({ type: "success", text: isBn ? "ব্যবহারকারী নাম সফলভাবে পরিবর্তন করা হয়েছে" : "Username changed successfully" })
        setNewUsername("")
        setRemainingChanges(Math.max(0, remainingChanges - 1))
        await refreshProfile()
      }
    } catch (error) {
      setMessage({ type: "error", text: isBn ? "একটি ত্রুটি ঘটেছে" : "An error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-card rounded-lg border-2 border-secondary">
      <h3 className={`text-lg font-semibold text-foreground mb-4 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
        {isBn ? "ব্যবহারকারী নাম পরিবর্তন করুন" : "Change Username"}
      </h3>

      {/* Remaining Changes Info */}
      <div className={`mb-4 p-3 rounded-lg ${remainingChanges > 0 ? "bg-primary/10" : "bg-red-500/10"}`}>
        <p className={`text-sm ${isBn ? "font-[var(--font-bengali)]" : ""} ${remainingChanges > 0 ? "text-primary" : "text-red-500"}`}>
          {isBn ? "অবশিষ্ট পরিবর্তন: " : "Remaining changes: "}
          <span className="font-semibold">{remainingChanges}/3</span>
        </p>
      </div>

      {remainingChanges === 0 && (
        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className={`text-sm text-red-600 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "আপনি সর্বোচ্চ ৩ বার ব্যবহারকারী নাম পরিবর্তন করতে পারেন" : "You can change your username a maximum of 3 times"}
          </p>
        </div>
      )}

      <form onSubmit={handleUsernameChange} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium text-foreground mb-2 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {isBn ? "নতুন ব্যবহারকারী নাম" : "New Username"}
          </label>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => {
              setNewUsername(e.target.value)
              checkUsernameAvailability(e.target.value)
            }}
            disabled={remainingChanges === 0 || isLoading}
            placeholder={isBn ? "নতুন ব্যবহারকারী নাম প্রবেশ করুন" : "Enter new username"}
            className={`w-full px-4 py-2 rounded-lg border-2 border-secondary bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed ${
              usernameTaken ? "border-red-500" : ""
            }`}
          />
          {usernameTaken && (
            <p className="text-xs text-red-500 mt-1">
              {isBn ? "এই ব্যবহারকারী নাম ইতিমধ্যে নেওয়া হয়েছে" : "Username already taken"}
            </p>
          )}
        </div>

        {message && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            {message.type === "success" ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <p
              className={`text-sm ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              } ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {message.text}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={remainingChanges === 0 || isLoading || !newUsername.trim() || usernameTaken}
          className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? (isBn ? "পরিবর্তন করছে..." : "Changing...") : isBn ? "পরিবর্তন করুন" : "Change Username"}
        </button>
      </form>
    </div>
  )
}
