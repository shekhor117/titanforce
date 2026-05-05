'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Clock, ArrowLeft, CheckCircle } from 'lucide-react'

export default function PendingApprovalPage() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'user'

  const roleLabels: Record<string, string> = {
    player: 'Player',
    partner: 'Partner',
    fan: 'Fan',
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Clock className="w-10 h-10 text-yellow-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Pending Approval
        </h1>

        {/* Description */}
        <p className="text-zinc-400 mb-8">
          Your <span className="text-red-500 font-semibold">{roleLabels[role]}</span> account has been created successfully. 
          An admin will review and approve your account shortly.
        </p>

        {/* What happens next */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 text-left">
          <h3 className="text-white font-semibold mb-4">What happens next?</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-400 text-sm">Your account is created and waiting for admin approval</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-zinc-600 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-400 text-sm">Admin will verify your {role} credentials</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-zinc-600 mt-0.5 flex-shrink-0" />
              <span className="text-zinc-400 text-sm">You&apos;ll get full access to your {role} dashboard once approved</span>
            </li>
          </ul>
        </div>

        {/* Estimated time */}
        <p className="text-sm text-zinc-500 mb-8">
          Typical approval time: <span className="text-white">24-48 hours</span>
        </p>

        {/* Back to home */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  )
}
