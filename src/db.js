const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH || './data/milestone.sqlite';

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

module.exports = db;
