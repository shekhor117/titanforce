"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface JerseyShowcaseProps {
  playerName: string
  playerNumber: number
  clubName?: string
  clubLogo?: string
}

export function JerseyShowcase({
  playerName,
  playerNumber,
  clubName = "TITAN FORCE",
  clubLogo,
}: JerseyShowcaseProps) {
  const [showBack, setShowBack] = useState(false)

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Jersey Container */}
        <div className="relative aspect-square md:aspect-auto md:h-[500px] lg:h-[600px] bg-gradient-to-b from-black/80 to-black/40 rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center perspective">
          {/* 3D Jersey SVG - Front View */}
          {!showBack ? (
            <svg
              className="w-full h-full max-w-md md:max-w-lg"
              viewBox="0 0 400 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="jerseyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#8B0000", stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: "#DC143C", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#8B0000", stopOpacity: 1 }} />
                </linearGradient>
                <pattern id="fabricPattern" patternUnits="userSpaceOnUse" width="20" height="20">
                  <path d="M0,0 Q5,5 10,0 T20,0" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
                  <path d="M0,10 Q5,15 10,10 T20,10" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>

              {/* Jersey Body */}
              <ellipse cx="200" cy="150" rx="90" ry="70" fill="url(#jerseyGradient)" />
              <rect x="110" y="150" width="180" height="250" fill="url(#jerseyGradient)" />
              <path d="M 110 150 Q 90 200 100 350 L 110 360 L 110 150 Z" fill="#660000" opacity="0.8" />
              <path d="M 290 150 Q 310 200 300 350 L 290 360 L 290 150 Z" fill="#660000" opacity="0.8" />

              {/* Fabric Pattern */}
              <rect x="110" y="150" width="180" height="250" fill="url(#fabricPattern)" opacity="0.6" />

              {/* Sleeves */}
              <ellipse cx="80" cy="180" rx="35" ry="55" fill="#DC143C" />
              <ellipse cx="320" cy="180" rx="35" ry="55" fill="#DC143C" />

              {/* Collar */}
              <ellipse cx="200" cy="140" rx="80" ry="25" fill="#000" />
              <ellipse cx="200" cy="135" rx="75" ry="20" fill="#333" />

              {/* Jersey Details - Front Number */}
              <text
                x="200"
                y="270"
                textAnchor="middle"
                fontSize="120"
                fontWeight="bold"
                fill="#fff"
                fontFamily="Arial, sans-serif"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                {playerNumber}
              </text>

              {/* Club Logo placeholder */}
              <circle cx="200" cy="190" r="30" fill="#000" opacity="0.3" stroke="#fff" strokeWidth="2" />
              <text
                x="200"
                y="200"
                textAnchor="middle"
                fontSize="14"
                fill="#fff"
                fontFamily="Arial, sans-serif"
                opacity="0.7"
              >
                TITAN
              </text>

              {/* Club Name */}
              <text
                x="200"
                y="380"
                textAnchor="middle"
                fontSize="28"
                fontWeight="bold"
                fill="#fff"
                fontFamily="Arial, sans-serif"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                {clubName}
              </text>

              {/* 3D Effect - Shadow */}
              <ellipse cx="200" cy="420" rx="100" ry="15" fill="#000" opacity="0.2" />
            </svg>
          ) : (
            /* Back View */
            <svg
              className="w-full h-full max-w-md md:max-w-lg"
              viewBox="0 0 400 500"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="jerseyGradientBack" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#8B0000", stopOpacity: 1 }} />
                  <stop offset="50%" style={{ stopColor: "#DC143C", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#8B0000", stopOpacity: 1 }} />
                </linearGradient>
                <pattern id="fabricPatternBack" patternUnits="userSpaceOnUse" width="20" height="20">
                  <path d="M0,0 Q5,5 10,0 T20,0" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
                  <path d="M0,10 Q5,15 10,10 T20,10" fill="none" stroke="#000" strokeWidth="0.5" opacity="0.3" />
                </pattern>
              </defs>

              {/* Jersey Body - Back */}
              <ellipse cx="200" cy="150" rx="90" ry="70" fill="url(#jerseyGradientBack)" />
              <rect x="110" y="150" width="180" height="250" fill="url(#jerseyGradientBack)" />
              <path d="M 110 150 Q 90 200 100 350 L 110 360 L 110 150 Z" fill="#660000" opacity="0.8" />
              <path d="M 290 150 Q 310 200 300 350 L 290 360 L 290 150 Z" fill="#660000" opacity="0.8" />

              {/* Fabric Pattern - Back */}
              <rect x="110" y="150" width="180" height="250" fill="url(#fabricPatternBack)" opacity="0.6" />

              {/* Sleeves - Back */}
              <ellipse cx="80" cy="180" rx="35" ry="55" fill="#DC143C" />
              <ellipse cx="320" cy="180" rx="35" ry="55" fill="#DC143C" />

              {/* Collar - Back */}
              <ellipse cx="200" cy="140" rx="80" ry="25" fill="#000" />
              <ellipse cx="200" cy="135" rx="75" ry="20" fill="#333" />

              {/* Player Name - Back */}
              <text
                x="200"
                y="240"
                textAnchor="middle"
                fontSize="48"
                fontWeight="bold"
                fill="#fff"
                fontFamily="Arial, sans-serif"
                style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
              >
                {playerName.toUpperCase()}
              </text>

              {/* Jersey Number - Back */}
              <text
                x="200"
                y="340"
                textAnchor="middle"
                fontSize="140"
                fontWeight="bold"
                fill="#fff"
                fontFamily="Arial, sans-serif"
                opacity="0.9"
                style={{ textShadow: "3px 3px 6px rgba(0,0,0,0.9)" }}
              >
                {playerNumber}
              </text>

              {/* 3D Effect - Shadow */}
              <ellipse cx="200" cy="420" rx="100" ry="15" fill="#000" opacity="0.2" />
            </svg>
          )}

          {/* Navigation Buttons */}
          <button
            onClick={() => setShowBack(!showBack)}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-primary/20 hover:bg-primary/40 text-primary transition-all"
            aria-label="Show back view"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => setShowBack(!showBack)}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-primary/20 hover:bg-primary/40 text-primary transition-all"
            aria-label="Show front view"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* View Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4 sm:mt-6">
          <button
            onClick={() => setShowBack(false)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-semibold uppercase transition-all ${
              !showBack
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/30 text-foreground/70 hover:bg-secondary/50"
            }`}
          >
            Front
          </button>
          <button
            onClick={() => setShowBack(true)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-semibold uppercase transition-all ${
              showBack
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/30 text-foreground/70 hover:bg-secondary/50"
            }`}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}
