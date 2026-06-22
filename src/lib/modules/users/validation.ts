import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email().max(254),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  displayName: z.string().min(1).max(80),
  role: z.enum(['admin', 'user']).default('user'),
  timezone: z.string().default('Asia/Jakarta'),
});

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(80).optional(),
  timezone: z.string().optional(),
  birthYear: z.number().int().min(1900).max(2100).nullable().optional(),
  cycleGoal: z.enum(['tracking', 'planning']).nullable().optional(),
  averageCycleLengthOverride: z.number().int().min(15).max(90).nullable().optional(),
  averagePeriodLengthOverride: z.number().int().min(1).max(30).nullable().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
