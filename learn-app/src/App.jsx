import './App.css'
import AxiosChatBox from './components/AxiosChatBox'

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false)

  return (
    // <Routes>
    //   <Route
    //     path="/"
    //     element={<Login onLogin={() => setIsAuthenticated(true)} />}
    //   />
    //   <Route
    //     path="/chatbot"
    //     element={
    //       isAuthenticated
    //         ? <Chatbot onLogout={() => setIsAuthenticated(false)} />
    //         : <Navigate to="/" replace />
    //     }
    //   />
    //   <Route path="*" element={<Navigate to="/" replace />} />
    // </Routes>
    <AxiosChatBox />
  )
}

export default App
