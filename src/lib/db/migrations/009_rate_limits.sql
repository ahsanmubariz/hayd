CREATE TABLE IF NOT EXISTS rate_limits (
  id TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 1,
  first_attempt TEXT NOT NULL,
  locked_until TEXT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_first_attempt ON rate_limits(first_attempt);
