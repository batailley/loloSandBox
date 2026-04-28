import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { HelloWorldPage } from './features/helloworld/HelloWorldPage';
import { HostLayout } from './layout/HostLayout';
import { HomePage } from './pages/HomePage';
import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HostLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'features/hello-world', element: <HelloWorldPage /> },
    ],
  },
]);

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Élément #root introuvable');

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
