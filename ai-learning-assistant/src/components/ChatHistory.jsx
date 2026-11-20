import { useState } from 'react'
import { useChat } from '../hooks/useChat.js'

export default function ChatHistory() {
  const {
    history,
    selectedConversationId,
    selectConversation,
    clearHistory,
  } = useChat()
  const [searchTerm, setSearchTerm] = useState('')
  const normalizedSearchTerm = searchTerm.trim().toLowerCase()
  const filteredHistory = history.filter((conversation) =>
    conversation.question.toLowerCase().includes(normalizedSearchTerm),
  )

  return (
    <section className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-left text-lg font-semibold text-slate-900">
          Conversation History
        </h2>
        <button
          type="button"
          onClick={clearHistory}
          disabled={history.length === 0}
          className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear history
        </button>
      </div>

      <label
        htmlFor="conversation-search"
        className="mb-3 block text-left text-sm font-medium text-slate-700"
      >
        Search previous questions
      </label>
      <input
        id="conversation-search"
        type="search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="Search conversations..."
        className="mb-4 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
      />

      {filteredHistory.length > 0 ? (
        <ol className="space-y-3">
          {filteredHistory.map((conversation) => {
            const isSelected =
              conversation.id === selectedConversationId

            return (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => selectConversation(conversation)}
                  aria-pressed={isSelected}
                  className={`w-full rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                    isSelected
                      ? 'border-violet-300 bg-violet-50 ring-1 ring-violet-200'
                      : 'border-slate-200 bg-white hover:border-violet-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-medium text-slate-900">
                    {conversation.question}
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    {conversation.category} ·{' '}
                    {new Date(conversation.timestamp).toLocaleString()}
                  </span>
                  {isSelected && (
                    <span className="mt-2 inline-block text-xs font-medium text-violet-700">
                      Selected
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ol>
      ) : history.length === 0 && !normalizedSearchTerm ? (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          Your successful conversations will appear here.
        </p>
      ) : (
        <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No matching conversations
        </p>
      )}
    </section>
  )
}
