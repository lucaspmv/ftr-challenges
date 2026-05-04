import { createBrowserRouter } from 'react-router-dom';
import Home from './home';
import Login from './login';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
]);
