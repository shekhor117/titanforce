import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { PageEntrance } from '@/components/page-entrance'

export const dynamic = "force-dynamic"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            Authentication Error
          </h1>
          <p className="text-muted-foreground">
            {params?.error 
              ? `Error: ${params.error}` 
              : "Something went wrong during authentication. Please try again."}
          </p>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link 
            href="/login"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl transition-colors text-center"
          >
            Try Again
          </Link>
          <Link 
            href="/"
            className="w-full text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
