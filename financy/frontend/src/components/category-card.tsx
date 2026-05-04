import { Pencil, Trash2 } from 'lucide-react';
import { CategoryIconBadge } from './category-icon';
import { CategoryTag } from './category-tag';
import { Button } from '@/components/ui/button';
import type { CategoryColor } from '@/lib/colors';
import type { CategoryIconKey } from '@/lib/icons';

export type CategoryCardProps = {
  category: {
    id: string; title: string; description?: string | null;
    icon: string; color: string; transactionsCount: number;
  };
  onEdit: () => void;
  onDelete: () => void;
};

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <CategoryIconBadge icon={category.icon as CategoryIconKey} color={category.color as CategoryColor} />
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onDelete} aria-label="Excluir">
            <Trash2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onEdit} aria-label="Editar">
            <Pencil className="size-4" />
          </Button>
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-800">{category.title}</h3>
        {category.description && <p className="text-sm text-gray-500">{category.description}</p>}
      </div>
      <div className="mt-auto flex items-center justify-between text-sm">
        <CategoryTag color={category.color as CategoryColor} label={category.title} />
        <span className="text-gray-500">{category.transactionsCount} {category.transactionsCount === 1 ? 'item' : 'itens'}</span>
      </div>
    </div>
  );
}
