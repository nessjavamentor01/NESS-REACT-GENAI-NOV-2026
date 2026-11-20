const templates = [
  {
    title: 'Beginner Explanation',
    description: 'Learn a topic with simple language and examples.',
    prompt:
      'Explain [topic] for a beginner using simple language. Break it into clear steps and include a practical example.',
  },
  {
    title: 'Advanced Explanation',
    description: 'Explore deeper details, trade-offs, and best practices.',
    prompt:
      'Give me an advanced explanation of [topic]. Cover how it works, important trade-offs, common pitfalls, and relevant best practices.',
  },
  {
    title: 'Generate Code',
    description: 'Create a practical implementation with an explanation.',
    prompt:
      'Write code for [what you want to build] using [technology]. Explain the key parts and include any setup or usage instructions.',
  },
  {
    title: 'Explain Code',
    description: 'Understand what code does, how it runs, and how to improve it.',
    prompt:
      'Explain the following code. Describe what it does, explain each important statement, walk through the execution flow, identify possible errors, suggest improvements, and provide an example output:\n\n[Paste code here]',
  },
  {
    title: 'Debug Code',
    description: 'Find the cause of an issue and suggest a fix.',
    prompt:
      'Help me debug this [technology] code. Explain the cause of the issue, suggest a fix, and show the corrected code:\n\n[Paste code and describe the error here]',
  },
  {
    title: 'Interview Preparation',
    description: 'Practice interview questions with sample answers.',
    prompt:
      'Help me prepare for an interview about [topic or technology]. Provide questions from beginner to advanced with concise sample answers and explanations.',
  },
  {
    title: 'Project Guidance',
    description: 'Plan and build a project one step at a time.',
    prompt:
      'Guide me through building [project idea] using [technology]. Break the work into milestones, explain the key decisions, and suggest a practical project structure.',
  },
]

export default function PromptTemplates({ onSelect }) {
  return (
    <section className="w-full" aria-labelledby="prompt-templates-heading">
      <h2
        id="prompt-templates-heading"
        className="mb-3 text-left text-lg font-semibold text-slate-900"
      >
        Prompt templates
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {templates.map((template) => (
          <button
            key={template.title}
            type="button"
            onClick={() => onSelect(template.prompt)}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-violet-300 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
          >
            <span className="block font-semibold text-slate-900">
              {template.title}
            </span>
            <span className="mt-1 block text-sm text-slate-600">
              {template.description}
            </span>
            <span className="mt-3 block text-xs leading-relaxed text-slate-500">
              {template.prompt}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
