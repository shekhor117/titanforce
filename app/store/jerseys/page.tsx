'use client'

import { useState, useEffect } from 'react'
import JerseyStore from '@/components/JerseyStore'
import { getDataService } from '@/lib/data-service'
import StoreDataService from '@/lib/store-data-service'
import type { Player } from '@/lib/data-service'

export default function JerseyStorePage() {
  const dataService = getDataService()
  
  const [players, setPlayers] = useState<Player[]>([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [playersData, ordersData] = await Promise.all([
        dataService.getPlayers(),
        StoreDataService.getJerseyOrders()
      ])
      
      setPlayers(playersData || [])
      setOrders(ordersData || [])
      setError(null)
    } catch (err) {
      console.error('[v0] Error loading jersey store data:', err)
      setError('Failed to load store data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrders = async (newOrders: any[]) => {
    try {
      setOrders(newOrders)
      // Save orders to Supabase via store service
      for (const order of newOrders) {
        await StoreDataService.createJerseyOrder(order)
      }
    } catch (err) {
      console.error('[v0] Error updating orders:', err)
      setError('Failed to update orders')
    }
  }

  const handleToast = (message: string) => {
    console.log('[v0] Toast:', message)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading store...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <JerseyStore
        players={players}
        orders={orders}
        onUpdateOrders={handleUpdateOrders}
        triggerToast={handleToast}
      />
    </div>
  )
}
