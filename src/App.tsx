import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import MusicPage from './pages/MusicPage'
import Preloader from './components/ui/Preloader'

function App() {
  const [preloaderFinished, setPreloaderFinished] = useState(false)

  return (
    <>
      {!preloaderFinished && (
        <Preloader onComplete={() => setPreloaderFinished(true)} />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/musica/:id" element={<MusicPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
