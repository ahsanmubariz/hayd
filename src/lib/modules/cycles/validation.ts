import { z } from 'zod';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
  .refine((v) => !Number.isNaN(new Date(v).getTime()), 'Invalid date');

export const createPeriodLogSchema = z
  .object({
    startDate: isoDate,
    endDate: isoDate,
    flowIntensity: z.enum(['light', 'medium', 'heavy']).optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((v) => new Date(v.endDate) >= new Date(v.startDate), {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export const updatePeriodLogSchema = z
  .object({
    startDate: isoDate.optional(),
    endDate: isoDate.optional(),
    flowIntensity: z.enum(['light', 'medium', 'heavy']).optional(),
    notes: z.string().max(500).optional(),
  })
  .refine((v) => {
    if (v.startDate && v.endDate) return new Date(v.endDate) >= new Date(v.startDate);
    return true;
  }, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export const createDailyStatusSchema = z.object({
  logDate: isoDate,
  bleedingStatus: z.enum(['spotting', 'light', 'medium', 'heavy']).optional(),
  painLevel: z.number().int().min(0).max(10).optional(),
  mood: z.string().max(40).optional(),
  energyLevel: z.number().int().min(0).max(10).optional(),
  symptoms: z.array(z.string().max(40)).max(20).optional(),
  notes: z.string().max(500).optional(),
});

export const updateDailyStatusSchema = createDailyStatusSchema.partial();

export type CreatePeriodLogInput = z.infer<typeof createPeriodLogSchema>;
export type UpdatePeriodLogInput = z.infer<typeof updatePeriodLogSchema>;
export type CreateDailyStatusInput = z.infer<typeof createDailyStatusSchema>;
export type UpdateDailyStatusInput = z.infer<typeof updateDailyStatusSchema>;
