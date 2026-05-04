import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client/react';
import { ME, SIGN_OUT } from '@/graphql/auth';
import { Logo } from './logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const tabs = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/transacoes', label: 'Transações' },
  { to: '/categorias', label: 'Categorias' },
];

export function Navbar() {
  const navigate = useNavigate();
  const { data } = useQuery(ME);
  const [signOut] = useMutation(SIGN_OUT, {
    onCompleted: () => {
      navigate('/');
    },
    update: (cache) => {
      cache.evict({ fieldName: 'me' });
      cache.gc();
    },
  });

  const initials = data?.me?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() ?? '';

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="flex gap-6 text-sm text-gray-500">
            {tabs.map((t) => (
              <NavLink
                key={t.to} to={t.to}
                className={({ isActive }) => cn('transition-colors', isActive ? 'font-semibold text-gray-800' : 'hover:text-gray-700')}
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <NavLink to="/perfil" className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
            {initials || 'U'}
          </NavLink>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
