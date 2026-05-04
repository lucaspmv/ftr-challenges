import { Prisma, PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../../auth/password';
import { signToken } from '../../auth/jwt';
import { throwError } from '../../errors';
import { signUpSchema, signInSchema } from '../../validation/auth';

type SignUpInput = { name: string; email: string; password: string };
type SignInInput = { email: string; password: string; rememberMe?: boolean };

const publicUser = (u: { id: string; name: string; email: string; createdAt: Date }) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  createdAt: u.createdAt,
});

export const signUp = async (prisma: PrismaClient, raw: SignUpInput) => {
  const parsed = signUpSchema.safeParse(raw);
  if (!parsed.success) {
    throwError('BAD_USER_INPUT', parsed.error.issues[0].message);
  }
  const { name, email, password } = parsed.data!;
  const passwordHash = await hashPassword(password);
  try {
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });
    return { user: publicUser(user), token: signToken({ userId: user.id }) };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throwError('CONFLICT', 'E-mail já cadastrado');
    }
    throw e;
  }
};

export const signIn = async (prisma: PrismaClient, raw: SignInInput) => {
  const parsed = signInSchema.safeParse(raw);
  if (!parsed.success) {
    throwError('BAD_USER_INPUT', parsed.error.issues[0].message);
  }
  const { email, password } = parsed.data!;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throwError('BAD_USER_INPUT', 'E-mail ou senha inválidos');
  const ok = await comparePassword(password, user!.passwordHash);
  if (!ok) throwError('BAD_USER_INPUT', 'E-mail ou senha inválidos');
  return {
    user: publicUser(user!),
    token: signToken({ userId: user!.id }),
  };
};

export const findUserById = (prisma: PrismaClient, id: string) =>
  prisma.user.findUnique({ where: { id } });
