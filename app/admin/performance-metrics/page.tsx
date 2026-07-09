'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, PerformanceMetric } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function PerformanceMetricsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [formData, setFormData] = useState({ playerId: '', matchId: '', metricType: 'speed' as const, value: 0, unit: '', recordedAt: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    setIsClient(true)
    loadMetrics()
  }, [])

  const loadMetrics = () => {
    try {
      const data = dataStore.getPerformanceMetrics()
      setMetrics(data)
    } catch (err) {
      console.log('[v0] Failed to load metrics')
    }
  }

  const handleAdd = () => {
    if (formData.value > 0) {
      const newMetric = dataStore.addPerformanceMetric({...formData, recordedAt: new Date(formData.recordedAt).toISOString()})
      setMetrics([...metrics, newMetric])
      setFormData({ playerId: '', matchId: '', metricType: 'speed', value: 0, unit: '', recordedAt: new Date().toISOString().split('T')[0] })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deletePerformanceMetric(id)
    setMetrics(metrics.filter(m => m.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'কর্মক্ষমতা মেট্রিক্স' : 'Performance Metrics'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'খেলোয়াড় ID' : 'Player ID'} value={formData.playerId} onChange={(e) => setFormData({...formData, playerId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'ম্যাচ ID' : 'Match ID'} value={formData.matchId} onChange={(e) => setFormData({...formData, matchId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.metricType} onChange={(e) => setFormData({...formData, metricType: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'>
          <option value='speed'>Speed</option>
          <option value='accuracy'>Accuracy</option>
          <option value='possession'>Possession</option>
          <option value='assists'>Assists</option>
          <option value='passes'>Passes</option>
          <option value='tackles'>Tackles</option>
        </select>
        <input type='number' placeholder={isBn ? 'মূল্য' : 'Value'} value={formData.value} onChange={(e) => setFormData({...formData, value: parseFloat(e.target.value) || 0})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'ইউনিট' : 'Unit'} value={formData.unit} onChange={(e) => setFormData({...formData, unit: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='date' value={formData.recordedAt} onChange={(e) => setFormData({...formData, recordedAt: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {metrics.map(metric => (
          <div key={metric.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{metric.metricType}</p><p className='text-xs text-muted-foreground'>{metric.value} {metric.unit}</p></div>
            <button onClick={() => handleDelete(metric.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
