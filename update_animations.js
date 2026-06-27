const fs = require('fs');
const path = require('path');
const glob = require('glob');

// List of files to potentially update
const filesToCheck = [
  'app/admin/players/page.tsx',
  'app/admin/matches/page.tsx',
  'app/admin/news/page.tsx',
  'app/admin/gallery/page.tsx',
  'app/admin/injuries/page.tsx',
  'app/admin/lineup/page.tsx',
  'app/admin/motm/page.tsx',
  'app/admin/partners/page.tsx',
  'app/admin/rankings/page.tsx',
  'app/admin/squad-manager/page.tsx',
  'app/admin/settings/page.tsx',
  'app/admin/fans/page.tsx',
  'app/admin/contacts/page.tsx',
  'app/admin/features/page.tsx',
  'app/admin/analytics/page.tsx',
  'app/admin/cms/page.tsx',
  'app/admin/media/page.tsx',
  'app/admin/trophies/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/migrations/page.tsx',
  'app/admin/player-profiles/page.tsx',
  'app/admin/system/page.tsx',
  'app/account/page.tsx',
  'app/checkout/page.tsx',
];

let updated = 0;

filesToCheck.forEach(file => {
  const filepath = path.join(__dirname, file);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf-8');
  
  // Skip if already has animations
  if (content.includes('PageEntrance') || content.includes('EntranceReveal')) return;
  
  // Skip if it's a redirect
  if (content.includes('redirect(')) return;
  
  // Add import if using 'use client'
  if (content.includes("'use client'")) {
    // Check if PageEntrance import exists
    if (!content.includes('PageEntrance')) {
      const importMatch = content.match(/import\s+{[^}]*}\s+from\s+['"]@\/components\/[^'"]*['"]/);
      if (importMatch) {
        const lastImportEnd = content.indexOf('\n', content.lastIndexOf('import'));
        content = content.slice(0, lastImportEnd) + "\nimport { PageEntrance } from '@/components/page-entrance'" + content.slice(lastImportEnd);
      } else {
        const firstImport = content.indexOf('import');
        if (firstImport !== -1) {
          const firstImportEnd = content.indexOf('\n', firstImport);
          content = content.slice(0, firstImportEnd + 1) + "import { PageEntrance } from '@/components/page-entrance'\n" + content.slice(firstImportEnd + 1);
        }
      }
      updated++;
      fs.writeFileSync(filepath, content, 'utf-8');
      console.log(`✓ Added import to: ${file}`);
    }
  }
});

console.log(`\nUpdated ${updated} files with PageEntrance imports`);
