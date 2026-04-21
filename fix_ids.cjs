const fs = require('fs');
let code = fs.readFileSync('src/data/tutors.ts', 'utf8');
code = code.replace(/id: "(\d+)"/g, (match, id) => `id: "${id.padStart(8, '0')}-0000-0000-0000-000000000000"`);
fs.writeFileSync('src/data/tutors.ts', code);
