CREATE TABLE IF NOT EXISTS daily_status_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date TEXT NOT NULL,
  bleeding_status TEXT NULL,
  pain_level INTEGER NULL,
  mood TEXT NULL,
  energy_level INTEGER NULL,
  symptoms_json TEXT NULL,
  notes TEXT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(user_id, log_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_status_user_date
  ON daily_status_logs(user_id, log_date DESC);
