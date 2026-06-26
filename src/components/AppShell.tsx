import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'

interface NavItem {
  to: string
  icon: string
  label: string
  short: string
}

const NAV: NavItem[] = [
  { to: '/', icon: 'calendar_today', label: 'Today', short: 'Today' },
  { to: '/plan', icon: 'event_upcoming', label: 'Plan Tomorrow', short: 'Plan' },
  { to: '/charts', icon: 'query_stats', label: 'Charts', short: 'Stats' },
  { to: '/weights', icon: 'balance', label: 'Category Weights', short: 'Weights' },
]

export function AppShell() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low py-8 px-6 z-40">
        <div className="mb-12">
          <h1 className="font-serif text-display-lg text-primary tracking-tight">Zenith</h1>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant/60">
            Personal Instrument
          </p>
        </div>
        <nav className="flex-1 space-y-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-body-md text-body-md">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={signOut}
          className="mt-auto flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-body-md text-body-md">Sign out</span>
        </button>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-3 md:hidden bg-surface-container shadow-lg">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-4 py-1 rounded-full transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-on-surface-variant'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-label-sm text-label-sm">{item.short}</span>
          </NavLink>
        ))}
      </nav>

      {/* Main canvas */}
      <main className="md:ml-64 p-container-padding-mobile md:p-container-padding-desktop mb-24 md:mb-0 max-w-[1280px]">
        <Outlet />
      </main>
    </div>
  )
}
