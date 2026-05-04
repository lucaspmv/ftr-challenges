import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CategoryIconBadge } from './category-icon';
import { CategoryTag } from './category-tag';
import { formatDateShort, formatSignedBRL } from '@/lib/format';
import type { CategoryColor } from '@/lib/colors';
import type { CategoryIconKey } from '@/lib/icons';

export type TransactionRowProps = {
  transaction: {
    id: string; description: string; amount: number;
    type: 'INCOME' | 'EXPENSE'; date: string;
    category: { id: string; title: string; icon: string; color: string };
  };
  onEdit?: () => void;
  onDelete?: () => void;
};

export function TransactionRow({ transaction: t, onEdit, onDelete }: TransactionRowProps) {
  const isIncome = t.type === 'INCOME';
  return (
    <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <CategoryIconBadge icon={t.category.icon as CategoryIconKey} color={t.category.color as CategoryColor} />
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-gray-800">{t.description}</p>
        <p className="text-xs text-gray-500">{formatDateShort(t.date)}</p>
      </div>
      <CategoryTag color={t.category.color as CategoryColor} label={t.category.title} />
      <div className="flex items-center gap-3">
        <span className={`flex items-center gap-1 text-sm font-semibold ${isIncome ? 'text-success' : 'text-danger'}`}>
          {formatSignedBRL(t.amount, t.type)}
          {isIncome ? <ArrowUpCircle className="size-4" /> : <ArrowDownCircle className="size-4" />}
        </span>
        {onEdit && <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Editar"><Pencil className="size-4" /></Button>}
        {onDelete && <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Excluir"><Trash2 className="size-4" /></Button>}
      </div>
    </div>
  );
}
