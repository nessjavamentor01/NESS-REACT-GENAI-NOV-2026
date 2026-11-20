export const MIN_PROMPT_LENGTH = 5
export const MAX_PROMPT_LENGTH = 2000

export function getPromptValidationMessage(prompt) {
  const trimmedPrompt = typeof prompt === 'string' ? prompt.trim() : ''

  if (!trimmedPrompt) {
    return 'A prompt is required.'
  }

  if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
    return `Prompt must be at least ${MIN_PROMPT_LENGTH} characters.`
  }

  if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
    return `Prompt must be no more than ${MAX_PROMPT_LENGTH} characters.`
  }

  return ''
}
