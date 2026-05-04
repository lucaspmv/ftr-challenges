import { z } from 'zod';

export const transactionInputSchema = z.object({
  description: z.string().min(1, 'Descrição obrigatória'),
  amount: z.coerce.number().positive('Valor deve ser maior que zero'),
  type: z.enum(['INCOME','EXPENSE']),
  date: z.coerce.date(),
  categoryId: z.string().min(1),
});

export const transactionsRangeSchema = z
  .object({
    month: z.number().int().min(1).max(12).optional().nullable(),
    year: z.number().int().min(2000).max(2100).optional().nullable(),
  })
  .refine(
    (v) =>
      (v.month == null && v.year == null) ||
      (v.month != null && v.year != null),
    { message: 'Forneça month e year juntos ou nenhum' },
  );
