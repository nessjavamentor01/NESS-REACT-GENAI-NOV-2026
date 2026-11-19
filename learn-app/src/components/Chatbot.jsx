import { useState } from 'react'

const MODEL = 'gemini-2.5-flash'

function Chatbot({ onLogout }) {
  const [messages, setMessages] = useState([])
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const text = prompt.trim()
    if (!text || isLoading) return

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY
    if (!apiKey) {
      setError('Gemini is not configured. Add VITE_GEMINI_API_KEY to your .env file and restart the app.')
      return
    }

    const updatedMessages = [...messages, { role: 'user', text }]
    setMessages(updatedMessages)
    setPrompt('')
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: updatedMessages.map((message) => ({
              role: message.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: message.text }],
            })),
          }),
        },
      )
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error?.message || `Gemini request failed (${response.status}).`)
      }

      const answer = result.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim()

      if (!answer) {
        throw new Error('Gemini returned an empty response. Please try again.')
      }

      setMessages((current) => [...current, { role: 'assistant', text: answer }])
    } catch (requestError) {
      setError(requestError.message || 'Could not reach Gemini. Check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-500/15 text-lg text-violet-300">✦</span>
          <div>
            <h1 className="text-base font-semibold text-white">Gemini Chat</h1>
            <p className="text-xs text-slate-400">Ask anything, explore ideas</p>
          </div>
        </div>
        <button
          className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 transition hover:border-slate-500 hover:text-white"
          onClick={onLogout}
          type="button"
        >
          Sign out
        </button>
      </header>

      <section aria-label="Chat messages" aria-live="polite" className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 overflow-y-auto px-4 py-8 sm:px-6">
        {messages.length === 0 && (
          <div className="my-auto py-12 text-center">
            <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl bg-violet-500/15 text-2xl text-violet-300">✦</span>
            <h2 className="text-2xl font-semibold text-white">What can I help with?</h2>
            <p className="mt-2 text-sm text-slate-400">Send a message to start chatting with Gemini.</p>
          </div>
        )}
        {messages.map((message, index) => (
          <article
            className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[80%] ${
              message.role === 'user'
                ? 'ml-auto bg-violet-600 text-white'
                : 'mr-auto border border-white/10 bg-slate-900 text-slate-200'
            }`}
            key={`${message.role}-${index}`}
          >
            {message.text}
          </article>
        ))}
        {isLoading && (
          <p aria-label="Gemini is responding" className="mr-auto rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-slate-400">
            Gemini is thinking…
          </p>
        )}
        {error && (
          <p aria-live="assertive" className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </p>
        )}
      </section>

      <form className="mx-auto w-full max-w-3xl px-4 pb-6 sm:px-6" onSubmit={handleSubmit}>
        <div className="flex items-end gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-3 focus-within:border-violet-400">
          <textarea
            aria-label="Message Gemini"
            className="max-h-40 min-h-11 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-slate-500"
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
        <p className="mt-2 text-center text-xs text-slate-500">Gemini can make mistakes. Check important information.</p>
      </form>
    </main>
  )
}

export default Chatbot