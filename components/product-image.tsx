"use client"

import { ImageOff } from "lucide-react"
import { useState } from "react"

type ProductImageProps = {
  src?: string | null
  alt: string
  className?: string
  fallbackSrc?: string
}

export function ProductImage({ src, alt, className = "", fallbackSrc = "/products/kit-17.png" }: ProductImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc)
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-secondary text-muted-foreground ${className}`} role="img" aria-label={`${alt} image unavailable`}>
        <ImageOff className="h-10 w-10" aria-hidden="true" />
        <span className="text-xs">Image unavailable</span>
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc)
        else setFailed(true)
      }}
    />
  )
}
