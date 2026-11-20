import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAI } from '../context/AIContext.jsx'
import TypingIndicator from './TypingIndicator.jsx'

export default function AIResponse() {
  const {
    response,
    isLoading: loading,
    error,
    fallbackMessage,
    retryStatus,
    retryAI,
    canRetry,
  } = useAI()
  const hasResponse =
    typeof response === 'string' && response.trim().length > 0

  return (
    <section
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
      aria-live="polite"
    >
      <h2 className="mb-3 text-left text-lg font-semibold text-slate-900">
        AI Response
      </h2>

      {fallbackMessage ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-900" role="alert">
            {fallbackMessage}
          </p>
          {error && (
            <details className="mt-2 text-sm text-amber-800">
              <summary className="cursor-pointer">Error details</summary>
              <p className="mt-1">{error}</p>
            </details>
          )}
          {canRetry && (
            <button
              type="button"
              onClick={retryAI}
              disabled={loading}
              className="mt-3 rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Retry
            </button>
          )}
        </div>
      ) : error ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
          <button
            type="button"
            onClick={retryAI}
            disabled={loading}
            className="rounded-lg border border-red-300 px-3 py-1.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Retry
          </button>
        </div>
      ) : null}

      {loading ? (
        <div
          className="flex items-center justify-center gap-3 rounded-xl bg-violet-50 px-4 py-6 text-sm text-violet-700"
          role="status"
        >
          <TypingIndicator />
          <span>{retryStatus || 'AI is thinking...'}</span>
        </div>
      ) : fallbackMessage ? null : hasResponse ? (
        <div className="text-left leading-relaxed text-slate-700">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mb-4 mt-6 text-2xl font-bold text-slate-900 first:mt-0">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="mb-3 mt-6 text-xl font-semibold text-slate-900 first:mt-0">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="mb-2 mt-5 text-lg font-semibold text-slate-900">
                  {children}
                </h3>
              ),
              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
              ul: ({ children }) => (
                <ul className="mb-4 list-disc space-y-1 pl-6">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 list-decimal space-y-1 pl-6">
                  {children}
                </ol>
              ),
              li: ({ children }) => <li className="pl-1">{children}</li>,
              pre: ({ children }) => (
                <pre className="my-4 overflow-x-auto rounded-xl bg-slate-100 p-4 text-sm text-slate-800">
                  {children}
                </pre>
              ),
              code: ({ children }) => (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-violet-800">
                  {children}
                </code>
              ),
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-slate-100">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-slate-300 px-3 py-2 font-semibold text-slate-900">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-slate-300 px-3 py-2">
                  {children}
                </td>
              ),
            }}
          >
            {response.trim()}
          </ReactMarkdown>
          <p className="mt-4 text-xs leading-relaxed text-slate-400">
            AI-generated content may contain inaccuracies.
            <br />
            Please verify important information.
          </p>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-50 px-4 py-6 text-center text-slate-500">
          <p>Ask the AI a question to get started.</p>
        </div>
      )}
    </section>
  )
}