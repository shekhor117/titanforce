import fs from 'node:fs/promises'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY
const dryRun = process.argv.includes('--dry-run')

if (!supabaseUrl || !serviceKey) throw new Error('Supabase server credentials are not configured')

const categories = ['players', 'matches', 'content', 'club', 'store', 'settings', 'users']
const headers = {
  apikey: serviceKey,
  Authorization: `Bearer ${serviceKey}`,
  'Content-Type': 'application/json',
  Prefer: 'resolution=merge-duplicates,return=minimal',
}
const summary = {}

for (const category of categories) {
  const file = JSON.parse(await fs.readFile(`backups/${category}.json`, 'utf8'))
  summary[category] = {}

  for (const [table, records] of Object.entries(file.tables ?? {})) {
    if (!Array.isArray(records) || records.length === 0) {
      summary[category][table] = 0
      continue
    }

    if (dryRun) {
      summary[category][table] = records.length
      continue
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/${table}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(records),
    })

    if (!response.ok) {
      const detail = await response.text()
      throw new Error(`Restore failed for ${table} (${response.status}): ${detail}`)
    }

    summary[category][table] = records.length
  }
}

console.log(JSON.stringify({ dryRun, summary }, null, 2))
if (dryRun) console.log('Dry run only. No Supabase data was changed.')
else console.log('Supabase restore completed using merge-duplicates upserts.')
