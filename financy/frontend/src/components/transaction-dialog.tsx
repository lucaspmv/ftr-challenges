import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@apollo/client/react';
import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { transactionSchema, type TransactionForm } from '@/lib/validation';
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
  const { data: catData } = useQuery(CATEGORIES, { skip: !open });
  const [createTx] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ['Transactions', 'Dashboard', 'Categories'],
  });
  const [updateTx] = useMutation(UPDATE_TRANSACTION, {
    refetchQueries: ['Transactions', 'Dashboard', 'Categories'],
  });

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
        toast.success('Transação atualizada');
      } else {
        await createTx({ variables: { input } });
        toast.success('Transação criada');
      }
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
            <div className="grid grid-cols-2 gap-2 rounded-md bg-gray-100 p-1">
              <button type="button" onClick={() => field.onChange('EXPENSE')}
                className={cn('flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                  type === 'EXPENSE' ? 'bg-white text-danger shadow-sm' : 'text-gray-500')}>
                <ArrowDownCircle className="size-4" /> Despesa
              </button>
              <button type="button" onClick={() => field.onChange('INCOME')}
                className={cn('flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition',
                  type === 'INCOME' ? 'bg-white text-success shadow-sm' : 'text-gray-500')}>
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
              <Input id="amount" type="number" step="0.01" placeholder="0,00" {...register('amount', { valueAsNumber: true })} />
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
                  <SelectContent position="popper">
                    {catData?.categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
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
