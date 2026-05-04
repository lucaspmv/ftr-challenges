import { z } from 'zod';
import { CATEGORY_COLORS } from './colors';
import { CATEGORY_ICONS } from './icons';

export const signInSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Informe a senha'),
  rememberMe: z.boolean().optional(),
});
export type SignInForm = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
});
export type SignUpForm = z.infer<typeof signUpSchema>;

export const categorySchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  description: z.string().max(140).optional().or(z.literal('')),
  icon: z.enum(CATEGORY_ICONS),
  color: z.enum(CATEGORY_COLORS),
});
export type CategoryForm = z.infer<typeof categorySchema>;
