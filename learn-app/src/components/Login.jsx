import { useState } from 'react'
import { useNavigate } from 'react-router'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()

    if (username.trim() !== 'admin' || password !== 'admin123') {
      setError('That username or password is not correct.')
      return
    }

    setError('')
    onLogin()
    navigate('/chatbot')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-black/30 md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-10 md:flex">
          <div className="flex items-center gap-3 text-sm font-semibold tracking-wide text-white">
            <span className="grid size-10 place-items-center rounded-xl bg-white/15 text-lg">✦</span>
            GEMINI CHAT
          </div>
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-indigo-100">Your AI workspace</p>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white">Ideas become conversations.</h1>
            <p className="mt-4 max-w-sm text-base leading-7 text-indigo-100">
              Sign in to explore, ask questions, and create with your AI assistant.
            </p>
          </div>
          <p className="text-sm text-indigo-100/80">Powered by Gemini</p>
        </section>

        <section className="p-7 sm:p-10">
          <div className="mb-8 md:hidden">
            <p className="text-sm font-semibold tracking-wide text-violet-300">✦ GEMINI CHAT</p>
          </div>
          <p className="text-sm font-medium text-violet-300">Welcome back</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Sign in to continue</h2>
          <p className="mt-2 text-sm text-slate-400">Enter your credentials to open your chat workspace.</p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-200">Username</label>
              <input
                autoComplete="username"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                id="username"
                name="username"
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                required
                value={username}
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-200">Password</label>
              <input
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                id="password"
                name="password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />
            </div>
            {error && (
              <p aria-live="polite" className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-300">
                {error}
              </p>
            )}
            <button
              className="w-full rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              type="submit"
            >
              Sign in
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-slate-500">Demo credentials: admin / admin123</p>
        </section>
      </div>
    </main>
  )
}

export default Login