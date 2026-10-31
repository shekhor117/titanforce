"use client"

import { ImageOff } from "lucide-react"
import { useState } from "react"

type ProductImageProps = {
  src?: string | null
  alt: string
  className?: string
}

export function ProductImage({ src, alt, className = "" }: ProductImageProps) {
  const [failed, setFailed] = useState(!src)

  if (failed) {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted to-secondary text-muted-foreground ${className}`} role="img" aria-label={`${alt} image unavailable`}>
        <ImageOff className="h-10 w-10" aria-hidden="true" />
        <span className="text-xs">Image unavailable</span>
      </div>
    )
  }

  return <img src={src ?? ""} alt={alt} className={className} onError={() => setFailed(true)} />
}
