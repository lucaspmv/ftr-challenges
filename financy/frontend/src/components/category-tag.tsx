import { cn } from '@/lib/utils';
import { TAG_CLASSES, type CategoryColor } from '@/lib/colors';

export function CategoryTag({
  color, label, className,
}: { color: CategoryColor; label: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium', TAG_CLASSES[color], className)}>
      {label}
    </span>
  );
}
