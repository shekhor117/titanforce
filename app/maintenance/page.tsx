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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07111f] px-5 py-8 text-white sm:px-8 sm:py-12">
      <div className="absolute inset-0 scale-105 bg-cover bg-center" style={{ backgroundImage: 'url(/images/maintenance-stadium.png)' }} aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07111f]/65 via-[#07111f]/80 to-[#07111f]/95" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgba(218,165,58,0.10),transparent_58%)]" aria-hidden="true" />
      <section className="relative w-full max-w-4xl animate-in fade-in slide-in-from-bottom-3 duration-700 text-center">
        <header className="flex flex-col items-center">
          <Image src="/logos/titanforce-logo.svg" alt="Titan Force Mulikandi crest" width={68} height={68} priority className="h-14 w-14 object-contain sm:h-[68px] sm:w-[68px]" />
          <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.24em] text-amber-400 sm:mt-4 sm:text-xs sm:tracking-[0.32em]">Titan Force Mulikandi</p>
        </header>
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-[#07111f]/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200 backdrop-blur-sm sm:mt-8 sm:text-xs"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />Temporarily unavailable</div>
        <h1 className="mt-7 text-4xl font-black uppercase leading-[0.98] tracking-tight text-white sm:mt-9 sm:text-6xl md:text-7xl">{title}</h1>
        <p className="mt-4 text-xl font-bold text-amber-400 sm:mt-5 sm:text-3xl">Back on the Pitch Soon!</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:mt-5 sm:text-lg sm:leading-8">{message}</p>
        {hasCountdown && <Countdown target={maintenance!.expected_return!} />}
        {maintenance?.expected_return && !hasCountdown && <p className="mt-5 text-sm text-slate-200">Expected reopening: <time dateTime={maintenance.expected_return}>{new Date(maintenance.expected_return).toLocaleString()}</time></p>}
        <div className="mx-auto mt-6 max-w-2xl border-y border-white/15 bg-[#07111f]/35 py-4 backdrop-blur-sm sm:mt-8 sm:py-5">
          <p className="text-base font-semibold text-white sm:text-lg">We&apos;re making improvements for the season ahead.</p>
          <p className="mt-1 text-sm text-slate-200">Thank you for your patience and continued support.</p>
        </div>
        <footer className="mt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-300 sm:mt-8 sm:text-xs sm:tracking-[0.2em]">Titan Force Mulikandi <span aria-hidden="true">·</span> Est. 2025</footer>
      </section>
    </main>
  )
}
