import { createBrowserRouter } from 'react-router-dom';
import AuthLayout from './auth-layout';
import ProtectedLayout from './protected-layout';
import Home from './home';

const Dashboard = () => <div className="p-6">Dashboard (TBD)</div>;
const Transactions = () => <div className="p-6">Transações (TBD)</div>;
const Categories = () => <div className="p-6">Categorias (TBD)</div>;
const Profile = () => <div className="p-6">Perfil (TBD)</div>;
const Signup = () => <div className="p-6">Cadastro (TBD)</div>;

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
