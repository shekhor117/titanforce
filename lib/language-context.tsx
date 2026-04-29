"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "bn"

interface Translations {
  nav: {
    home: string
    about: string
    squad: string
    matches: string
    contact: string
  }
  hero: {
    subtitle: string
    welcome: string
    clubName: string
    tagline: string
    viewSquad: string
    matches: string
  }
  about: {
    location: string
    title: string
    description: string
    players: string
    spirit: string
    team: string
  }
  squad: {
    subtitle: string
    title: string
    all: string
    age: string
    goals: string
    assists: string
    cleanSheets: string
    contributions: string
    foot: string
  }
  matches: {
    subtitle: string
    title: string
    upcoming: string
    dateTbd: string
  }
  contact: {
    title: string
    name: string
    namePlaceholder: string
    message: string
    messagePlaceholder: string
    send: string
    success: string
    followUs: string
  }
  footer: {
    rights: string
  }
}

const translations: Record<Language, Translations> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      squad: "Squad",
      matches: "Matches",
      contact: "Contact",
    },
    hero: {
      subtitle: "Mulikandi Football Team",
      welcome: "WELCOME TO",
      clubName: "TITAN FORCE",
      tagline: "Pride · Passion · Power",
      viewSquad: "View Squad",
      matches: "Matches",
    },
    about: {
      location: "Est.2025 Mulikandi, Zakigonj, Sylhet",
      title: "ABOUT THE TEAM",
      description: "We are a passionate football team from Mulikandi, Zakigonj, Sylhet. We play with heart, teamwork, and pride. Every match is a chance to represent our community and push our limits on the pitch.",
      players: "Players",
      spirit: "Spirit",
      team: "Team",
    },
    squad: {
      subtitle: "The Roster",
      title: "TEAM SQUAD",
      all: "All",
      age: "Age",
      goals: "Goals",
      assists: "Assists",
      cleanSheets: "Clean Sheets",
      contributions: "Contributions",
      foot: "Foot",
    },
    matches: {
      subtitle: "Fixtures & Results",
      title: "MATCHES",
      upcoming: "Upcoming",
      dateTbd: "Date TBD",
    },
    contact: {
      title: "GET IN TOUCH",
      name: "Name",
      namePlaceholder: "Your name",
      message: "Message",
      messagePlaceholder: "Your message",
      send: "Send Message",
      success: "Message sent! We'll get back to you.",
      followUs: "Follow Us",
    },
    footer: {
      rights: "Titan Force Mulikandi FT. All rights reserved.",
    },
  },
  bn: {
    nav: {
      home: "হোম",
      about: "সম্পর্কে",
      squad: "স্কোয়াড",
      matches: "ম্যাচ",
      contact: "যোগাযোগ",
    },
    hero: {
      subtitle: "মুলিকান্দি ফুটবল ক্লাব",
      welcome: "স্বাগতম",
      clubName: "টাইটান ফোর্স",
      tagline: "গর্ব · আবেগ · শক্তি",
      viewSquad: "স্কোয়াড দেখুন",
      matches: "ম্যাচসমূহ",
    },
    about: {
      location: "প্রতিষ্ঠা:২০২৫ মুলিকান্দি, জাকিগঞ্জ, সিলেট",
      title: "দল সম্পর্কে",
      description: "আমরা মুলিকান্দি, জাকিগঞ্জ, সিলেটের একটি আবেগপূর্ণ ফুটবল ক্লাব। আমরা হৃদয়, দলবদ্ধতা এবং গর্বের সাথে খেলি। প্রতিটি ম্যাচ আমাদের সম্প্রদায়কে প্রতিনিধিত্ব করার এবং মাঠে আমাদের সীমা অতিক্রম করার সুযোগ।",
      players: "খেলোয়াড়",
      spirit: "স্পিরিট",
      team: "দল",
    },
    squad: {
      subtitle: "রোস্টার",
      title: "টিম স্কোয়াড",
      all: "সবাই",
      age: "বয়স",
      goals: "গোল",
      assists: "অ্যাসিস্ট",
      cleanSheets: "ক্লিন শিট",
      contributions: "অবদান",
      foot: "পা",
    },
    matches: {
      subtitle: "ফিক্সচার ও ফলাফল",
      title: "ম্যাচসমূহ",
      upcoming: "আসন্ন",
      dateTbd: "তারিখ পরে জানানো হবে",
    },
    contact: {
      title: "যোগাযোগ করুন",
      name: "নাম",
      namePlaceholder: "আপনার নাম",
      message: "বার্তা",
      messagePlaceholder: "আপনার বার্তা",
      send: "বার্তা পাঠান",
      success: "বার্তা পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।",
      followUs: "আমাদের অনুসরণ করুন",
    },
    footer: {
      rights: "টাইটান ফোর্স মুলিকান্দি এফসি। সর্বস্বত্ব সংরক্ষিত।",
    },
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: translations[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
