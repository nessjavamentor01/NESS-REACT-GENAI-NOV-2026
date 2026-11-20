export default function Header({ onNewChat }) {
  return (
    <header className="w-full border-b border-slate-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-200 sm:h-14 sm:w-14"
          aria-hidden="true"
        >
          <svg
            className="h-7 w-7 sm:h-8 sm:w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3a3 3 0 0 0-3 3v1H7a3 3 0 0 0-3 3v1H3a2 2 0 0 0 0 4h1v1a3 3 0 0 0 3 3h2v1a3 3 0 0 0 6 0v-1h2a3 3 0 0 0 3-3v-1h1a2 2 0 0 0 0-4h-1v-1a3 3 0 0 0-3-3h-2V6a3 3 0 0 0-3-3Z" />
            <path d="M9 10.5h.01M15 10.5h.01M9 15h6" />
          </svg>
        </div>

        <div className="min-w-0 text-left">
          <h1 className="truncate text-xl font-bold text-slate-900 sm:text-2xl lg:text-3xl">
            AI Learning Assistant
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            Learn smarter with personalized AI guidance
          </p>
        </div>

        <button
          type="button"
          onClick={onNewChat}
          className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 sm:px-4 sm:py-2.5"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          <span>New Chat</span>
        </button>
      </div>
    </header>
  )
}