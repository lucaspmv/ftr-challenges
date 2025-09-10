import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home } from './pages/home'
import { NotFound } from './pages/not-found'
import { Redirect } from './pages/redirect'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/:slug', element: <Redirect /> },
  { path: '/404', element: <NotFound /> },
  { path: '*', element: <NotFound /> },
])

export function App() {
  return <RouterProvider router={router} />
}
