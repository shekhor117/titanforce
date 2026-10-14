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

const categories = {
  players: ['players', 'player_profiles', 'player_positions', 'lineup', 'rankings', 'standings', 'injuries', 'motm'],
  matches: ['matches'],
  content: ['news', 'news_updates', 'media', 'features'],
  club: ['partners', 'fans', 'contacts', 'trophies'],
  store: ['products', 'orders', 'inventory'],
  settings: ['settings', 'app_settings'],
  users: ['app_users'],
}

for (const [category, categoryTables] of Object.entries(categories)) {
  const categoryBackup = {
    source: 'supabase',
    category,
    exportedAt: backup.exportedAt,
    tables: Object.fromEntries(categoryTables.filter((table) => backup.tables[table]).map((table) => [table, backup.tables[table]])),
    skippedTables: categoryTables.filter((table) => backup.skippedTables.some((entry) => entry.table === table)),
  }
  const serialized = `${JSON.stringify(categoryBackup, null, 2)}\n`
  await fs.writeFile(`backups/${category}.json`, serialized, 'utf8')
  if (['players', 'matches', 'content', 'club', 'store'].includes(category)) {
    await fs.mkdir('public/data', { recursive: true })
    await fs.writeFile(`public/data/${category}.json`, serialized, 'utf8')
  }
}

console.log(`Backed up ${Object.keys(backup.tables).length} tables; skipped ${backup.skippedTables.length}.`)
console.log('Created backups/supabase-backup.json and categorized backups/*.json')
