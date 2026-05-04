import { useQuery } from '@apollo/client/react';
import { Navigate } from 'react-router-dom';
import { ME } from '@/graphql/auth';
import Login from './login';

export default function Home() {
  const { data, loading } = useQuery(ME);
  if (loading) return null;
  if (data?.me) return <Navigate to="/dashboard" replace />;
  return <Login />;
}
