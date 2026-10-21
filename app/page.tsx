import { HomePageClient } from "@/components/home-page-client"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const HOME_TABLES = ["matches", "players", "news", "standings", "products"] as const

type HomeData = Record<string, unknown[]>

const HOME_DATA_TIMEOUT_MS = 2500

async function getHomeData(): Promise<HomeData> {
  const supabase = await createClient()
  const results = await Promise.all(
    HOME_TABLES.map(async (table) => {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), HOME_DATA_TIMEOUT_MS)

      try {
        const { data, error } = await supabase
          .from(table)
          .select("*")
          .limit(50)
          .abortSignal(controller.signal)

        if (error) {
          console.error(`[v0] Server homepage fetch failed for ${table}:`, error.message)
          return [table, []] as const
        }
        return [table, data ?? []] as const
      } catch (error) {
        console.error(`[v0] Server homepage fetch timed out for ${table}:`, error)
        return [table, []] as const
      } finally {
        clearTimeout(timeout)
      }
    }),
  )
  return Object.fromEntries(results)
}

export default async function Home() {
  const initialData = await getHomeData()
  return <HomePageClient initialData={initialData} />
}
