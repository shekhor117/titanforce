export type GalleryType = 'match' | 'team-events' | 'training' | 'merchandise' | 'news'

export interface GalleryItem {
  id: string
  title: string
  description: string
  imageUrl: string
  type: GalleryType
  isFeatured: boolean
  createdAt: Date
  uploadedBy?: string
}

class GalleryDataService {
  private galleryItems: GalleryItem[] = [
    {
      id: '1',
      title: 'Champions League Victory',
      description: 'Historic win against rivals in the final match',
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
      type: 'match',
      isFeatured: true,
      createdAt: new Date('2024-05-15'),
      uploadedBy: 'admin'
    },
    {
      id: '2',
      title: 'Team Celebration',
      description: 'Players celebrating after winning the trophy',
      imageUrl: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
      type: 'team-events',
      isFeatured: true,
      createdAt: new Date('2024-05-14'),
      uploadedBy: 'admin'
    },
    {
      id: '3',
      title: 'Training Session',
      description: 'Intense tactical training with the coaching staff',
      imageUrl: 'https://images.unsplash.com/photo-1516156064457-6f5bc43e4f73?w=800&h=600&fit=crop',
      type: 'training',
      isFeatured: true,
      createdAt: new Date('2024-05-13'),
      uploadedBy: 'admin'
    },
    {
      id: '4',
      title: 'Official Jersey Launch',
      description: 'New season merchandise collection unveiled',
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
      type: 'merchandise',
      isFeatured: true,
      createdAt: new Date('2024-05-12'),
      uploadedBy: 'admin'
    },
    {
      id: '5',
      title: 'Match Highlights',
      description: 'Best moments from todays match',
      imageUrl: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop',
      type: 'match',
      isFeatured: false,
      createdAt: new Date('2024-05-11'),
      uploadedBy: 'admin'
    },
    {
      id: '6',
      title: 'News Update',
      description: 'Latest news from the club',
      imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9e55?w=800&h=600&fit=crop',
      type: 'news',
      isFeatured: false,
      createdAt: new Date('2024-05-10'),
      uploadedBy: 'admin'
    }
  ]

  getGalleryItems(type?: GalleryType): GalleryItem[] {
    if (type) {
      return this.galleryItems.filter(item => item.type === type)
    }
    return this.galleryItems
  }

  getFeaturedItems(limit: number = 6): GalleryItem[] {
    return this.galleryItems
      .filter(item => item.isFeatured)
      .slice(0, limit)
  }

  getItemById(id: string): GalleryItem | undefined {
    return this.galleryItems.find(item => item.id === id)
  }

  addItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    this.galleryItems.unshift(newItem)
    return newItem
  }

  updateItem(id: string, updates: Partial<GalleryItem>): GalleryItem | undefined {
    const index = this.galleryItems.findIndex(item => item.id === id)
    if (index !== -1) {
      this.galleryItems[index] = { ...this.galleryItems[index], ...updates }
      return this.galleryItems[index]
    }
    return undefined
  }

  deleteItem(id: string): boolean {
    const index = this.galleryItems.findIndex(item => item.id === id)
    if (index !== -1) {
      this.galleryItems.splice(index, 1)
      return true
    }
    return false
  }

  toggleFeatured(id: string): boolean {
    const item = this.getItemById(id)
    if (item) {
      item.isFeatured = !item.isFeatured
      return true
    }
    return false
  }

  searchItems(query: string): GalleryItem[] {
    const lowerQuery = query.toLowerCase()
    return this.galleryItems.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    )
  }

  getGalleryStats() {
    return {
      total: this.galleryItems.length,
      featured: this.galleryItems.filter(item => item.isFeatured).length,
      byType: {
        match: this.galleryItems.filter(item => item.type === 'match').length,
        'team-events': this.galleryItems.filter(item => item.type === 'team-events').length,
        training: this.galleryItems.filter(item => item.type === 'training').length,
        merchandise: this.galleryItems.filter(item => item.type === 'merchandise').length,
        news: this.galleryItems.filter(item => item.type === 'news').length
      }
    }
  }

  getRecentItems(limit: number = 5): GalleryItem[] {
    return [...this.galleryItems].slice(0, limit)
  }
}

export default new GalleryDataService()
