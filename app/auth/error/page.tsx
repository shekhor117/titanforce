'use client'

import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-3">
          Authentication Error
        </h1>

        {/* Description */}
        <p className="text-zinc-400 mb-8">
          Something went wrong during authentication. This could be due to an expired link, 
          invalid credentials, or a network issue.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link 
            href="/auth/login"
            className="block w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Try Again
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Help text */}
        <p className="mt-8 text-sm text-zinc-500">
          If this issue persists, please contact support.
        </p>
      </div>
    </div>
  )
}
