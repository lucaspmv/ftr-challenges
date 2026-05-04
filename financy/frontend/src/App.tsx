import { ApolloProvider } from '@apollo/client/react';
import { RouterProvider } from 'react-router-dom';
import { client } from '@/lib/apollo';
import { router } from '@/routes/routes';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <ApolloProvider client={client}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </ApolloProvider>
  );
}
