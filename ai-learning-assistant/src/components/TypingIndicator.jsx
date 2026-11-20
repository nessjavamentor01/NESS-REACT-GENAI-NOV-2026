export default function TypingIndicator() {
  return (
    <span className="inline-flex items-center gap-1" aria-hidden="true">
      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-current" />
    </span>
  )
}
