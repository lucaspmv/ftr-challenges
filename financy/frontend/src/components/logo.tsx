export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span className="relative inline-block">
        <span className="inline-block h-6 w-6 rounded-full bg-brand-base" />
        <span className="absolute -right-2 top-0 inline-block h-6 w-6 rounded-full bg-brand-dark" />
      </span>
      <span className="ml-2 text-xl font-extrabold tracking-tight text-brand-dark uppercase">
        Financy
      </span>
    </div>
  );
}
