import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster, toast, ToastBar } from 'react-hot-toast'
import AuthProvider from './providers/AuthProvider'
import { router } from './routes/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1D3557',
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 18px',
            },
          }}
        >
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== 'loading' && (
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="ml-4 p-1 opacity-60 hover:opacity-100 hover:bg-white/20 rounded-full transition-all"
                      aria-label="Close toast"
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="13" y1="1" x2="1" y2="13" />
                        <line x1="1" y1="1" x2="13" y2="13" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
