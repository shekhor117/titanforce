'use client'

import { useState, useEffect } from 'react'
import GalleryDataService, { GalleryType, GalleryItem } from '@/lib/gallery-data-service'
import { useLanguage } from '@/lib/language-context'
import { X, Search } from 'lucide-react'

const GALLERY_TYPES: { value: GalleryType; label: string; labelBn: string }[] = [
  { value: 'match', label: 'Match', labelBn: 'ম্যাচ' },
  { value: 'team-events', label: 'Team Events', labelBn: 'টিম ইভেন্ট' },
  { value: 'training', label: 'Training', labelBn: 'প্রশিক্ষণ' },
  { value: 'merchandise', label: 'Merchandise', labelBn: 'পণ্য' },
  { value: 'news', label: 'News', labelBn: 'খবর' }
]

export default function GalleryPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  
  const [items, setItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [selectedType, setSelectedType] = useState<GalleryType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    const allItems = GalleryDataService.getGalleryItems()
    setItems(allItems)
  }, [])

  useEffect(() => {
    let filtered = items

    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [items, selectedType, searchQuery])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">
            {isBn ? 'গ্যালারি' : 'Gallery'}
          </h1>
          <p className="text-primary-foreground/90">
            {isBn ? 'টাইটান ফোর্সের স্মৃতি এবং মুহূর্ত' : 'Memories and moments of Titan Force'}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder={isBn ? 'অনুসন্ধান করুন...' : 'Search...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              selectedType === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card border border-border text-foreground hover:border-primary/50'
            }`}
          >
            {isBn ? 'সব' : 'All'}
          </button>
          {GALLERY_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                selectedType === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border text-foreground hover:border-primary/50'
              }`}
            >
              {isBn ? type.labelBn : type.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=500&fit=crop'
                  }}
                />
                {item.isFeatured && (
                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                    {isBn ? 'বৈশিষ্ট্য' : 'Featured'}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    {GALLERY_TYPES.find(t => t.value === item.type)?.[isBn ? 'labelBn' : 'label']}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📷</div>
            <p className="text-muted-foreground text-lg">
              {isBn ? 'কোন ছবি পাওয়া যায়নি' : 'No images found'}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-card border border-border rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">{selectedItem.title}</h2>
              <button
                onClick={() => setSelectedItem(null)}
                className="p-2 hover:bg-muted rounded transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 overflow-auto bg-muted flex items-center justify-center min-h-96">
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop'
                }}
              />
            </div>

            {/* Details */}
            <div className="p-6 border-t border-border space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-1">
                  {isBn ? 'বিবরণ' : 'Description'}
                </h3>
                <p className="text-foreground">{selectedItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    {isBn ? 'ধরন' : 'Type'}
                  </p>
                  <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded inline-block">
                    {GALLERY_TYPES.find(t => t.value === selectedItem.type)?.[isBn ? 'labelBn' : 'label']}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">
                    {isBn ? 'তারিখ' : 'Date'}
                  </p>
                  <p className="text-foreground text-sm">
                    {selectedItem.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
