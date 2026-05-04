import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus, Tag, ArrowUpDown, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CategoryDialog } from '@/components/category-dialog';
import { CategoryCard } from '@/components/category-card';
import { StatCard } from '@/components/stat-card';
import { EmptyState } from '@/components/empty-state';
import { CATEGORIES, DELETE_CATEGORY } from '@/graphql/categories';

export default function Categories() {
  const { data, loading } = useQuery(CATEGORIES);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    refetchQueries: ['Categories', 'Dashboard'],
  });

  const categories = data?.categories ?? [];
  const totalCategories = categories.length;
  const totalTransactions = categories.reduce((s, c) => s + c.transactionsCount, 0);
  const mostUsed = [...categories].sort((a, b) => b.transactionsCount - a.transactionsCount)[0];

  const onConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteCategory({ variables: { id: confirmDeleteId } });
      toast.success('Categoria removida');
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao remover');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categorias</h1>
          <p className="text-sm text-gray-500">Organize suas transações por categorias</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-brand-base hover:bg-brand-dark">
          <Plus className="size-4" /> Nova categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard icon={Tag} label="total de categorias" value={totalCategories} />
        <StatCard icon={ArrowUpDown} label="total de transações" value={totalTransactions} />
        <StatCard icon={Utensils} label="categoria mais utilizada" value={mostUsed?.title ?? '—'} />
      </div>

      {loading ? null : categories.length === 0 ? (
        <EmptyState title="Nenhuma categoria ainda" description="Crie sua primeira categoria pra começar a organizar." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              onEdit={() => { setEditing(c); setOpen(true); }}
              onDelete={() => setConfirmDeleteId(c.id)}
            />
          ))}
        </div>
      )}

      <CategoryDialog open={open} onOpenChange={setOpen} category={editing} />

      <AlertDialog open={!!confirmDeleteId} onOpenChange={(v) => !v && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Categorias com transações não podem ser excluídas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
