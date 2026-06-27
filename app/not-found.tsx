export const dynamic = "force-dynamic"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">404</h1>
          <p className="text-lg text-muted-foreground">Page not found</p>
        </div>
        <a href="/" className="neo-btn neo-btn-primary inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
          Go back home
        </a>
      </div>
    </div>
  )
}
