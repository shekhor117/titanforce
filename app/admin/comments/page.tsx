'use client'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { dataStore, Comment } from '@/lib/data-store'
import { Plus, Trash2, Check } from 'lucide-react'

export default function CommentsPage() {
  const { language } = useLanguage()
  const isBn = language === 'bn'
  const [isClient, setIsClient] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [formData, setFormData] = useState({ relatedId: '', relatedType: 'news' as const, userName: '', content: '', rating: 5, isApproved: false })

  useEffect(() => {
    setIsClient(true)
    loadComments()
  }, [])

  const loadComments = () => {
    try {
      const data = dataStore.getComments()
      setComments(data)
    } catch (err) {
      console.log('[v0] Failed to load comments')
    }
  }

  const handleAdd = () => {
    if (formData.userName && formData.content) {
      const newComment = dataStore.addComment(formData)
      setComments([...comments, newComment])
      setFormData({ relatedId: '', relatedType: 'news', userName: '', content: '', rating: 5, isApproved: false })
    }
  }

  const handleApprove = (id: string) => {
    dataStore.updateComment(id, { isApproved: true })
    setComments(comments.map(c => c.id === id ? { ...c, isApproved: true } : c))
  }

  const handleDelete = (id: string) => {
    dataStore.deleteComment(id)
    setComments(comments.filter(c => c.id !== id))
  }

  if (!isClient) return null

  return (
    <div className='space-y-6 p-6'>
      <h1 className='font-[var(--font-display)] text-3xl tracking-wider'>{isBn ? 'মন্তব্য' : 'Comments'}</h1>
      
      <div className='rounded-lg border-2 border-secondary bg-card p-6 space-y-4'>
        <input type='text' placeholder={isBn ? 'নাম' : 'Name'} value={formData.userName} onChange={(e) => setFormData({...formData, userName: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <textarea placeholder={isBn ? 'মন্তব্য' : 'Comment'} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary h-20' />
        <select value={formData.relatedType} onChange={(e) => setFormData({...formData, relatedType: e.target.value as any})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary'><option value='news'>News</option><option value='photo'>Photo</option><option value='match'>Match</option><option value='player'>Player</option><option value='general'>General</option></select>
        <input type='number' placeholder={isBn ? 'রেটিং' : 'Rating'} min='1' max='5' value={formData.rating} onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})} className='w-full bg-secondary text-foreground px-3 py-2 rounded border border-secondary' />
        <button onClick={handleAdd} className='bg-accent text-white px-4 py-2 rounded flex items-center gap-2 w-full justify-center'><Plus className='w-4 h-4' />{isBn ? 'যোগ করুন' : 'Add'}</button>
      </div>

      <div className='space-y-2'>
        {comments.map(comment => (
          <div key={comment.id} className='flex items-center justify-between bg-secondary p-4 rounded-lg'>
            <div><p className='font-semibold'>{comment.userName}</p><p className='text-xs text-muted-foreground'>{comment.content.substring(0, 50)}...</p><p className='text-xs text-muted-foreground'>{comment.isApproved ? 'Approved' : 'Pending'}</p></div>
            <div className='flex gap-2'>
              {!comment.isApproved && <button onClick={() => handleApprove(comment.id)} className='p-2 hover:bg-green-500/20 rounded text-green-400'><Check className='w-4 h-4' /></button>}
              <button onClick={() => handleDelete(comment.id)} className='p-2 hover:bg-red-500/20 rounded text-red-400'><Trash2 className='w-4 h-4' /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
