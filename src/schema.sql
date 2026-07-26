-- Fase 0: pekerja + pesanan saja. Tanpa iuran, tanpa ledger — sesuai docs/06-roadmap.md.

CREATE TABLE IF NOT EXISTS workers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telegram_id INTEGER UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  active INTEGER NOT NULL DEFAULT 0,
  lat REAL,
  lng REAL,
  orders_completed_today INTEGER NOT NULL DEFAULT 0,
  last_active_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  requester_telegram_id INTEGER NOT NULL,
  requester_name TEXT NOT NULL,
  module TEXT NOT NULL CHECK (module IN ('mijek', 'mibeli', 'miservis')),
  description TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'menunggu' CHECK (status IN ('menunggu', 'diterima', 'selesai', 'batal')),
  worker_id INTEGER REFERENCES workers(id),
  broadcast_message_ids TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  accepted_at TEXT,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_workers_active ON workers(active);
