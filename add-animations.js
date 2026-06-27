#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all page.tsx files that don't have EntranceReveal
const pagesWithoutAnimation = glob.sync('/vercel/share/v0-project/app/**/page.tsx').filter(file => {
  const content = fs.readFileSync(file, 'utf-8');
  return !content.includes('EntranceReveal');
});

console.log(`Found ${pagesWithoutAnimation.length} pages without animations`);

pagesWithoutAnimation.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf-8');
    
    // Add EntranceReveal import if not present
    if (!content.includes('EntranceReveal')) {
      // Find the import section
      const importMatch = content.match(/import\s+{[^}]*}\s+from\s+['"]@\/components\/[^'"]*['"]/);
      
      if (importMatch) {
        // Add EntranceReveal to existing component imports
        const lastImport = content.lastIndexOf("import");
        const nextLineEnd = content.indexOf('\n', lastImport);
        const importLine = content.substring(lastImport, nextLineEnd);
        
        if (!importLine.includes('EntranceReveal')) {
          const newImportLine = importLine.replace('}', ', EntranceReveal }');
          content = content.substring(0, lastImport) + newImportLine + content.substring(nextLineEnd);
        }
      } else {
        // Add new import
        const firstImportIndex = content.indexOf('import ');
        if (firstImportIndex !== -1) {
          const nextNewline = content.indexOf('\n', firstImportIndex);
          content = content.slice(0, nextNewline + 1) + 'import { EntranceReveal } from "@/components/entrance-reveal"\n' + content.slice(nextNewline + 1);
        }
      }
    }
    
    // Wrap main content with EntranceReveal
    // Look for return statements with JSX
    const returnMatch = content.match(/return\s*\(\s*<[^>]+>/);
    
    if (returnMatch && !content.includes('EntranceReveal')) {
      // Find the opening tag after return
      const returnIdx = content.indexOf(returnMatch[0]);
      const afterReturn = returnIdx + returnMatch[0].length - 1;
      const tagEnd = content.indexOf('>', afterReturn) + 1;
      
      // Insert EntranceReveal wrapper
      const indent = '        ';
      const openWrapper = `<EntranceReveal delay={0.2} duration={0.6} variant="fadeInUp">\n${indent}`;
      const closeWrapper = `\n${indent}</EntranceReveal>`;
      
      // Find the closing of the main return element
      const closingMatch = content.match(/\)\s*\n\s*\}\s*\n/);
      if (closingMatch) {
        const closingIdx = content.lastIndexOf(closingMatch[0]);
        const contentToWrap = content.slice(afterReturn, closingIdx - 8);
        
        // Only wrap if not already wrapped
        if (!contentToWrap.includes('EntranceReveal')) {
          const beforeWrap = content.slice(0, afterReturn);
          const afterWrap = content.slice(closingIdx - 8);
          content = beforeWrap + openWrapper + contentToWrap + closeWrapper + afterWrap;
        }
      }
    }
    
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✓ Updated: ${path.relative('/vercel/share/v0-project', file)}`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});
