export function EmptyState({ title, description, action }: {
  title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-10 text-center text-gray-500">
      <p className="font-medium text-gray-700">{title}</p>
      {description && <p className="text-sm">{description}</p>}
      {action}
    </div>
  );
}
