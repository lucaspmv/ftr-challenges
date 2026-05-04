import { useQuery } from '@apollo/client/react';
import { Navigate } from 'react-router-dom';
import { ME } from '@/graphql/auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data, loading, error } = useQuery(ME, { fetchPolicy: 'cache-first' });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        Carregando…
      </div>
    );
  }
  if (error || !data?.me) return <Navigate to="/" replace />;
  return <>{children}</>;
}
