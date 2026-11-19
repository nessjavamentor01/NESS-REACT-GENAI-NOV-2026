import './App.css'
import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import Login from './components/Login'
import Chatbot from './components/Chatbot'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    <Routes>
      <Route
        path="/"
        element={<Login onLogin={() => setIsAuthenticated(true)} />}
      />
      <Route
        path="/chatbot"
        element={
          isAuthenticated
            ? <Chatbot onLogout={() => setIsAuthenticated(false)} />
            : <Navigate to="/" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
