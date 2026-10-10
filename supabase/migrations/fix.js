const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '20261009144022_initial_schema.sql');
let sql = fs.readFileSync(filePath, 'utf8');

// Replace CREATE INDEX with CREATE INDEX IF NOT EXISTS
sql = sql.replace(/CREATE INDEX ([a-zA-Z0-9_]+) ON/g, 'CREATE INDEX IF NOT EXISTS $1 ON');

fs.writeFileSync(filePath, sql);
console.log('Fixed SQL file successfully.');
