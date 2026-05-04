import { useState, useMemo } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionDialog } from '@/components/transaction-dialog';
import { TransactionRow } from '@/components/transaction-row';
import { EmptyState } from '@/components/empty-state';
import { TRANSACTIONS, DELETE_TRANSACTION } from '@/graphql/transactions';

const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

export default function Transactions() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const { data, loading } = useQuery(TRANSACTIONS, { variables: { month, year } });
  const [deleteTx] = useMutation(DELETE_TRANSACTION, {
    refetchQueries: ['Transactions', 'Dashboard', 'Categories'],
  });

  const years = useMemo(() => {
    const y = today.getFullYear();
    return [y - 2, y - 1, y, y + 1];
  }, []);

  const onConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteTx({ variables: { id: confirmDeleteId } });
      toast.success('Transação removida');
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao remover');
    } finally {
      setConfirmDeleteId(null);
    }
  };

  const transactions = data?.transactions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-sm text-gray-500">Acompanhe suas movimentações por período</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
            <SelectContent>
              {monthNames.map((n, i) => <SelectItem key={i} value={String(i + 1)}>{n}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
            <SelectContent>
              {years.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-brand-base hover:bg-brand-dark">
            <Plus className="size-4" /> Nova transação
          </Button>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm">
        {loading ? null : transactions.length === 0 ? (
          <EmptyState title="Sem transações neste mês" description="Adicione uma transação para começar." />
        ) : (
          transactions.map((t) => (
            <TransactionRow
              key={t.id}
              transaction={t}
              onEdit={() => { setEditing(t); setOpen(true); }}
              onDelete={() => setConfirmDeleteId(t.id)}
            />
          ))
        )}
      </div>

      <TransactionDialog open={open} onOpenChange={setOpen} transaction={editing} />

      <AlertDialog open={!!confirmDeleteId} onOpenChange={(v) => !v && setConfirmDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir transação?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
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
