import { Outlet } from 'react-router-dom';
import { AuthGuard } from '@/components/auth-guard';
import { Navbar } from '@/components/navbar';

export default function ProtectedLayout() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="mx-auto max-w-6xl p-6">
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
}
