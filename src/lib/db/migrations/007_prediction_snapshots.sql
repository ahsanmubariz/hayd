CREATE TABLE IF NOT EXISTS prediction_snapshots (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  basis_period_log_id TEXT NULL,
  predicted_next_period_date TEXT NOT NULL,
  predicted_ovulation_date TEXT NULL,
  predicted_fertile_start TEXT NULL,
  predicted_fertile_end TEXT NULL,
  average_cycle_length_used INTEGER NOT NULL,
  average_period_length_used INTEGER NOT NULL,
  cycles_considered INTEGER NOT NULL,
  confidence_band TEXT NOT NULL,
  algorithm_version TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_prediction_snapshots_user_created
  ON prediction_snapshots(user_id, created_at DESC);
