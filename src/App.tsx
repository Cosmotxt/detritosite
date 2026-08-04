import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import MusicPage from './pages/MusicPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/musica/:id" element={<MusicPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
