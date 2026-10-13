import fs from 'node:fs/promises'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY

if (!supabaseUrl || !serviceKey) throw new Error('Supabase server credentials are not configured')

const tables = [
  'players', 'player_profiles', 'player_positions', 'matches', 'lineup', 'rankings', 'standings',
  'injuries', 'motm', 'news', 'news_updates', 'media', 'partners', 'features', 'fans', 'contacts',
  'trophies', 'settings', 'app_settings', 'products', 'orders', 'inventory', 'app_users',
]

const headers = { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` }
const backup = { source: 'supabase', exportedAt: new Date().toISOString(), tables: {}, skippedTables: [] }

for (const table of tables) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, { headers })
  if (!response.ok) {
    backup.skippedTables.push({ table, status: response.status })
    continue
  }
  backup.tables[table] = await response.json()
}

await fs.mkdir('backups', { recursive: true })
await fs.writeFile('backups/supabase-backup.json', `${JSON.stringify(backup, null, 2)}\n`, 'utf8')
console.log(`Backed up ${Object.keys(backup.tables).length} tables; skipped ${backup.skippedTables.length}.`)
console.log('Created backups/supabase-backup.json')
