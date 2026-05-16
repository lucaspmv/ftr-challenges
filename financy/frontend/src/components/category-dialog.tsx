import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CATEGORY_ICONS, ICON_COMPONENTS, type CategoryIconKey } from '@/lib/icons';
import { CATEGORY_COLORS, SWATCH_CLASSES, RING_CLASSES, type CategoryColor } from '@/lib/colors';
import { categorySchema, type CategoryForm } from '@/lib/validation';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/graphql/categories';

type CategoryRow = {
  id: string; title: string; description?: string | null;
  icon: string; color: string;
};

export function CategoryDialog({
  open, onOpenChange, category,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  category?: CategoryRow | null;
}) {
  const isEdit = !!category;
  const [createCategory] = useMutation(CREATE_CATEGORY, { refetchQueries: ['Categories', 'Dashboard'] });
  const [updateCategory] = useMutation(UPDATE_CATEGORY, { refetchQueries: ['Categories', 'Dashboard'] });

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { title: '', description: '', icon: 'utensils', color: 'green' },
  });

  useEffect(() => {
    if (category) {
      reset({
        title: category.title,
        description: category.description ?? '',
        icon: category.icon as CategoryIconKey,
        color: category.color as CategoryColor,
      });
    } else {
      reset({ title: '', description: '', icon: 'utensils', color: 'green' });
    }
  }, [category, reset, open]);

  const onSubmit = async (values: CategoryForm) => {
    try {
      const input = {
        title: values.title,
        description: values.description || null,
        icon: values.icon,
        color: values.color,
      };
      if (isEdit) {
        await updateCategory({ variables: { id: category!.id, input } });
        toast.success('Categoria atualizada');
      } else {
        await createCategory({ variables: { input } });
        toast.success('Categoria criada');
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
          <DialogTitle>{isEdit ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>Organize suas transações com categorias</DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="title">Título</Label>
            <Input id="title" placeholder="Ex. Alimentação" {...register('title')} />
            {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" placeholder="Descrição da categoria" {...register('description')} />
            <p className="text-xs text-gray-400">Opcional</p>
          </div>
          <div className="space-y-1.5">
            <Label>Ícone</Label>
            <Controller
              control={control}
              name="icon"
              render={({ field }) => (
                <div className="grid grid-cols-8 gap-2">
                  {CATEGORY_ICONS.map((key) => {
                    const Icon = ICON_COMPONENTS[key];
                    const selected = field.value === key;
                    return (
                      <button type="button" key={key} onClick={() => field.onChange(key)}
                        className={cn(
                          'flex size-10 items-center justify-center rounded-md border text-gray-500 transition',
                          selected
                            ? 'border-brand-base bg-brand-base/10 text-brand-base'
                            : 'border-gray-200 hover:border-gray-300',
                        )}
                      >
                        <Icon className="size-5" />
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Cor</Label>
            <Controller
              control={control}
              name="color"
              render={({ field }) => (
                <div className="flex gap-3">
                  {CATEGORY_COLORS.map((c) => {
                    const selected = field.value === c;
                    return (
                      <button type="button" key={c} onClick={() => field.onChange(c)}
                        className={cn(
                          'size-9 rounded-full transition',
                          SWATCH_CLASSES[c],
                          selected && cn('ring-2 ring-offset-2 ring-offset-white', RING_CLASSES[c]),
                        )}
                        aria-label={c}
                      />
                    );
                  })}
                </div>
              )}
            />
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
