import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { generateContent } from '../services/axiosService'

const modelName = import.meta.env.VITE_GEMINI_MODEL || 'Model not configured'
const markdownComponents = {
  h1: ({ children }) => <h1 className="mb-3 mt-4 text-xl font-semibold text-white">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 mt-4 text-lg font-semibold text-white">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 mt-3 text-base font-semibold text-white">{children}</h3>,
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-7">{children}</p>,
  ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1">{children}</ol>,
  li: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-3 border-l-2 border-violet-400 pl-4 text-slate-400">{children}</blockquote>
  ),
  a: ({ children, href }) => (
    <a className="text-violet-300 underline underline-offset-2 hover:text-violet-200" href={href}>
      {children}
    </a>
  ),
  pre: ({ children }) => (
    <pre className="my-3 overflow-x-auto rounded-lg bg-black/30 p-3 text-xs leading-5 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.9em] text-violet-200">
      {children}
    </code>
  ),
}

function AxiosChatBox() {
  const [messages, setMessages] = useState([])
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  async function handleSubmit(event) {
    event.preventDefault()
    const text = prompt.trim()
    if (!text || isLoading) return

    if (!import.meta.env.VITE_GEMINI_API_KEY || !import.meta.env.VITE_GEMINI_MODEL) {
      setError('Gemini is not configured. Add VITE_GEMINI_API_KEY and VITE_GEMINI_MODEL to your .env file.')
      return
    }

    setMessages((current) => [...current, { role: 'user', text }])
    setPrompt('')
    setError('')
    setIsLoading(true)

    try {
      const answer = await generateContent(text)
      if (!answer?.trim()) {
        throw new Error('Gemini returned an empty response. Please try again.')
      }
      setMessages((current) => [...current, { role: 'assistant', text: answer.trim() }])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not reach Gemini. Check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function startNewChat() {
    if (isLoading) return
    setMessages([])
    setPrompt('')
    setError('')
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
              ✦
            </span>
            <div>
              <h1 className="font-semibold text-white">Gemini Chat</h1>
              <p className="text-xs text-slate-400">Model: {modelName}</p>
            </div>
          </div>
          <button
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-violet-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading}
            onClick={startNewChat}
            type="button"
          >
            + New chat
          </button>
        </div>
      </header>

      <section
        aria-label="Chat messages"
        aria-live="polite"
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 overflow-y-auto px-4 py-8 sm:px-6"
      >
        {messages.length === 0 && (
          <div className="my-auto py-12 text-center">
            <span aria-hidden="true" className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-violet-500/15 text-2xl text-violet-300">
              ✦
            </span>
            <h2 className="text-2xl font-semibold text-white sm:text-3xl">What can I help with?</h2>
            <p className="mt-3 text-sm text-slate-400">Ask a question to start a conversation with Gemini.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <article
            className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[80%] ${
              message.role === 'user'
                ? 'ml-auto whitespace-pre-wrap rounded-br-md bg-violet-600 text-white'
                : 'mr-auto whitespace-normal rounded-bl-md border border-white/10 bg-slate-900 text-slate-200'
            }`}
            key={`${message.role}-${index}`}
          >
            {message.role === 'assistant'
              ? <ReactMarkdown components={markdownComponents}>{message.text}</ReactMarkdown>
              : message.text}
          </article>
        ))}

        {isLoading && (
          <p aria-label="Gemini is responding" className="mr-auto rounded-2xl rounded-bl-md border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-400">
            Gemini is thinking…
          </p>
        )}
        {error && (
          <p aria-live="assertive" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}
        <div ref={messagesEndRef} />
      </section>

      <footer className="sticky bottom-0 border-t border-white/5 bg-slate-950/95 px-4 py-4 backdrop-blur sm:px-6">
        <form className="mx-auto w-full max-w-3xl" onSubmit={handleSubmit}>
          <div className="flex items-end gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-3 transition focus-within:border-violet-400">
            <textarea
              aria-label="Message Gemini"
              className="max-h-40 min-h-11 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
              disabled={isLoading}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder="Message Gemini…"
              value={prompt}
            />
            <button
              className="rounded-xl bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || !prompt.trim()}
              type="submit"
            >
              Send
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">Enter to send · Shift + Enter for a new line</p>
        </form>
      </footer>
    </main>
  )
}

export default AxiosChatBox
