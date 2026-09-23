'use client'

import { useEffect, useMemo, useState } from 'react'
import { Pencil, Plus, RefreshCw, Save, Trash2, X } from 'lucide-react'

const MANAGED_TABLES = [
  'pages', 'events', 'articles', 'player_honours', 'honours', 'news_items', 'media_items',
  'cms_pages', 'cms_content_blocks', 'cms_menus', 'cms_seo', 'cms_settings', 'cms_media_library',
  'banners', 'social_links', 'club_info', 'footer_content', 'shop_categories', 'features_content',
  'testimonials', 'venues', 'seasons', 'training_programs', 'polls', 'tickets', 'gallery_categories',
  'partners', 'sponsors', 'achievements', 'fan_clubs', 'fundraisers', 'performance_metrics',
] as const

type Row = Record<string, unknown> & { id?: string }

const label = (table: string) => table.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())

export function SupabaseDataManager() {
  const [table, setTable] = useState<string>(MANAGED_TABLES[0])
  const [rows, setRows] = useState<Row[]>([])
  const [editing, setEditing] = useState<Row | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const columns = useMemo(() => {
    const keys = new Set<string>()
    rows.forEach((row) => Object.keys(row).forEach((key) => keys.add(key)))
    return Array.from(keys).filter((key) => key !== 'id' && key !== 'created_at' && key !== 'updated_at').slice(0, 5)
  }, [rows])

  const load = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const response = await fetch(`/api/admin/${table}`, { credentials: 'include' })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Failed to load data')
      setRows(Array.isArray(payload) ? payload : [])
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [table])

  const startEdit = (row: Row | null) => {
    const value = row ?? {}
    setEditing(row)
    setEditorOpen(true)
    setDraft(JSON.stringify(value, null, 2))
    setMessage(null)
  }

  const save = async () => {
    try {
      const payload = JSON.parse(draft) as Row
      const response = await fetch(`/api/admin/${table}`, {
        method: editing?.id ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to save')
      setEditing(null)
      setEditorOpen(false)
      setMessage('Saved successfully')
      await load()
    } catch (error) {
      setMessage(error instanceof SyntaxError ? 'Invalid JSON' : error instanceof Error ? error.message : 'Failed to save')
    }
  }

  const remove = async (id: string) => {
    if (!window.confirm('Delete this record?')) return
    const response = await fetch(`/api/admin/${table}?id=${encodeURIComponent(id)}`, { method: 'DELETE', credentials: 'include' })
    const result = await response.json()
    if (!response.ok) setMessage(result.error || 'Failed to delete')
    else { setMessage('Deleted successfully'); await load() }
  }

  return (
    <main className="space-y-6 p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Supabase</p><h1 className="mt-2 text-3xl font-bold">Data Manager</h1><p className="mt-1 text-sm text-muted-foreground">Manage main-site data with protected CRUD operations.</p></div>
        <div className="flex gap-2"><select value={table} onChange={(event) => setTable(event.target.value)} className="rounded-md border bg-background px-3 py-2 text-sm">{MANAGED_TABLES.map((item) => <option key={item} value={item}>{label(item)}</option>)}</select><button onClick={() => void load()} className="rounded-md border p-2" aria-label="Refresh"><RefreshCw className="h-4 w-4" /></button></div>
      </header>
      {message && <div className="rounded-md border border-primary/30 bg-primary/10 p-3 text-sm">{message}</div>}
      <section className="rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-4"><div><h2 className="font-semibold">{label(table)}</h2><p className="text-xs text-muted-foreground">{rows.length} records</p></div><button onClick={() => startEdit(null)} className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"><Plus className="h-4 w-4" /> Add record</button></div>
        {loading ? <p className="p-6 text-sm text-muted-foreground">Loading...</p> : rows.length === 0 ? <p className="p-6 text-sm text-muted-foreground">No records found.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b text-xs text-muted-foreground"><th className="p-3">ID</th>{columns.map((column) => <th key={column} className="p-3">{label(column)}</th>)}<th className="p-3">Actions</th></tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id ?? index)} className="border-b last:border-0"><td className="max-w-[180px] truncate p-3 font-mono text-xs">{String(row.id ?? '—')}</td>{columns.map((column) => <td key={column} className="max-w-[220px] truncate p-3">{typeof row[column] === 'object' ? JSON.stringify(row[column]) : String(row[column] ?? '—')}</td>)}<td className="p-3"><div className="flex gap-1"><button onClick={() => startEdit(row)} className="rounded p-2 hover:bg-muted" aria-label="Edit"><Pencil className="h-4 w-4" /></button>{row.id && <button onClick={() => void remove(row.id!)} className="rounded p-2 text-destructive hover:bg-destructive/10" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>}</div></td></tr>)}</tbody></table></div>}
      </section>
      {editorOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><section className="w-full max-w-2xl rounded-lg border bg-card p-5 shadow-xl"><div className="mb-4 flex items-center justify-between"><h2 className="font-semibold">{editing?.id ? 'Edit' : 'Add'} {label(table)}</h2><button onClick={() => { setEditorOpen(false); setEditing(null) }} aria-label="Close"><X className="h-5 w-5" /></button></div><p className="mb-2 text-xs text-muted-foreground">Edit the record as JSON. Do not change the id when updating.</p><textarea value={draft} onChange={(event) => setDraft(event.target.value)} className="min-h-[320px] w-full rounded-md border bg-background p-3 font-mono text-sm" spellCheck={false} /><div className="mt-4 flex justify-end gap-2"><button onClick={() => { setEditorOpen(false); setEditing(null) }} className="rounded-md border px-4 py-2 text-sm">Cancel</button><button onClick={() => void save()} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"><Save className="h-4 w-4" />Save</button></div></section></div>}
    </main>
  )
}

export { MANAGED_TABLES }
