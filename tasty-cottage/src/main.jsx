import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/Routes';
import { HelmetProvider } from 'react-helmet-async';
import Authprovider from './providers/Authprovider';
import ThemeProvider from './providers/ThemeProvider';
import {
  QueryClient,
  QueryClientProvider,

} from '@tanstack/react-query'

const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Authprovider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <div className='max-w-screen-xl mx-auto'>
              <RouterProvider router={router} />
            </div>
          </HelmetProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </Authprovider>
  </StrictMode>,
)
