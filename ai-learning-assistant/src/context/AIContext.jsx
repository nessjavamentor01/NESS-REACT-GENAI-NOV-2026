import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { generateAIResponse } from '../services/geminiService.js'
import { getPromptValidationMessage } from '../utils/promptValidation.js'

const HISTORY_STORAGE_KEY = 'ai-learning-assistant-history'
const MAX_AUTOMATIC_RETRIES = 2
const BASE_RETRY_DELAY_MS = 1000
const AIContext = createContext(null)

function isConversation(item) {
  return (
    item !== null &&
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.question === 'string' &&
    typeof item.answer === 'string' &&
    typeof item.category === 'string' &&
    typeof item.timestamp === 'string'
  )
}

function loadHistory() {
  try {
    const savedHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY)
    if (!savedHistory) {
      return []
    }

    const parsedHistory = JSON.parse(savedHistory)
    if (!Array.isArray(parsedHistory)) {
      console.error('Saved conversation history is not an array.')
      return []
    }

    return parsedHistory.filter(isConversation)
  } catch (loadError) {
    console.error('Unable to load saved conversation history.', loadError)
    return []
  }
}

export function AIProvider({ children }) {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('General')
  const [response, setResponse] = useState('')
  const [history, setHistory] = useState(loadHistory)
  const [conversationMessages, setConversationMessages] = useState([])
  const [selectedConversationId, setSelectedConversationId] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [fallbackMessage, setFallbackMessage] = useState('')
  const [retryStatus, setRetryStatus] = useState('')
  const [canRetry, setCanRetry] = useState(false)
  const requestId = useRef(0)
  const lastRequest = useRef(null)

  useEffect(() => {
    try {
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(history),
      )
    } catch (saveError) {
      console.error('Unable to save conversation history.', saveError)
    }
  }, [history])

  const runRequest = async (request) => {
    const currentRequestId = ++requestId.current
    setError('')
    setFallbackMessage('')
    setRetryStatus('')
    setResponse('')
    setSelectedConversationId(null)
    setCanRetry(false)
    setIsLoading(true)

    let retryCount = 0

    try {
      while (true) {
        try {
          const answer = await generateAIResponse(
            request.prompt,
            request.category,
            request.previousMessages,
          )
          if (currentRequestId !== requestId.current) {
            return
          }

          const userMessage = {
            role: 'user',
            parts: [{ text: request.prompt }],
          }
          const modelMessage = {
            role: 'model',
            parts: [{ text: answer }],
          }
          const conversation = {
            id: crypto.randomUUID(),
            question: request.prompt,
            answer,
            category: request.category,
            timestamp: new Date().toISOString(),
          }
          setResponse(answer)
          setHistory((currentHistory) => [conversation, ...currentHistory])
          setConversationMessages((currentMessages) => [
            ...currentMessages,
            userMessage,
            modelMessage,
          ])
          setSelectedConversationId(conversation.id)
          setRetryStatus('')
          return
        } catch (requestError) {
          if (currentRequestId !== requestId.current) {
            return
          }

          const isTransient =
            requestError.status === 429 || requestError.status === 503
          if (!isTransient || retryCount >= MAX_AUTOMATIC_RETRIES) {
            setError(requestError.message)
            setFallbackMessage(
              'The AI service is temporarily unavailable. Please try again.',
            )
            setCanRetry(true)
            setRetryStatus('')
            return
          }

          retryCount += 1
          const backoffDelay =
            BASE_RETRY_DELAY_MS * 2 ** (retryCount - 1)
          const retryAfterDelay = Number.isFinite(requestError.retryAfterMs)
            ? Math.max(0, requestError.retryAfterMs)
            : 0
          const delay = Math.max(backoffDelay, retryAfterDelay)
          const delayInSeconds = Math.ceil(delay / 1000)
          setRetryStatus(
            `Temporary service issue. Retrying automatically (${retryCount}/${MAX_AUTOMATIC_RETRIES}) in ${delayInSeconds} seconds.`,
          )

          await new Promise((resolve) => setTimeout(resolve, delay))
          if (currentRequestId !== requestId.current) {
            return
          }
        }
      }
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false)
      }
    }
  }

  const askAI = async () => {
    lastRequest.current = null
    setCanRetry(false)
    const question = prompt.trim()
    const validationMessage = getPromptValidationMessage(prompt)

    if (validationMessage) {
      requestId.current += 1
      setResponse('')
      setSelectedConversationId(null)
      setError(validationMessage)
      setFallbackMessage('')
      setRetryStatus('')
      setIsLoading(false)
      return
    }

    const request = {
      prompt: question,
      category,
      previousMessages: conversationMessages,
    }
    lastRequest.current = request
    setCanRetry(false)
    await runRequest(request)
  }

  const retryAI = async () => {
    if (isLoading) {
      return
    }

    if (!lastRequest.current) {
      await askAI()
      return
    }

    if (!canRetry) {
      return
    }

    await runRequest(lastRequest.current)
  }

  const clearChat = () => {
    requestId.current += 1
    lastRequest.current = null
    setCanRetry(false)
    setPrompt('')
    setResponse('')
    setConversationMessages([])
    setSelectedConversationId(null)
    setError('')
    setFallbackMessage('')
    setRetryStatus('')
    setIsLoading(false)
  }

  const selectConversation = (conversation) => {
    requestId.current += 1
    lastRequest.current = null
    setCanRetry(false)
    setPrompt(conversation.question)
    setCategory(conversation.category)
    setResponse(conversation.answer)
    setConversationMessages([
      {
        role: 'user',
        parts: [{ text: conversation.question }],
      },
      {
        role: 'model',
        parts: [{ text: conversation.answer }],
      },
    ])
    setSelectedConversationId(conversation.id)
    setError('')
    setFallbackMessage('')
    setRetryStatus('')
    setIsLoading(false)
  }

  const clearHistory = () => {
    setHistory([])
    setSelectedConversationId(null)
  }

  const value = {
    prompt,
    setPrompt,
    category,
    setCategory,
    response,
    history,
    selectedConversationId,
    isLoading,
    error,
    fallbackMessage,
    retryStatus,
    canRetry,
    askAI,
    retryAI,
    clearChat,
    selectConversation,
    clearHistory,
  }

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>
}

// The provider and its consumer hook intentionally share this context module.
// eslint-disable-next-line react-refresh/only-export-components
export function useAI() {
  const context = useContext(AIContext)
  if (context === null) {
    throw new Error('useAI must be used within an AIProvider.')
  }
  return context
}
