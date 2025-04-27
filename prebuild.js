const fs = require('fs');
const path = require('path');

// Create or update .npmrc to force legacy peer deps
const npmrcPath = path.join(__dirname, '.npmrc');
const npmrcContent = 'legacy-peer-deps=true\nstrict-peer-dependencies=false\n';
fs.writeFileSync(npmrcPath, npmrcContent);

console.log('✅ Created .npmrc file with legacy-peer-deps=true');

// Exit successfully
process.exit(0);
