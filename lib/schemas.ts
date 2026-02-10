import { z } from 'zod';

export const appSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  url: z.string().url(),
  description: z.string().min(5),
  iconUrl: z.string().url(),
  categoryId: z.string().min(1),
  tags: z.array(z.string()).default([]),
  isActive: z.boolean().default(true)
});

export const categorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true)
});

export const settingsSchema = z.object({
  portalName: z.string().min(2),
  logoUrl: z.string().url()
});

export const roleSchema = z.object({
  uid: z.string().min(1),
  role: z.enum(['USER', 'ADMIN'])
});
