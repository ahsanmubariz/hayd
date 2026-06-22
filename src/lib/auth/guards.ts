import type { UserRole } from '@/lib/db/schema';

export function hasRole(role: UserRole, required: UserRole): boolean {
  if (required === 'user') return role === 'user' || role === 'admin';
  return role === required;
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin';
}
