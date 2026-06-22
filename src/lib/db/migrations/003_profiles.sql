CREATE TABLE IF NOT EXISTS user_profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  birth_year INTEGER NULL,
  cycle_goal TEXT NULL,
  average_cycle_length_override INTEGER NULL,
  average_period_length_override INTEGER NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
