import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check if gallery already has data
    const { data: existing, error: checkError } = await supabase
      .from('gallery')
      .select('id')
      .limit(1)

    if (checkError) throw checkError
    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'Gallery already has data' }, { status: 200 })
    }

    // Sample gallery data
    const sampleData = [
      {
        title: 'Champions League Victory',
        description: 'Historic win against rivals in the final match',
        image_url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=600&fit=crop',
        type: 'match',
        is_featured: true
      },
      {
        title: 'Team Celebration',
        description: 'Players celebrating after winning the trophy',
        image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&h=600&fit=crop',
        type: 'team-events',
        is_featured: true
      },
      {
        title: 'Training Session',
        description: 'Intense tactical training with the coaching staff',
        image_url: 'https://images.unsplash.com/photo-1516156064457-6f5bc43e4f73?w=800&h=600&fit=crop',
        type: 'training',
        is_featured: true
      },
      {
        title: 'Official Jersey Launch',
        description: 'New season merchandise collection unveiled',
        image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop',
        type: 'merchandise',
        is_featured: true
      },
      {
        title: 'Match Highlights',
        description: 'Best moments from today&apos;s match',
        image_url: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&h=600&fit=crop',
        type: 'match',
        is_featured: false
      },
      {
        title: 'News Update',
        description: 'Latest news from the club',
        image_url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9e55?w=800&h=600&fit=crop',
        type: 'news',
        is_featured: false
      }
    ]

    const { error } = await supabase
      .from('gallery')
      .insert(sampleData)

    if (error) throw error

    return NextResponse.json({ message: 'Gallery seeded successfully', count: sampleData.length }, { status: 200 })
  } catch (error) {
    console.error('Error seeding gallery:', error)
    return NextResponse.json({ error: 'Failed to seed gallery' }, { status: 500 })
  }
}
