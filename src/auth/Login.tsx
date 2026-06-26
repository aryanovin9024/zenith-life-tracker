import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type Mode = 'signin' | 'signup'

export function Login() {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    const { error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else if (mode === 'signup') {
      setNotice('Account created. If email confirmation is enabled, confirm it, then sign in.')
      setMode('signin')
    }
    setBusy(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-12 text-center">
          <h1 className="font-serif text-display-lg text-primary">Zenith</h1>
          <p className="font-label-sm text-label-sm uppercase tracking-[0.3em] text-on-surface-variant/60">
            Personal Instrument
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-surface-container rounded-2xl ink-border midnight-blur p-8 flex flex-col gap-8"
        >
          <h2 className="font-serif text-headline-md italic text-on-surface">
            {mode === 'signin' ? 'Welcome back.' : 'Begin your record.'}
          </h2>

          <label className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="underline-input font-body-lg"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">
              Password
            </span>
            <input
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="underline-input font-body-lg"
              placeholder="••••••••"
            />
          </label>

          {error && <p className="text-sm text-error">{error}</p>}
          {notice && <p className="text-sm text-on-secondary-container">{notice}</p>}

          <button
            type="submit"
            disabled={busy}
            className="mt-2 py-4 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm uppercase tracking-widest hover:brightness-110 transition-sink disabled:opacity-50"
          >
            {busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin')
              setError(null)
              setNotice(null)
            }}
            className="text-xs text-on-surface-variant/70 hover:text-on-surface transition-colors"
          >
            {mode === 'signin'
              ? "No account yet? Create one."
              : 'Already have an account? Sign in.'}
          </button>
        </form>
      </div>
    </div>
  )
}
