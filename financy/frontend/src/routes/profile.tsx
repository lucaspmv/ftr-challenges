import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useApolloClient } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ME, SIGN_OUT, UPDATE_USER } from '@/graphql/auth';

const profileSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
});
type ProfileForm = z.infer<typeof profileSchema>;

const initialsOf = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export default function Profile() {
  const navigate = useNavigate();
  const client = useApolloClient();
  const { data, loading } = useQuery(ME);
  const [signOut] = useMutation(SIGN_OUT, {
    onCompleted: async () => {
      await client.resetStore();
      navigate('/');
    },
  });
  const [updateUser, { loading: saving }] = useMutation(UPDATE_USER, {
    refetchQueries: ['Me'],
  });

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<ProfileForm>({
      resolver: zodResolver(profileSchema),
      defaultValues: { name: '' },
    });

  useEffect(() => {
    if (data?.me) reset({ name: data.me.name });
  }, [data?.me, reset]);

  if (loading || !data?.me) return null;

  const onSubmit = async (values: ProfileForm) => {
    try {
      await updateUser({ variables: { input: values } });
      toast.success('Perfil atualizado');
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao salvar');
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-3 pb-6">
          <div className="flex size-20 items-center justify-center rounded-full bg-gray-200 text-2xl font-semibold text-gray-700">
            {initialsOf(data.me.name)}
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800">{data.me.name}</h1>
            <p className="text-sm text-gray-500">{data.me.email}</p>
          </div>
        </div>

        <div className="-mx-8 border-t border-gray-100" />

        <form className="space-y-4 pt-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input id="name" placeholder="Seu nome completo" className="pl-9" {...register('name')} />
            </div>
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input id="email" type="email" disabled value={data.me.email} className="pl-9" />
            </div>
            <p className="text-xs text-gray-400">O e-mail não pode ser alterado</p>
          </div>

          <Button
            type="submit"
            disabled={saving || !isDirty}
            className="w-full bg-brand-base hover:bg-brand-dark"
          >
            Salvar alterações
          </Button>
        </form>

        <Button
          variant="outline"
          onClick={() => signOut()}
          className="mt-3 w-full border-danger text-danger hover:bg-danger/5 hover:text-danger"
        >
          <LogOut className="size-4" /> Sair da conta
        </Button>
      </div>
    </div>
  );
}
