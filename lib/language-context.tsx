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
  join: {
    subtitle: string
    title: string
    description: string
    card1Title: string
    card1Desc: string
    card2Title: string
    card2Desc: string
    card3Title: string
    card3Desc: string
    contactBtn: string
    emailBtn: string
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
    join: {
      subtitle: "Be Part of the Legacy",
      title: "JOIN TITAN FORCE",
      description: "Are you passionate about football? Interested in joining one of the most exciting teams in Sylhet? We&apos;re always looking for dedicated players and supporters.",
      card1Title: "For Players",
      card1Desc: "Showcase your skills and represent Titan Force. Play at the highest level with a team that values hard work and dedication.",
      card2Title: "For Supporters",
      card2Desc: "Join our growing community of passionate fans. Get exclusive updates, behind-the-scenes content, and match day experiences.",
      card3Title: "For Partners",
      card3Desc: "Partner with Titan Force and grow your brand. We offer sponsorship opportunities and community engagement programs.",
      contactBtn: "Contact Us",
      emailBtn: "Email: titanforcefc@gmail.com",
    },
    footer: {
      rights: "Titan Force Mulikandi FC. All rights reserved.",
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
    join: {
      subtitle: "ঐতিহ্যের অংশ হন",
      title: "টাইটান ফোর্সে যোগ দিন",
      description: "ফুটবল সম্পর্কে আপনার আবেগ কী? সিলেটের সবচেয়ে রোমাঞ্চকর দলে যোগ দিতে আগ্রহী? আমরা সর্বদা নিবেদিত খেলোয়াড় এবং সমর্থক খুঁজছি।",
      card1Title: "খেলোয়াড়দের জন্য",
      card1Desc: "আপনার দক্ষতা প্রদর্শন করুন এবং টাইটান ফোর্সের প্রতিনিধিত্ব করুন। একটি দলের সাথে সর্বোচ্চ স্তরে খেলুন যা কঠোর পরিশ্রম মূল্য দেয়।",
      card2Title: "সমর্থকদের জন্য",
      card2Desc: "আমাদের ক্রমবর্ধমান উত্সাহী ভক্তদের সম্প্রদায়ে যোগ দিন। এক্সক্লুসিভ আপডেট, বিহাইন্ড-দ্য-সিন কন্টেন্ট এবং ম্যাচ দিনের অভিজ্ঞতা পান।",
      card3Title: "অংশীদারদের জন্য",
      card3Desc: "টাইটান ফোর্সের সাথে অংশীদারিত্ব করুন এবং আপনার ব্র্যান্ড বৃদ্ধি করুন। আমরা স্পন্সরশিপের সুযোগ এবং কমিউনিটি এনগেজমেন্ট প্রোগ্রাম অফার করি।",
      contactBtn: "আমাদের সাথে যোগাযোগ করুন",
      emailBtn: "ইমেল: titanforcefc@gmail.com",
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
