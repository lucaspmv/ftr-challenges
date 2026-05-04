import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, UserRound, UserRoundPlus, LogIn, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { SIGN_UP, ME } from '@/graphql/auth';
import { signUpSchema, type SignUpForm } from '@/lib/validation';

export default function Signup() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [signUp, { loading }] = useMutation(SIGN_UP, {
    refetchQueries: [{ query: ME }],
    awaitRefetchQueries: true,
  });
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (values: SignUpForm) => {
    try {
      await signUp({ variables: { input: values } });
      navigate('/dashboard');
    } catch (e: any) {
      toast.error(e.message ?? 'Não foi possível criar a conta');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <Logo />
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">Criar conta</h1>
          <p className="text-sm text-gray-500">Comece a controlar suas finanças ainda hoje</p>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
              <Input id="email" type="email" placeholder="mail@exemplo.com" className="pl-9" {...register('email')} />
            </div>
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <Input id="password" type={showPwd ? 'text' : 'password'} placeholder="Digite sua senha" className="pl-9 pr-10" {...register('password')} />
              <button type="button" onClick={() => setShowPwd((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400">A senha deve ter no mínimo 8 caracteres</p>
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-brand-base hover:bg-brand-dark">
            <UserRoundPlus className="size-4" /> Cadastrar
          </Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" /> ou <div className="h-px flex-1 bg-gray-200" />
        </div>
        <p className="text-center text-sm text-gray-600">
          Já tem uma conta?{' '}
          <Link to="/" className="inline-flex items-center gap-1 font-medium text-brand-base">
            <LogIn className="size-4" /> Fazer login <ChevronRight className="size-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}
