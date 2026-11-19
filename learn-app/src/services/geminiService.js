/**
 * Sends a prompt to the Gemini Interactions API and returns the generated text.
 *
 * @param {string} prompt The prompt to send to Gemini.
 * @returns {Promise<string | undefined>} The generated text, if present in the response.
 * @throws {Error} If the API responds with a non-success status.
 */
export async function generateContent(prompt) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': import.meta.env.VITE_GEMINI_API_KEY,
    },
    body: JSON.stringify({
      model: import.meta.env.VITE_GEMINI_MODEL,
      input: prompt,
    }),
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const result = await response.json()
  const modelOutput = result.steps?.find((step) => step.type === 'model_output')
  const responseText = modelOutput?.content
    ?.map((item) => item.text ?? '')
    .join('')

  return responseText ?? result.outputs?.map((output) => output.text ?? '').join('')
}
