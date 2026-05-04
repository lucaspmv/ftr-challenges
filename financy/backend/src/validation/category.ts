import { z } from 'zod';

export const CATEGORY_ICONS = [
  'briefcase-business','car-front','heart-pulse','piggy-bank','shopping-cart',
  'ticket','tool-case','utensils','paw-print','house','gift','dumbbell',
  'book-open','baggage-claim','mailbox','receipt-text',
] as const;
export type CategoryIcon = typeof CATEGORY_ICONS[number];

export const CATEGORY_COLORS = [
  'blue','purple','pink','red','orange','yellow','green',
] as const;
export type CategoryColor = typeof CATEGORY_COLORS[number];

export const categoryInputSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().max(140).optional().nullable(),
  icon: z.enum(CATEGORY_ICONS),
  color: z.enum(CATEGORY_COLORS),
});
