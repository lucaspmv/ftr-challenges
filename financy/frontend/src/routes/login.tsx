import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, UserRoundPlus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/logo';
import { SIGN_IN, ME } from '@/graphql/auth';
import { signInSchema, type SignInForm } from '@/lib/validation';

export default function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [signIn, { loading }] = useMutation(SIGN_IN, {
    refetchQueries: [{ query: ME }],
    awaitRefetchQueries: true,
  });
  const {
    register, handleSubmit, formState: { errors },
  } = useForm<SignInForm>({ resolver: zodResolver(signInSchema) });

  const onSubmit = async (values: SignInForm) => {
    try {
      await signIn({ variables: { input: values } });
      navigate('/dashboard');
    } catch (e: any) {
      toast.error(e.message ?? 'Não foi possível entrar');
    }
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="flex justify-center">
        <Logo />
      </div>
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <header className="mb-6 text-center">
          <h1 className="text-xl font-bold text-gray-800">Fazer login</h1>
          <p className="text-sm text-gray-500">Entre na sua conta para continuar</p>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <Checkbox {...register('rememberMe')} />
              Lembrar-me
            </label>
            <span className="text-gray-400">Recuperar senha</span>
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-brand-base hover:bg-brand-dark">
            Entrar
          </Button>
        </form>
        <div className="my-6 flex items-center gap-3 text-xs text-gray-400">
          <div className="h-px flex-1 bg-gray-200" /> ou <div className="h-px flex-1 bg-gray-200" />
        </div>
        <p className="text-center text-sm text-gray-600 mb-3">Ainda não tem uma conta?</p>
        <Button variant="outline" asChild className="w-full">
          <Link to="/cadastro">
            <UserRoundPlus className="size-4" /> Criar conta
          </Link>
        </Button>
      </div>
    </div>
  );
}
