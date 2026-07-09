'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Ticket } from '@/lib/data-store'
import { Plus, Trash2 } from 'lucide-react'

export default function TicketsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [formData, setFormData] = useState({ matchId: '', sectionId: '', seatNumber: '', price: 0, status: 'available' as const })

  useEffect(() => {
    setIsClient(true)
    loadTickets()
  }, [])

  const loadTickets = () => {
    try {
      const data = dataStore.getTickets()
      setTickets(data)
    } catch (err) {
      console.log('[v0] Failed to load tickets')
    }
  }

  const handleAdd = () => {
    if (formData.matchId && formData.seatNumber && formData.price > 0) {
      const newTicket = dataStore.addTicket(formData)
      setTickets([...tickets, newTicket])
      setFormData({ matchId: '', sectionId: '', seatNumber: '', price: 0, status: 'available' })
    }
  }

  const handleDelete = (id: string) => {
    dataStore.deleteTicket(id)
    setTickets(tickets.filter(t => t.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'টিকেট' : 'Tickets'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'ম্যাচ আইডি' : 'Match ID'} value={formData.matchId} onChange={(e) => setFormData({...formData, matchId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'বিভাগ' : 'Section'} value={formData.sectionId} onChange={(e) => setFormData({...formData, sectionId: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='text' placeholder={isBn ? 'আসন সংখ্যা' : 'Seat Number'} value={formData.seatNumber} onChange={(e) => setFormData({...formData, seatNumber: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <input type='number' placeholder={isBn ? 'দাম' : 'Price'} value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'><option value='available'>Available</option><option value='sold'>Sold</option><option value='reserved'>Reserved</option></select>
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {tickets.map(ticket => (
          <div key={ticket.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{ticket.sectionId} - {ticket.seatNumber}</p><p className='text-xs text-muted-foreground'>${ticket.price}</p></div>
            <button onClick={() => handleDelete(ticket.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
          </div>
        ))}
      </div>
    </div>
  )
}
