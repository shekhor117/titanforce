'use client'

import Image from 'next/image'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import { Clock3 } from 'lucide-react'

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111f] px-5 py-12 text-white sm:px-8">
      <div className="absolute inset-0 scale-105 bg-cover bg-center" style={{ backgroundImage: 'url(/images/maintenance-stadium.png)' }} aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111f]/65 via-[#07111f]/75 to-[#07111f]/95" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(218,165,58,0.12),transparent_58%)]" aria-hidden="true" />
      <section className="relative w-full max-w-5xl animate-in fade-in slide-in-from-bottom-3 duration-700 text-center">
        <header className="flex flex-col items-center">
          <Image src="/logos/titanforce-logo.svg" alt="Titan Force Mulikandi crest" width={80} height={80} priority className="h-16 w-16 object-contain sm:h-20 sm:w-20" />
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.25em] text-amber-400 sm:text-sm sm:tracking-[0.34em]">Titan Force Mulikandi</p>
        </header>
        <div className="mx-auto mt-10 h-px w-16 bg-amber-400/70 sm:mt-12" aria-hidden="true" />
        <h1 className="mt-8 text-4xl font-black uppercase leading-[0.98] tracking-tight text-white sm:mt-10 sm:text-6xl md:text-7xl">{title}</h1>
        <p className="mt-5 text-xl font-bold text-amber-400 sm:mt-6 sm:text-3xl">Back on the Pitch Soon!</p>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-200 sm:mt-7 sm:text-xl sm:leading-8">{message}</p>
        {hasCountdown && <Countdown target={maintenance!.expected_return!} />}
        {maintenance?.expected_return && !hasCountdown && <p className="mt-6 text-sm text-slate-200">Expected reopening: <time dateTime={maintenance.expected_return}>{new Date(maintenance.expected_return).toLocaleString()}</time></p>}
        <div className="mt-9 inline-flex items-center gap-3 border-y border-amber-300/35 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200 sm:mt-11 sm:text-sm"><span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />System maintenance</div>
        <footer className="mt-10 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-300/80 sm:mt-12 sm:text-xs">Titan Force Mulikandi <span aria-hidden="true">·</span> Est. 2025</footer>
      </section>
    </main>
  )
}
