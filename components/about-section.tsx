"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AboutSectionProps {
  title: string
  description: string
  imageUrl: string
}

export function AboutSection({
  title,
  description,
  imageUrl,
}: AboutSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text content */}
          <div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white uppercase tracking-wider mb-6">
              {title}
            </h2>
            <p className="text-foreground/80 text-lg leading-relaxed mb-8">
              {description}
            </p>
            <Link href="/about">
              <Button className="bg-muted text-foreground hover:bg-primary hover:text-primary-foreground font-bold uppercase tracking-wider gap-2 transition-all">
                Learn More
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Image */}
          <div className="relative h-96 md:h-full rounded-lg overflow-hidden group">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
