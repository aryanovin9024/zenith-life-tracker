import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { Login } from './auth/Login'
import { AppShell } from './components/AppShell'
import { Today } from './pages/Today'
import { PlanTomorrow } from './pages/PlanTomorrow'
import { Charts } from './pages/Charts'
import { CategoryWeights } from './pages/CategoryWeights'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, refetchOnWindowFocus: false, retry: 1 },
  },
})

function Splash({ children }: { children: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3">
      <h1 className="font-serif text-display-lg text-primary">Zenith</h1>
      <p className="text-sm text-on-surface-variant/60">{children}</p>
    </div>
  )
}

function Gate() {
  const { session, loading } = useAuth()

  if (loading) return <Splash>Tuning your instrument…</Splash>
  if (!session) return <Login />

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Today />} />
          <Route path="/plan" element={<PlanTomorrow />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/weights" element={<CategoryWeights />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Gate />
      </AuthProvider>
    </QueryClientProvider>
  )
}
