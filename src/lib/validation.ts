import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().optional(),
  images: z.string().url('Invalid URL').optional().transform(val => val ? [val] : []),
  price: z.coerce.number().positive('Price must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
});

export type ProductFormData = z.infer<typeof productSchema>;