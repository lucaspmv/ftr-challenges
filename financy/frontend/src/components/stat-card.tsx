import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StatCard({
  icon: Icon, label, value, accent, className,
}: {
  icon: LucideIcon; label: string; value: React.ReactNode;
  accent?: 'success' | 'danger' | 'brand';
  className?: string;
}) {
  const accentClass = accent === 'success' ? 'text-success'
    : accent === 'danger' ? 'text-danger'
    : 'text-brand-base';
  return (
    <div className={cn('rounded-2xl bg-white p-6 shadow-sm', className)}>
      <div className="mb-2 flex items-center gap-2 text-xs text-gray-500">
        <Icon className={cn('size-4', accentClass)} />
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );
}
