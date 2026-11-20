import { useAI } from '../context/AIContext.jsx'

export function useChat() {
  const {
    history,
    selectedConversationId,
    clearChat,
    selectConversation,
    clearHistory,
  } = useAI()

  return {
    history,
    selectedConversationId,
    startNewChat: clearChat,
    selectConversation,
    clearHistory,
  }
}