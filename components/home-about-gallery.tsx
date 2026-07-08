'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { useMediaItems } from '@/lib/use-data-store'
import { EntranceReveal } from '@/components/entrance-reveal'

export function HomeAboutGallery() {
  const { mediaItems } = useMediaItems()
  const galleryImages = mediaItems.slice(0, 4)

  return null
}
