export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'deleted';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  email_verified: number;
  created_at: string;
  updated_at: string;
  deactivated_at: string | null;
  deleted_at: string | null;
}

export interface UserProfile {
  user_id: string;
  display_name: string;
  timezone: string;
  birth_year: number | null;
  cycle_goal: string | null;
  average_cycle_length_override: number | null;
  average_period_length_override: number | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
  last_seen_at: string;
  ip_hash: string | null;
  user_agent_hash: string | null;
  revoked_at: string | null;
}

export interface PasswordResetToken {
  id: string;
  user_id: string;
  token_hash: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface PeriodLog {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  flow_intensity: string | null;
  notes: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface DailyStatusLog {
  id: string;
  user_id: string;
  log_date: string;
  bleeding_status: string | null;
  pain_level: number | null;
  mood: string | null;
  energy_level: number | null;
  symptoms_json: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ConfidenceBand = 'low' | 'medium';

export interface PredictionSnapshot {
  id: string;
  user_id: string;
  basis_period_log_id: string | null;
  predicted_next_period_date: string;
  predicted_ovulation_date: string | null;
  predicted_fertile_start: string | null;
  predicted_fertile_end: string | null;
  average_cycle_length_used: number;
  average_period_length_used: number;
  cycles_considered: number;
  confidence_band: ConfidenceBand;
  algorithm_version: string;
  created_at: string;
}

export interface AdminAuditLog {
  id: string;
  admin_user_id: string;
  target_user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata_json: string | null;
  created_at: string;
}
