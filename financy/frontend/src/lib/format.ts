import { format, parseISO } from 'date-fns';

export const formatBRL = (n: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);

export const formatSignedBRL = (amount: number, type: 'INCOME' | 'EXPENSE') =>
  `${type === 'INCOME' ? '+ ' : '- '}${formatBRL(Math.abs(amount))}`;

export const formatDateShort = (iso: string) => format(parseISO(iso), 'dd/MM/yy');
export const formatDateLong = (iso: string) => format(parseISO(iso), 'dd/MM/yyyy');

export const toIsoDate = (d: Date) => d.toISOString();
