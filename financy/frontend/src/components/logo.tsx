import logoUrl from '@/assets/logo.svg';

export function Logo({ className }: { className?: string }) {
  return <img src={logoUrl} alt="Financy" className={className ?? 'h-7 w-auto'} />;
}
