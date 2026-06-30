'use client'

import { StandingsManager } from '@/components/admin/standings-manager'

export default function AdminStandingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Standings</h1>
        <p className="text-foreground/60 mt-2">Add, edit, and manage league standings</p>
      </div>

      <StandingsManager />
    </div>
  )
}
