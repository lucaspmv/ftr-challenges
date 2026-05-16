import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useApolloClient } from '@apollo/client/react';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { transactionSchema, type TransactionForm } from '@/lib/validation';
import { formatBRL } from '@/lib/format';
import { CATEGORIES } from '@/graphql/categories';
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/graphql/transactions';

type TransactionRow = {
  id: string; description: string; amount: number;
  type: 'INCOME' | 'EXPENSE'; date: string;
  category: { id: string };
};

export function TransactionDialog({
  open, onOpenChange, transaction,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  transaction?: TransactionRow | null;
}) {
  const isEdit = !!transaction;
  const client = useApolloClient();
  const { data: catData } = useQuery(CATEGORIES, { skip: !open });
  const evictTxRelated = (cache: any) => {
    cache.evict({ fieldName: 'dashboard' });
    cache.evict({ fieldName: 'transactions' });
    cache.evict({ fieldName: 'categories' });
    cache.gc();
  };
  const [createTx] = useMutation(CREATE_TRANSACTION, { update: evictTxRelated });
  const [updateTx] = useMutation(UPDATE_TRANSACTION, { update: evictTxRelated });

  const { register, handleSubmit, control, reset, watch, formState: { errors, isSubmitting } } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '', amount: 0, type: 'EXPENSE',
      date: new Date().toISOString().slice(0, 10),
      categoryId: '',
    },
  });

  useEffect(() => {
    if (transaction) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        date: transaction.date.slice(0, 10),
        categoryId: transaction.category.id,
      });
    } else {
      reset({
        description: '', amount: 0, type: 'EXPENSE',
        date: new Date().toISOString().slice(0, 10),
        categoryId: '',
      });
    }
  }, [transaction, reset, open]);

  const type = watch('type');

  const onSubmit = async (values: TransactionForm) => {
    try {
      const input = { ...values, date: new Date(values.date).toISOString() };
      if (isEdit) {
        await updateTx({ variables: { id: transaction!.id, input } });
      } else {
        await createTx({ variables: { input } });
      }
      await client.refetchQueries({ include: 'active' });
      toast.success(isEdit ? 'Transação atualizada' : 'Transação criada');
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao salvar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar transação' : 'Nova transação'}</DialogTitle>
          <DialogDescription>Registre sua despesa ou receita</DialogDescription>
        </DialogHeader>

        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => field.onChange('EXPENSE')}
                className={cn(
                  'flex h-12 items-center justify-center gap-2 rounded-md border bg-white text-sm font-medium transition',
                  type === 'EXPENSE'
                    ? 'border-danger text-danger'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300',
                )}>
                <ArrowDownCircle className="size-4" /> Despesa
              </button>
              <button type="button" onClick={() => field.onChange('INCOME')}
                className={cn(
                  'flex h-12 items-center justify-center gap-2 rounded-md border bg-white text-sm font-medium transition',
                  type === 'INCOME'
                    ? 'border-success text-success'
                    : 'border-gray-200 text-gray-400 hover:border-gray-300',
                )}>
                <ArrowUpCircle className="size-4" /> Receita
              </button>
            </div>
          )}
        />

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Ex. Almoço no restaurante" {...register('description')} />
            {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" {...register('date')} />
              {errors.date && <p className="text-xs text-danger">{errors.date.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Valor</Label>
              <Controller
                control={control}
                name="amount"
                render={({ field }) => (
                  <div className="relative">
                    <Wallet className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="amount"
                      type="text"
                      inputMode="numeric"
                      placeholder="R$ 0,00"
                      className="pl-9"
                      value={field.value > 0 ? formatBRL(field.value) : ''}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '');
                        field.onChange(digits ? Number(digits) / 100 : 0);
                      }}
                      onBlur={field.onBlur}
                    />
                  </div>
                )}
              />
              {errors.amount && <p className="text-xs text-danger">{errors.amount.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-[60]">
                    {(catData?.categories ?? []).length === 0 ? (
                      <SelectItem value="__none" disabled>
                        Nenhuma categoria — crie em "Categorias"
                      </SelectItem>
                    ) : (
                      catData!.categories!.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <p className="text-xs text-danger">{errors.categoryId.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-base hover:bg-brand-dark">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
