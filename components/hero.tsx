"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"

export function Hero() {
  const { language, t } = useLanguage()
  const isBn = language === "bn"
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-950 via-black to-black" />

          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl animate-pulse" />

              <Image
                src="/logo.png"
                alt="Opening Logo"
                width={160}
                height={160}
                className="w-40 md:w-56 animate-[openingLogo_2s_ease] drop-shadow-[0_0_40px_rgba(59,130,246,0.9)]"
                priority
              />
            </div>

            <h1 className="mt-8 text-4xl md:text-6xl font-black tracking-[10px] text-white animate-[openingText_2s_ease] font-[var(--font-display)]">
              TITAN FORCE
            </h1>

            <div className="mt-6 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 animate-[loadingBar_3s_linear_forwards]" />
            </div>

            <p className="mt-4 text-zinc-400 tracking-[6px] text-sm animate-pulse">
              LOADING EXPERIENCE
            </p>
          </div>
        </div>
      )}

      <section id="home" className="hero-gradient relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-150px] right-[-100px] w-[450px] h-[450px] bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: "radial-gradient(circle at 70% 30%, var(--primary) 0%, transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-36 text-center">
          <div className="animate-fade-up flex justify-center mb-6 animate-[float_5s_ease-in-out_infinite]">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl scale-125 animate-pulse" />
              <Image
                src="/logo.png"
                alt="Titan Force FC Logo"
                width={180}
                height={180}
                className="relative z-10 object-contain drop-shadow-2xl drop-shadow-[0_0_35px_rgba(59,130,246,0.8)] animate-[logoIntro_1.5s_ease] hover:scale-110 transition duration-500"
                priority
              />
            </div>
          </div>
          <div className="animate-fade-up">
            <p className={`text-sm uppercase tracking-[0.3em] mb-4 font-semibold text-primary animate-fadeIn ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
              {t.hero.subtitle}
            </p>
          </div>
          <h2 className={`text-5xl md:text-7xl lg:text-8xl leading-none tracking-wide text-foreground animate-fade-up animation-delay-100 ${isBn ? "font-[var(--font-bengali)] font-bold" : "font-[var(--font-display)]"}`}>
            <span className="block text-white mx-auto">
              {t.hero.welcome}
            </span>
            <span className="block text-primary mt-2 mx-auto">
              {t.hero.clubName}
            </span>
          </h2>
          <p className={`mt-6 text-lg text-foreground/70 max-w-xl mx-auto animate-fade-up animation-delay-200 animate-fadeIn delay-300 ${isBn ? "font-[var(--font-bengali)]" : ""}`}>
            {t.hero.tagline}
          </p>
          <div className="mt-8 flex justify-center gap-4 animate-fade-up animation-delay-300 animate-fadeIn delay-500">
            <Link
              href="/team-squad"
              className={`px-6 py-3 font-bold text-sm uppercase tracking-wider rounded bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 hover:scale-110 shadow-[0_0_30px_rgba(255,0,0,0.5)] ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {t.hero.viewSquad}
            </Link>
            <Link
              href="/fixtures-results"
              className={`px-6 py-3 font-bold text-sm uppercase tracking-wider rounded border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110 ${isBn ? "font-[var(--font-bengali)]" : ""}`}
            >
              {t.hero.matches}
            </Link>
          </div>

          {/* Floating Text */}
          <div className="absolute bottom-10 text-[80px] md:text-[160px] font-black text-white/5 whitespace-nowrap animate-[slide_18s_linear_infinite] font-[var(--font-display)]">
            TITAN FORCE • TITAN FORCE •
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slide {
            0% {
              transform: translateX(0);
            }

            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes logoIntro {
            0% {
              opacity: 0;
              transform: scale(0.3) rotate(-15deg);
              filter: blur(10px);
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
              filter: blur(0px);
            }
          }

          @keyframes blink {
            50% {
              border-color: transparent;
            }
          }

          @keyframes openingLogo {
            0% {
              opacity: 0;
              transform: scale(0.2) rotate(-30deg);
              filter: blur(20px);
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
              filter: blur(0px);
            }
          }

          @keyframes openingText {
            0% {
              opacity: 0;
              letter-spacing: 30px;
              transform: translateY(40px);
            }

            100% {
              opacity: 1;
              letter-spacing: 10px;
              transform: translateY(0px);
            }
          }

          @keyframes loadingBar {
            from {
              width: 0%;
            }

            to {
              width: 100%;
            }
          }

          .animate-fadeIn {
            animation: fadeIn 1s ease forwards;
          }

          .delay-300 {
            animation-delay: 0.3s;
          }

          .delay-500 {
            animation-delay: 0.5s;
          }
        `}</style>
      </section>
    </>
  )
}
