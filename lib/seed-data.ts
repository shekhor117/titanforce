/**
 * Data Seed Script
 * This script helps you populate sample data into your Supabase database
 * Run this manually or call it from your admin panel initialization
 */

import { createClient } from '@/lib/supabase/client'

export async function seedDatabaseWithSampleData() {
  const supabase = createClient()
  
  if (!supabase) {
    console.error('[v0] Supabase client not available')
    return false
  }

  try {
    console.log('[v0] Starting database seeding...')

    // Check if data already exists
    const { data: existingPlayers } = await supabase.from('players').select('id').limit(1)
    
    if (existingPlayers && existingPlayers.length > 0) {
      console.log('[v0] Database already has players, skipping seed')
      return true
    }

    // Seed Players
    const playersData = [
      {
        num: 1,
        name: 'Ahmed',
        full_name: 'Ahmed Hassan Khan',
        position: 'GK',
        category: 'GK',
        age: 28,
        hometown: 'Dhaka',
        foot: 'Right',
        goals: 0,
        assists: 0,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1516156064457-6f5bc43e4f73?w=500&h=600&fit=crop',
      },
      {
        num: 2,
        name: 'Karim',
        full_name: 'Karim Abdullah Ahmed',
        position: 'DEF',
        category: 'DEF',
        age: 26,
        hometown: 'Chittagong',
        foot: 'Right',
        goals: 2,
        assists: 1,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=600&fit=crop',
      },
      {
        num: 7,
        name: 'Rahim',
        full_name: 'Rahim Hassan Miah',
        position: 'MID',
        category: 'MID',
        age: 24,
        hometown: 'Sylhet',
        foot: 'Left',
        goals: 5,
        assists: 8,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1446890877081-d282a0f896e2?w=500&h=600&fit=crop',
      },
      {
        num: 9,
        name: 'Rashid',
        full_name: 'Rashid Mohammed Khan',
        position: 'FWD',
        category: 'FWD',
        age: 23,
        hometown: 'Dhaka',
        foot: 'Right',
        goals: 12,
        assists: 3,
        status: 'active',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
      },
    ]

    const { error: playersError } = await supabase
      .from('players')
      .insert(playersData)

    if (playersError) {
      console.error('[v0] Error seeding players:', playersError)
    } else {
      console.log('[v0] Successfully seeded', playersData.length, 'players')
    }

    // Seed Matches
    const matchesData = [
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        opponent: 'City United',
        status: 'scheduled',
        notes: 'Home match - League game',
      },
      {
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        opponent: 'River FC',
        status: 'completed',
        goals_for: 3,
        goals_against: 1,
        notes: 'Dominant victory',
      },
      {
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        opponent: 'Star City',
        status: 'completed',
        goals_for: 2,
        goals_against: 2,
        notes: 'Hard-fought draw',
      },
    ]

    const { error: matchesError } = await supabase
      .from('matches')
      .insert(matchesData)

    if (matchesError) {
      console.error('[v0] Error seeding matches:', matchesError)
    } else {
      console.log('[v0] Successfully seeded', matchesData.length, 'matches')
    }

    // Seed Products (Store)
    const productsData = [
      {
        name: 'Home Jersey 2024',
        description: 'Official home jersey with squad number',
        price: 3500,
        category: 'Home',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
        stock: 50,
        rating: 4.8,
        reviews: 25,
      },
      {
        name: 'Away Jersey 2024',
        description: 'Official away jersey - white and blue',
        price: 3500,
        category: 'Away',
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=600&fit=crop',
        stock: 35,
        rating: 4.6,
        reviews: 18,
      },
      {
        name: 'Training Kit',
        description: 'Lightweight training jersey and shorts',
        price: 2500,
        category: 'Training',
        image_url: 'https://images.unsplash.com/photo-1516156064457-6f5bc43e4f73?w=500&h=600&fit=crop',
        stock: 60,
        rating: 4.5,
        reviews: 22,
      },
    ]

    const { error: productsError } = await supabase
      .from('products')
      .insert(productsData)

    if (productsError) {
      console.error('[v0] Error seeding products:', productsError)
    } else {
      console.log('[v0] Successfully seeded', productsData.length, 'products')
    }

    // Seed News
    const newsData = [
      {
        title: 'Team Secures Championship Victory',
        content: 'Titan Force FC has secured the league championship with a dominant performance this season.',
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
        status: 'published',
        featured: true,
      },
      {
        title: 'New Training Facility Inaugurated',
        content: 'The club inaugurated its state-of-the-art training facility equipped with world-class amenities.',
        image_url: 'https://images.unsplash.com/photo-1516156064457-6f5bc43e4f73?w=800&h=600&fit=crop',
        status: 'published',
        featured: false,
      },
    ]

    const { error: newsError } = await supabase
      .from('news')
      .insert(newsData)

    if (newsError) {
      console.error('[v0] Error seeding news:', newsError)
    } else {
      console.log('[v0] Successfully seeded', newsData.length, 'news items')
    }

    // Seed Gallery
    const galleryData = [
      {
        title: 'Champions League Victory',
        description: 'Historic win against rivals in the final match',
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
        type: 'match',
        is_featured: true,
      },
      {
        title: 'Team Celebration',
        description: 'Players celebrating after winning the trophy',
        image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
        type: 'team-events',
        is_featured: true,
      },
      {
        title: 'Training Session',
        description: 'Intense tactical training with the coaching staff',
        image_url: 'https://images.unsplash.com/photo-1516156064457-6f5bc43e4f73?w=800&h=600&fit=crop',
        type: 'training',
        is_featured: true,
      },
      {
        title: 'Stadium Atmosphere',
        description: 'Amazing crowd support during home match',
        image_url: 'https://images.unsplash.com/photo-1552074328-5b1bb4dffc36?w=800&h=600&fit=crop',
        type: 'match',
        is_featured: true,
      },
      {
        title: 'Jersey Launch Event',
        description: 'New season merchandise collection unveiled',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
        type: 'merchandise',
        is_featured: true,
      },
      {
        title: 'Player Interview',
        description: 'Post-match interview with team captain',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        type: 'news',
        is_featured: false,
      },
    ]

    const { error: galleryError } = await supabase
      .from('gallery')
      .insert(galleryData)

    if (galleryError) {
      console.error('[v0] Error seeding gallery:', galleryError)
    } else {
      console.log('[v0] Successfully seeded', galleryData.length, 'gallery items')
    }

    console.log('[v0] Database seeding completed successfully!')
    return true
  } catch (error) {
    console.error('[v0] Error during database seeding:', error)
    return false
  }
}
