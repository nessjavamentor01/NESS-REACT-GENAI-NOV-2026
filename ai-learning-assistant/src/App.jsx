import { useEffect } from 'react'
import AIResponse from './components/AIResponse.jsx'
import ChatHistory from './components/ChatHistory.jsx'
import Header from './components/Header.jsx'
import PromptInput from './components/PromptInput.jsx'
import { AIProvider } from './context/AIContext.jsx'
import { useChat } from './hooks/useChat.js'

function AppContent() {
  const { startNewChat } = useChat()

  useEffect(() => {
    document.title = 'AI Learning Assistant'
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onNewChat={startNewChat} />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:flex-row lg:items-start lg:gap-6">
        <aside className="w-full lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:w-72 lg:shrink-0 lg:overflow-y-auto">
          <ChatHistory />
        </aside>
        <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-5 lg:flex-1">
          <AIResponse />
          <PromptInput />
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <AIProvider>
      <AppContent />
    </AIProvider>
  )
}

export default App
