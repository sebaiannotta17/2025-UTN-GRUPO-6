import fs from 'fs';
import path from 'path';
import db from '../db.js';

const dbPath = path.join(new URL('../database/materiales.db', import.meta.url).pathname);
console.log('Checking DB path:', dbPath);
console.log('Exists on disk:', fs.existsSync(dbPath));

try {
  // list tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables:', tables.map(t => t.name));

  // count usuarios
  const cnt = db.prepare('SELECT COUNT(*) AS c FROM usuarios').get();
  console.log('Usuarios count:', cnt && cnt.c);

  // show pragma integrity_check
  const integrity = db.prepare("PRAGMA integrity_check;").all();
  console.log('Integrity check:', integrity);
} catch (e) {
  console.error('DB check error:', e && e.message ? e.message : e);
  if (e && e.stack) console.error(e.stack);
  process.exit(1);
}

process.exit(0);
