import { HomePageClient } from "@/components/home-page-client"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const HOME_TABLES = ["matches", "players", "news_items", "partners", "media_items", "products"] as const

type HomeData = Record<string, unknown[]>

// Vercel-to-Supabase cold starts can exceed local preview timings.
const HOME_DATA_TIMEOUT_MS = 8000
const HOME_PAGE_SIZE = 12

async function getHomeData(): Promise<HomeData> {
  const supabase = await createClient()
  const results: Array<readonly [string, unknown[]]> = []

  for (const table of HOME_TABLES) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), HOME_DATA_TIMEOUT_MS)

    try {
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .range(0, HOME_PAGE_SIZE - 1)
        .abortSignal(controller.signal)

      if (error) {
        console.error(`[v0] Server homepage fetch failed for ${table}:`, error.message)
        results.push([table, []])
      } else {
        results.push([table, data ?? []])
      }
    } catch (error) {
      console.error(`[v0] Server homepage fetch timed out for ${table}:`, error)
      results.push([table, []])
    } finally {
      clearTimeout(timeout)
    }
  }

  return Object.fromEntries(results)
}

export default async function Home() {
  const initialData = await getHomeData()
  return <HomePageClient initialData={initialData} />
}
