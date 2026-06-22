import { z } from 'zod';
import { findByEmail, findUserById } from '@/lib/db/client';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { createUser, createProfile, updateUserStatus, updatePassword, updateProfile } from './repository';
import { createUserSchema, updateProfileSchema, changePasswordSchema } from './validation';
import type { CreateUserInput, UpdateProfileInput, ChangePasswordInput } from './validation';

export class ValidationError extends Error {
  constructor(
    message: string,
    public fieldErrors: Record<string, string>,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class AuthError extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
    this.name = 'AuthError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export async function registerUser(input: CreateUserInput) {
  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new ValidationError('Invalid input', fieldErrors);
  }
  const existing = await findByEmail(parsed.data.email);
  if (existing) {
    // Generic message to prevent email enumeration
    throw new ValidationError('Unable to create account. The email may already be in use or the input is invalid.', { email: 'Unable to create account with this email' });
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const user = await createUser({
    email: parsed.data.email,
    passwordHash,
    role: parsed.data.role,
  });
  await createProfile({
    userId: user.id,
    displayName: parsed.data.displayName,
    timezone: parsed.data.timezone,
  });
  return user;
}

export async function authenticateUser(email: string, password: string) {
  const user = await findByEmail(email);
  if (!user) throw new AuthError();
  if (user.status === 'deleted') throw new AuthError();
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) throw new AuthError();
  if (user.status === 'inactive') {
    throw new AuthError('Account is inactive. Contact an administrator.');
  }
  return user;
}

export async function getUserById(id: string) {
  const user = await findUserById(id);
  if (!user) throw new NotFoundError('User not found');
  return user;
}

export async function changePassword(userId: string, input: ChangePasswordInput) {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new ValidationError('Invalid input', fieldErrors);
  }
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('User not found');
  const ok = await verifyPassword(input.currentPassword, user.password_hash);
  if (!ok) {
    throw new ValidationError('Incorrect password', { currentPassword: 'Current password is incorrect' });
  }
  const passwordHash = await hashPassword(input.newPassword);
  await updatePassword(userId, passwordHash);
}

export async function deactivateUser(userId: string) {
  await updateUserStatus(userId, 'inactive');
}

export async function reactivateUser(userId: string) {
  await updateUserStatus(userId, 'active');
}

export async function softDeleteUser(userId: string) {
  await updateUserStatus(userId, 'deleted');
}

export async function adminResetPassword(userId: string, newPassword: string) {
  const passwordSchema = z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number');
  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) {
    const msgs = parsed.error.issues.map((i) => i.message);
    throw new ValidationError('Invalid password', { newPassword: msgs.join('. ') });
  }
  const user = await findUserById(userId);
  if (!user) throw new NotFoundError('User not found');
  const passwordHash = await hashPassword(newPassword);
  await updatePassword(userId, passwordHash);
}

export async function updateUserProfile(userId: string, input: UpdateProfileInput) {
  const parsed = updateProfileSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? 'form';
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    throw new ValidationError('Invalid input', fieldErrors);
  }
  await updateProfile(userId, {
    displayName: parsed.data.displayName,
    timezone: parsed.data.timezone,
    birthYear: parsed.data.birthYear,
    cycleGoal: parsed.data.cycleGoal,
    averageCycleLengthOverride: parsed.data.averageCycleLengthOverride,
    averagePeriodLengthOverride: parsed.data.averagePeriodLengthOverride,
  });
}
