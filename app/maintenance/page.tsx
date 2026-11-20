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
  return <p className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-[#8b2336]"><Clock3 className="h-4 w-4" /><span aria-live="polite">{days}d {hours}h {minutes}m {seconds}s</span></p>
}

export default function MaintenancePage() {
  const { data } = useSWR<{ settings: MaintenanceState }>('/api/maintenance', fetcher, { revalidateOnFocus: true, refreshInterval: 60000 })
  const maintenance = data?.settings
  const title = maintenance?.maintenance_title || "WE'RE UPGRADING"
  const message = maintenance?.maintenance_message || "We're currently improving our digital home to bring you a better experience. Stay tuned!"
  const hasCountdown = Boolean(maintenance?.show_countdown && maintenance.expected_return && Date.parse(maintenance.expected_return) > Date.now())

  return (
    <main className="relative flex min-h-screen justify-center overflow-hidden bg-[#f7faff] px-5 py-8 text-[#102b50] sm:px-8 sm:py-10">
      <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: 'url(/images/maintenance-stadium.png)' }} aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#f7faff]/75 via-[#f7faff]/72 to-[#f7faff]/86" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-28 -top-32 size-80 rounded-full bg-[#cfe4f8]/55 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 -right-28 size-96 rounded-full bg-[#f3d7dc]/55 blur-3xl" aria-hidden="true" />
      <section className="relative w-full max-w-4xl animate-in fade-in slide-in-from-bottom-3 duration-700 text-center">
        <header className="flex flex-col items-center">
          <Image src="/logos/titanforce-logo.svg" alt="Titan Force Mulikandi crest" width={72} height={72} priority className="h-14 w-14 object-contain sm:h-[72px] sm:w-[72px]" />
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7b2036] sm:mt-4 sm:text-sm sm:tracking-[0.24em]">Titan Force Mulikandi</p>
        </header>
        <div className="relative mx-auto mt-3 w-full max-w-3xl sm:mt-1">
          <Image src="/images/maintenance-team.png" alt="Titan Force technicians working together on club servers and equipment" width={1856} height={1136} priority sizes="(max-width: 768px) 100vw, 768px" className="h-auto max-h-[330px] w-full object-contain sm:max-h-[410px]" />
        </div>
        <p role="status" className="mt-2 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.19em] text-[#7b2036] sm:mt-0 sm:text-sm sm:tracking-[0.22em]">
          <span className="size-2.5 rounded-full bg-[#8b2336]" aria-hidden="true" />System maintenance
        </p>
        <h1 className="mt-4 text-4xl font-black uppercase leading-[0.98] tracking-tight text-[#102b50] sm:mt-5 sm:text-6xl md:text-7xl">{title}</h1>
        <p className="mt-4 font-serif text-2xl italic text-[#8b2336] sm:mt-5 sm:text-4xl">Back on the Pitch Soon!</p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#172a43] sm:mt-5 sm:text-xl sm:leading-8">{message}</p>
        {hasCountdown && <Countdown target={maintenance!.expected_return!} />}
        {maintenance?.expected_return && !hasCountdown && <p className="mt-5 text-sm font-medium text-[#172a43]">Expected reopening: <time dateTime={maintenance.expected_return}>{new Date(maintenance.expected_return).toLocaleString()}</time></p>}
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-[#102b50]/50 bg-white/55 px-4 py-4 sm:mt-8 sm:px-8 sm:py-5">
          <p className="text-lg font-bold text-[#102b50] sm:text-2xl">Something exciting is coming!</p>
          <p className="mt-1 text-sm text-[#172a43] sm:text-lg">Thank you for your patience.</p>
        </div>
        <footer className="mt-6 pb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-[#102b50]/75 sm:mt-8 sm:text-xs sm:tracking-[0.2em]">Titan Force Mulikandi <span aria-hidden="true">·</span> <a href="mailto:titanforcemulikandi@gmail.com" aria-label="Email Titan Force Mulikandi support" className="normal-case tracking-normal text-[#8b2336] underline decoration-[#8b2336]/40 underline-offset-4">Support</a></footer>
      </section>
    </main>
  )
}
