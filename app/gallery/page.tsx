'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/lib/language-context'
import { useMediaItems } from '@/lib/use-data-store'
import { X, Search, ArrowLeft } from 'lucide-react'

const GALLERY_TYPES = [
  { value: 'match', label: 'Match', labelBn: 'ম্যাচ' },
  { value: 'team-events', label: 'Team Events', labelBn: 'টিম ইভেন্ট' },
  { value: 'training', label: 'Training', labelBn: 'প্রশিক্ষণ' },
  { value: 'merchandise', label: 'Merchandise', labelBn: 'পণ্য' },
  { value: 'news', label: 'News', labelBn: 'খবর' }
]

export default function GalleryPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [selectedType, setSelectedType] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState<any>(null)

  // Use realtime hook - automatically syncs when admin uploads new images
  const { mediaItems, loading, error } = useMediaItems()

  // Filter and search gallery items
  const filteredItems = mediaItems.filter(item => {
    const matchesType = selectedType === 'all' || item.category === selectedType
    const matchesSearch = searchQuery === '' || 
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleImageSelect = (item: any) => {
    setSelectedImage(item)
  }

  const handleClose = () => {
    setSelectedImage(null)
  }

  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='sticky top-0 z-40 border-b border-border/40 backdrop-blur-md'>
        <div className='container px-4 py-4 flex items-center justify-between'>
          <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-sm hover:text-foreground/80 transition'
          >
            <ArrowLeft className='w-4 h-4' />
            {isBn ? 'ফিরে যান' : 'Back'}
          </button>
          <h1 className='text-xl md:text-2xl font-bold'>
            {isBn ? 'গ্যালারি' : 'Gallery'}
          </h1>
          <div className='w-10' />
        </div>
      </header>

      {/* Main Content */}
      <main className='container px-4 py-8'>
        {/* Search and Filter */}
        <div className='mb-8 space-y-4'>
          <div className='flex gap-4 flex-col md:flex-row'>
            <div className='flex-1'>
              <div className='relative'>
                <Search className='absolute left-3 top-3 w-5 h-5 text-muted-foreground' />
                <input
                  type='text'
                  placeholder={isBn ? 'খুঁজুন...' : 'Search...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background'
                />
              </div>
            </div>
          </div>

          {/* Type Filter */}
          <div className='flex gap-2 flex-wrap'>
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg transition ${
                selectedType === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border hover:bg-muted'
              }`}
            >
              {isBn ? 'সব' : 'All'}
            </button>
            {GALLERY_TYPES.map(type => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedType === type.value
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border hover:bg-muted'
                }`}
              >
                {isBn ? type.labelBn : type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>{isBn ? 'লোড হচ্ছে...' : 'Loading...'}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className='text-center py-12'>
            <p className='text-destructive'>{isBn ? 'ত্রুটি হয়েছে' : 'Error loading gallery'}</p>
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && !error && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleImageSelect(item)}
                  className='cursor-pointer group'
                >
                  <div className='relative overflow-hidden rounded-lg aspect-square bg-muted'>
                    <img
                      src={item.url}
                      alt={item.title}
                      className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                    {item.title && (
                      <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4'>
                        <div>
                          <h3 className='font-semibold text-white'>{item.title}</h3>
                          {item.description && (
                            <p className='text-sm text-gray-200'>{item.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='col-span-full text-center py-12'>
                <p className='text-muted-foreground'>{isBn ? 'কোনো ছবি নেই' : 'No images found'}</p>
              </div>
            )}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className='fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4'>
            <div className='relative max-w-4xl w-full'>
              <button
                onClick={handleClose}
                className='absolute -top-10 right-0 text-white hover:text-gray-300'
              >
                <X className='w-6 h-6' />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className='w-full h-auto rounded-lg'
              />
              {selectedImage.title && (
                <div className='mt-4 text-white'>
                  <h2 className='text-2xl font-bold mb-2'>{selectedImage.title}</h2>
                  {selectedImage.description && (
                    <p className='text-gray-300'>{selectedImage.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
