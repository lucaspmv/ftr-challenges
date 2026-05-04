import { useMutation, useQuery, useApolloClient } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ME, SIGN_OUT } from '@/graphql/auth';
import { formatDateLong } from '@/lib/format';

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

  if (loading || !data?.me) return null;

  return (
    <div className="mx-auto max-w-md space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Perfil</h1>
        <p className="text-sm text-gray-500">Suas informações</p>
      </header>
      <div className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs uppercase text-gray-400">Nome</p>
          <p className="font-medium text-gray-800">{data.me.name}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400">E-mail</p>
          <p className="font-medium text-gray-800">{data.me.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-400">Membro desde</p>
          <p className="font-medium text-gray-800">{formatDateLong(data.me.createdAt)}</p>
        </div>
      </div>
      <Button variant="outline" onClick={() => signOut()} className="w-full">
        <LogOut className="size-4" /> Sair
      </Button>
    </div>
  );
}
