export interface Trophy {
  id: string
  name: string
  year: number
  category: 'league' | 'cup' | 'championship' | 'tournament'
  description: string
  icon: string // emoji or icon name
  runners_up?: string
  image_url?: string
  featured?: boolean
}

class TrophyDataService {
  private trophies: Trophy[] = [
    {
      id: '1',
      name: 'Premier League Champion',
      year: 2024,
      category: 'league',
      description: 'Won the prestigious Premier League title with dominant performances',
      icon: '🏆',
      runners_up: 'Manchester United',
      featured: true,
    },
    {
      id: '2',
      name: 'FA Cup Winner',
      year: 2023,
      category: 'cup',
      description: 'Triumphant FA Cup victory in an exciting final',
      icon: '🥇',
      runners_up: 'Liverpool',
      featured: true,
    },
    {
      id: '3',
      name: 'League Cup Champion',
      year: 2023,
      category: 'cup',
      description: 'Claimed the League Cup with an impressive display',
      icon: '🏅',
      runners_up: 'Arsenal',
    },
    {
      id: '4',
      name: 'UEFA Champions League',
      year: 2022,
      category: 'championship',
      description: 'European glory - Won the Champions League',
      icon: '⭐',
      runners_up: 'Real Madrid',
      featured: true,
    },
    {
      id: '5',
      name: 'Community Shield',
      year: 2022,
      category: 'tournament',
      description: 'Defeated Arsenal to claim the Community Shield',
      icon: '🎖️',
      runners_up: 'Arsenal',
    },
  ]

  getTrophies(): Trophy[] {
    return [...this.trophies]
  }

  getTrophyById(id: string): Trophy | undefined {
    return this.trophies.find((t) => t.id === id)
  }

  getFeaturedTrophies(): Trophy[] {
    return this.trophies.filter((t) => t.featured).sort((a, b) => b.year - a.year)
  }

  getTrophiesByYear(year: number): Trophy[] {
    return this.trophies.filter((t) => t.year === year)
  }

  addTrophy(trophy: Omit<Trophy, 'id'>): Trophy {
    const newTrophy: Trophy = {
      ...trophy,
      id: Date.now().toString(),
    }
    this.trophies.push(newTrophy)
    return newTrophy
  }

  updateTrophy(id: string, updates: Partial<Trophy>): Trophy | undefined {
    const index = this.trophies.findIndex((t) => t.id === id)
    if (index === -1) return undefined

    this.trophies[index] = { ...this.trophies[index], ...updates }
    return this.trophies[index]
  }

  deleteTrophy(id: string): boolean {
    const index = this.trophies.findIndex((t) => t.id === id)
    if (index === -1) return false

    this.trophies.splice(index, 1)
    return true
  }

  toggleFeatured(id: string): Trophy | undefined {
    const trophy = this.getTrophyById(id)
    if (!trophy) return undefined

    return this.updateTrophy(id, { featured: !trophy.featured })
  }

  getTrophyStats() {
    return {
      total: this.trophies.length,
      featured: this.trophies.filter((t) => t.featured).length,
      byCategory: {
        league: this.trophies.filter((t) => t.category === 'league').length,
        cup: this.trophies.filter((t) => t.category === 'cup').length,
        championship: this.trophies.filter((t) => t.category === 'championship').length,
        tournament: this.trophies.filter((t) => t.category === 'tournament').length,
      },
    }
  }
}

export default new TrophyDataService()
