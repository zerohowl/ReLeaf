import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create or update .npmrc to force legacy peer deps
const npmrcPath = path.join(__dirname, '.npmrc');
const npmrcContent = 'legacy-peer-deps=true\nstrict-peer-dependencies=false\n';
fs.writeFileSync(npmrcPath, npmrcContent);

console.log('✅ Created .npmrc file with legacy-peer-deps=true');

// Exit successfully
process.exit(0);
