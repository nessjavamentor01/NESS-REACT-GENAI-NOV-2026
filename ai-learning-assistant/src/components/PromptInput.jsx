import PromptTemplates from './PromptTemplates.jsx'
import { useAI } from '../context/AIContext.jsx'
import {
  getPromptValidationMessage,
  MAX_PROMPT_LENGTH,
} from '../utils/promptValidation.js'

export default function PromptInput() {
  const {
    prompt,
    setPrompt,
    category,
    setCategory,
    askAI,
    isLoading: loading,
    clearChat,
  } = useAI()
  const validationMessage = getPromptValidationMessage(prompt)
  const characterCount = prompt.trim().length

  const handleSubmit = (event) => {
    event.preventDefault()
    if (loading || validationMessage) {
      return
    }
    askAI()
  }

  const handleClear = () => {
    setCategory('General')
    clearChat()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-5">
        <label
          htmlFor="technology"
          className="mb-2 block text-left text-sm font-semibold text-slate-700"
        >
          Technology
        </label>
        <select
          id="technology"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        >
          <option value="General">General</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="JavaScript">JavaScript</option>
          <option value="React">React</option>
          <option value="Node.js">Node.js</option>
          <option value="Python">Python</option>
        </select>
      </div>

      <div className="mb-5">
        <PromptTemplates onSelect={setPrompt} />
      </div>

      <div className="mb-5">
        <label
          htmlFor="prompt"
          className="mb-2 block text-left text-sm font-semibold text-slate-700"
        >
          Ask a question
        </label>
        <textarea
          id="prompt"
          rows="5"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          aria-invalid={Boolean(validationMessage)}
          aria-describedby="prompt-validation prompt-character-count"
          placeholder="What would you like to learn?"
          className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
        />
        <div className="mt-2 flex flex-col justify-between gap-1 text-sm sm:flex-row">
          <p
            id="prompt-validation"
            className={validationMessage ? 'text-rose-600' : 'text-emerald-700'}
            role={validationMessage ? 'alert' : undefined}
          >
            {validationMessage || 'Prompt is valid.'}
          </p>
          <p id="prompt-character-count" className="text-right text-slate-500">
            {characterCount}/{MAX_PROMPT_LENGTH} characters
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={loading || Boolean(validationMessage)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200 border-t-white"
              aria-hidden="true"
            />
          )}
          {loading ? 'Generating...' : 'Ask AI'}
        </button>
      </div>
    </form>
  )
}