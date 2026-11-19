'use client'

import { useState } from 'react'
import useSWR from 'swr'
import { Activity, Clock3, Eye, LoaderCircle, Save, ShieldCheck, Siren } from 'lucide-react'

type MaintenanceSettings = {
  maintenance_enabled: boolean
  maintenance_title: string
  maintenance_message: string
  expected_return: string | null
  show_countdown: boolean
  updated_at: string | null
}

type ActivityEntry = { id: string; actor_email: string; maintenance_enabled: boolean; created_at: string }
const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: 'no-store' })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || 'Unable to load maintenance settings')
  return body
}

function toLocalInput(value: string | null) {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

export function MaintenanceSettingsPanel() {
  const { data, error, mutate, isLoading } = useSWR<{ settings: MaintenanceSettings }>('/api/maintenance', fetcher, { revalidateOnFocus: true })
  const activity = useSWR<{ activity: ActivityEntry[] }>('/api/maintenance?activity=1', fetcher, { revalidateOnFocus: true })
  const [draft, setDraft] = useState<Partial<MaintenanceSettings>>({})
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const settings = { ...data?.settings, ...draft } as MaintenanceSettings

  const update = <K extends keyof MaintenanceSettings>(key: K, value: MaintenanceSettings[K]) => setDraft((current) => ({ ...current, [key]: value }))
  const save = async () => {
    if (!data || saving) return
    const changedToggle = settings.maintenance_enabled !== data.settings.maintenance_enabled
    if (changedToggle && !window.confirm(`Are you sure you want to ${settings.maintenance_enabled ? 'activate' : 'deactivate'} maintenance mode?`)) return
    setSaving(true)
    setNotice('')
    try {
      const response = await fetch('/api/maintenance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, expected_return: settings.expected_return ? new Date(settings.expected_return).toISOString() : null }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Unable to save changes')
      setDraft({})
      await Promise.all([mutate({ settings: result.settings }), activity.mutate()])
      setNotice('Maintenance settings saved.')
    } catch (saveError) {
      setNotice(saveError instanceof Error ? saveError.message : 'Unable to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm" aria-labelledby="maintenance-settings-title">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-5 sm:px-7">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-500"><Siren className="h-4 w-4" /> Site availability</div>
          <h2 id="maintenance-settings-title" className="text-2xl font-bold text-foreground">Maintenance Mode</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your public website status, visitor message, and reopening time.</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold tracking-wide ${settings.maintenance_enabled ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'}`}>
          <span className={`h-2 w-2 rounded-full ${settings.maintenance_enabled ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          {settings.maintenance_enabled ? 'UNDER MAINTENANCE' : 'LIVE'}
        </span>
      </div>

      {isLoading ? <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" /> Loading saved settings…</div> : error ? <div role="alert" className="p-6 text-sm text-red-500">{error.message}</div> : data && (
        <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
          <div className="space-y-5">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-border p-4">
              <span><span className="block font-semibold text-foreground">Global maintenance</span><span className="mt-1 block text-xs text-muted-foreground">Public pages will show the maintenance screen. Admin access remains available.</span></span>
              <input aria-label="Enable global maintenance mode" type="checkbox" checked={settings.maintenance_enabled} onChange={(event) => update('maintenance_enabled', event.target.checked)} className="h-5 w-5 accent-amber-500" />
            </label>
            <div className="space-y-2"><label htmlFor="maintenance-title" className="text-sm font-medium text-foreground">Maintenance page title</label><input id="maintenance-title" maxLength={90} value={settings.maintenance_title} onChange={(event) => update('maintenance_title', event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-amber-500" /></div>
            <div className="space-y-2"><label htmlFor="maintenance-message" className="text-sm font-medium text-foreground">Visitor message</label><textarea id="maintenance-message" maxLength={500} rows={3} value={settings.maintenance_message} onChange={(event) => update('maintenance_message', event.target.value)} className="w-full resize-y rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-amber-500" /><p className="text-right text-xs text-muted-foreground">{settings.maintenance_message.length}/500</p></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><label htmlFor="maintenance-return" className="text-sm font-medium text-foreground">Expected reopening</label><input id="maintenance-return" type="datetime-local" value={toLocalInput(settings.expected_return)} onChange={(event) => update('expected_return', event.target.value ? new Date(event.target.value).toISOString() : null)} className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-amber-500" /></div>
              <label className="flex items-center gap-3 self-end rounded-lg border border-border px-3 py-3 text-sm text-foreground"><input type="checkbox" checked={settings.show_countdown} onChange={(event) => update('show_countdown', event.target.checked)} className="h-4 w-4 accent-amber-500" /> Show countdown timer</label>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-1"><button type="button" disabled={saving} onClick={save} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-amber-500 px-5 font-bold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60">{saving ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save Changes</button>{notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}</div>
            {settings.updated_at && <p className="text-xs text-muted-foreground">Last updated {new Date(settings.updated_at).toLocaleString()}</p>}
          </div>

          <aside className="space-y-5">
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3 text-sm font-semibold text-foreground"><Eye className="h-4 w-4 text-amber-500" /> Live preview</div>
              <div className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden bg-[#0d1a2c] px-5 py-8 text-center text-white">
                <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: 'url(/images/maintenance-stadium.png)' }} />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a2c]/55 via-[#0d1a2c]/85 to-[#0d1a2c]" />
                <img src="/logos/titanforce-logo.svg" alt="Titan Force Mulikandi crest" className="relative mb-4 h-12 w-12 object-contain" />
                <p className="relative text-[10px] font-bold uppercase tracking-[0.25em] text-amber-400">Titan Force Mulikandi</p>
                <h3 className="relative mt-3 text-2xl font-black uppercase tracking-wide">{settings.maintenance_title}</h3>
                <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-slate-300">Back on the Pitch Soon!</p>
                <p className="relative mt-2 max-w-sm text-sm leading-relaxed text-slate-300">{settings.maintenance_message}</p>
                {settings.expected_return && <p className="relative mt-4 inline-flex items-center gap-2 text-xs text-amber-300"><Clock3 className="h-3.5 w-3.5" />{new Date(settings.expected_return).toLocaleString()}</p>}
              </div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <h3 className="flex items-center gap-2 font-semibold text-foreground"><Activity className="h-4 w-4 text-amber-500" /> Recent activity</h3>
              {activity.error ? <p className="mt-3 text-sm text-red-500">Could not load activity.</p> : activity.isLoading ? <p className="mt-3 text-sm text-muted-foreground">Loading activity…</p> : activity.data?.activity.length ? <ul className="mt-3 divide-y divide-border">{activity.data.activity.map((entry) => <li key={entry.id} className="flex items-start justify-between gap-3 py-3 text-xs"><span className="min-w-0"><span className="block truncate font-medium text-foreground">{entry.actor_email}</span><span className="mt-1 block text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</span></span><span className={`shrink-0 rounded-full px-2 py-1 font-semibold ${entry.maintenance_enabled ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'}`}>{entry.maintenance_enabled ? 'Enabled' : 'Disabled'}</span></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No status changes recorded yet.</p>}
            </div>
            <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> Your admin dashboard and sign-in remain available while public pages are under maintenance.</p>
          </aside>
        </div>
      )}
    </section>
  )
}
