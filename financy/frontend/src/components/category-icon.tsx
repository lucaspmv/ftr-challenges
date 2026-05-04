import { cn } from '@/lib/utils';
import { ICON_BG_CLASSES, type CategoryColor } from '@/lib/colors';
import { ICON_COMPONENTS, type CategoryIconKey } from '@/lib/icons';

export function CategoryIconBadge({
  icon, color, className,
}: { icon: CategoryIconKey; color: CategoryColor; className?: string }) {
  const Icon = ICON_COMPONENTS[icon];
  return (
    <span className={cn('inline-flex size-10 items-center justify-center rounded-lg', ICON_BG_CLASSES[color], className)}>
      <Icon className="size-5" />
    </span>
  );
}
