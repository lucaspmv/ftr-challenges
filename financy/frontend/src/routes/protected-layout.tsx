import { Outlet } from 'react-router-dom';
import { AuthGuard } from '@/components/auth-guard';

export default function ProtectedLayout() {
  return (
    <AuthGuard>
      <main className="min-h-screen bg-gray-100">
        <Outlet />
      </main>
    </AuthGuard>
  );
}
