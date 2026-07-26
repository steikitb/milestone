const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.env.DB_PATH || './data/milestone.sqlite';

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

// Migrasi tambahan untuk database yang sudah ada dari sebelum kolom ini ditambah
// (CREATE TABLE IF NOT EXISTS di schema.sql tidak menyentuh tabel yang sudah ada).
const migrations = [
  "ALTER TABLE orders ADD COLUMN requester_phone TEXT",
  "ALTER TABLE orders ADD COLUMN source TEXT NOT NULL DEFAULT 'telegram'",
];
for (const sql of migrations) {
  try {
    db.exec(sql);
  } catch (err) {
    if (!/duplicate column name/i.test(err.message)) throw err;
  }
}

module.exports = db;
