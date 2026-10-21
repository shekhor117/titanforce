import { HomePageClient } from "@/components/home-page-client"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const HOME_TABLES = ["matches", "players", "news", "standings", "products"] as const

type HomeData = Record<string, unknown[]>

async function getHomeData(): Promise<HomeData> {
  const supabase = await createClient()
  const results = await Promise.all(
    HOME_TABLES.map(async (table) => {
      const { data, error } = await supabase.from(table).select("*").limit(50)
      if (error) {
        console.error(`[v0] Server homepage fetch failed for ${table}:`, error.message)
        return [table, []] as const
      }
      return [table, data ?? []] as const
    }),
  )
  return Object.fromEntries(results)
}

export default async function Home() {
  const initialData = await getHomeData()
  return <HomePageClient initialData={initialData} />
}
