import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from './auth-layout';
import ProtectedLayout from './protected-layout';
import Home from './home';
import Signup from './signup';
import Categories from './categories';
import Transactions from './transactions';

const Dashboard = () => <div className="p-6">Dashboard (TBD)</div>;
const Profile = () => <div className="p-6">Perfil (TBD)</div>;

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/cadastro', element: <Signup /> },
    ],
  },
  {
    element: <ProtectedLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/transacoes', element: <Transactions /> },
      { path: '/categorias', element: <Categories /> },
      { path: '/perfil', element: <Profile /> },
    ],
  },
]);
