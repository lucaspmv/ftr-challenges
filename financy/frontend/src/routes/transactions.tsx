import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useApolloClient } from '@apollo/client/react';
import {
  Plus, Search, ArrowDownCircle, ArrowUpCircle, Pencil, Trash2,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionDialog } from '@/components/transaction-dialog';
import { CategoryIconBadge } from '@/components/category-icon';
import { CategoryTag } from '@/components/category-tag';
import { EmptyState } from '@/components/empty-state';
import { TRANSACTIONS, DELETE_TRANSACTION } from '@/graphql/transactions';
import { CATEGORIES } from '@/graphql/categories';
import { formatDateShort, formatSignedBRL } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CategoryColor } from '@/lib/colors';
import type { CategoryIconKey } from '@/lib/icons';

const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const PAGE_SIZE = 10;

export default function Transactions() {
  const periods = useMemo(() => {
    const now = new Date();
    const list: { key: string; label: string; month: number; year: number }[] = [];
    for (let i = 0; i < 24; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      list.push({
        key: `${d.getFullYear()}-${d.getMonth() + 1}`,
        label: `${monthNames[d.getMonth()]} / ${d.getFullYear()}`,
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      });
    }
    return list;
  }, []);

  const [period, setPeriod] = useState(periods[0].key);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'INCOME' | 'EXPENSE'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [page, setPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const sel = periods.find((p) => p.key === period)!;
  const { data, loading } = useQuery(TRANSACTIONS, {
    variables: { month: sel.month, year: sel.year },
  });
  const { data: catData } = useQuery(CATEGORIES);
  const client = useApolloClient();
  const [deleteTx] = useMutation(DELETE_TRANSACTION);

  const transactions = data?.transactions ?? [];
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (categoryFilter !== 'all' && t.category.id !== categoryFilter) return false;
      return true;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, categoryFilter, period]);

  const onConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await deleteTx({ variables: { id: confirmDeleteId } });
      await client.refetchQueries({ include: ['Transactions', 'Dashboard', 'Categories'] });
      toast.success('Transação removida');
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
          <h1 className="text-2xl font-bold text-gray-800">Transações</h1>
          <p className="text-sm text-gray-500">Gerencie todas as suas transações financeiras</p>
        </div>
        <Button onClick={() => { setEditing(null); setOpen(true); }} className="bg-brand-base hover:bg-brand-dark">
          <Plus className="size-4" /> Nova transação
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input id="search" placeholder="Buscar por descrição" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="INCOME">Entrada</SelectItem>
                <SelectItem value="EXPENSE">Saída</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="all">Todas</SelectItem>
                {catData?.categories?.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Período</Label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
              <SelectContent position="popper">
                {periods.map((p) => (
                  <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm">
        {loading ? null : filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma transação encontrada"
            description={transactions.length === 0 ? 'Adicione uma transação para começar.' : 'Tente ajustar os filtros acima.'}
          />
        ) : (
          <>
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_8rem] gap-4 border-b border-gray-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <span>Descrição</span>
              <span>Data</span>
              <span className="text-center">Categoria</span>
              <span className="text-center">Tipo</span>
              <span className="text-right">Valor</span>
              <span className="text-right">Ações</span>
            </div>
            {paged.map((t) => (
              <div key={t.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_8rem] items-center gap-4 border-b border-gray-100 px-5 py-3 last:border-b-0">
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIconBadge icon={t.category.icon as CategoryIconKey} color={t.category.color as CategoryColor} />
                  <span className="truncate font-medium text-gray-800">{t.description}</span>
                </div>
                <span className="text-sm text-gray-600">{formatDateShort(t.date)}</span>
                <span className="justify-self-center"><CategoryTag color={t.category.color as CategoryColor} label={t.category.title} /></span>
                <span className={cn('inline-flex items-center gap-1 text-sm font-medium justify-self-center', t.type === 'INCOME' ? 'text-success' : 'text-danger')}>
                  {t.type === 'INCOME' ? <ArrowUpCircle className="size-4" /> : <ArrowDownCircle className="size-4" />}
                  {t.type === 'INCOME' ? 'Entrada' : 'Saída'}
                </span>
                <span className={cn('text-right text-sm font-semibold whitespace-nowrap', t.type === 'INCOME' ? 'text-success' : 'text-danger')}>
                  {formatSignedBRL(t.amount, t.type)}
                </span>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="icon" className="border-danger/30 text-danger hover:bg-danger/5 hover:text-danger" onClick={() => setConfirmDeleteId(t.id)} aria-label="Excluir">
                    <Trash2 className="size-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => { setEditing(t); setOpen(true); }} aria-label="Editar">
                    <Pencil className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between gap-3 px-5 py-4 text-sm text-gray-500">
              <span>
                {rangeStart} a {rangeEnd} | {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} aria-label="Anterior">
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((n) => (
                  <Button
                    key={n}
                    size="icon"
                    variant={n === page ? 'default' : 'ghost'}
                    className={n === page ? 'bg-brand-base hover:bg-brand-dark' : ''}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Button>
                ))}
                <Button variant="ghost" size="icon" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} aria-label="Próximo">
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </>
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
