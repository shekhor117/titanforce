'use client'

import Image from 'next/image'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { Clock3, Trophy } from 'lucide-react'

type MaintenanceState = {
  maintenance_title: string
  maintenance_message: string
  expected_return: string | null
  show_countdown: boolean
}

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error('Maintenance status unavailable')
  return response.json()
}

function Countdown({ target }: { target: string }) {
  const [remaining, setRemaining] = useState(0)
  useEffect(() => {
    const update = () => setRemaining(Math.max(0, Math.floor((new Date(target).getTime() - Date.now()) / 1000)))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [target])
  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  const seconds = remaining % 60
  return <p className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-amber-200"><Clock3 className="h-4 w-4" /><span aria-live="polite">{days}d {hours}h {minutes}m {seconds}s</span></p>
}

export default function MaintenancePage() {
  const { data } = useSWR<{ settings: MaintenanceState }>('/api/maintenance', fetcher, { revalidateOnFocus: true, refreshInterval: 60000 })
  const maintenance = data?.settings
  const title = maintenance?.maintenance_title || "WE'RE UPGRADING"
  const message = maintenance?.maintenance_message || "We're currently improving our digital home to bring you a better experience. Stay tuned!"
  const hasCountdown = Boolean(maintenance?.show_countdown && maintenance.expected_return && Date.parse(maintenance.expected_return) > Date.now())

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111f] px-4 py-8 text-white sm:px-8">
      <div className="absolute inset-0 bg-cover bg-center opacity-35" style={{ backgroundImage: 'url(/images/maintenance-stadium.png)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111f]/60 via-[#07111f]/80 to-[#07111f]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(218,165,58,0.12),transparent_60%)]" />
      <section className="relative w-full max-w-3xl animate-in fade-in slide-in-from-bottom-3 duration-700 rounded-[2rem] border border-white/10 bg-[#0c1929]/75 px-6 py-10 text-center shadow-2xl shadow-black/40 backdrop-blur-md sm:px-12 sm:py-14">
        <Image src="/logos/titanforce-logo.svg" alt="Titan Force Mulikandi crest" width={80} height={80} priority className="mx-auto h-16 w-16 object-contain sm:h-20 sm:w-20" />
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-amber-400 sm:text-sm">Titan Force Mulikandi</p>
        <div className="mx-auto mt-8 flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/25 bg-amber-400/10 text-amber-300"><Trophy className="h-5 w-5" /></div>
        <h1 className="mt-5 text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-6xl">{title}</h1>
        <p className="mt-5 text-xl font-bold text-amber-400 sm:text-2xl">Back on the Pitch Soon!</p>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{message}</p>
        {hasCountdown && <Countdown target={maintenance!.expected_return!} />}
        {maintenance?.expected_return && !hasCountdown && <p className="mt-6 text-sm text-slate-300">Expected reopening: <time dateTime={maintenance.expected_return}>{new Date(maintenance.expected_return).toLocaleString()}</time></p>}
        <div className="mx-auto mt-9 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-200"><span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />System maintenance</div>
        <p className="mt-7 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Titan Force Mulikandi <span aria-hidden="true">·</span> Est. 2025</p>
      </section>
    </main>
  )
}
