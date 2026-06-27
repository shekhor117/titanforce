'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ZoomGalleryItemProps {
  src: string
  alt: string
  thumbnail?: boolean
  className?: string
  onHover?: (isHovered: boolean) => void
}

export function ZoomGalleryItem({
  src,
  alt,
  thumbnail = true,
  className = '',
  onHover,
}: ZoomGalleryItemProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.div
        className={`relative overflow-hidden rounded-lg cursor-pointer group ${className}`}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => onHover?.(true)}
        onHoverEnd={() => onHover?.(false)}
        onClick={() => setIsOpen(true)}
      >
        {thumbnail && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        {!thumbnail && (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
          <motion.div
            className="opacity-0 group-hover:opacity-100"
            animate={{ scale: [0.8, 1.1, 1] }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 13H7"
              />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <Lightbox
            src={src}
            alt={alt}
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

interface LightboxProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

function Lightbox({ src, alt, isOpen, onClose }: LightboxProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full aspect-auto"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-red-500 transition-colors z-10"
        >
          <X className="w-8 h-8" />
        </button>

        <div className="relative w-full bg-black rounded-lg overflow-hidden">
          <img
            src={src}
            alt={alt}
            className="w-full h-auto"
          />
        </div>

        <motion.p
          className="text-white text-center mt-4 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {alt}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
