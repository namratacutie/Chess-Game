import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Chessboard from './components/ChessBoard/Chessboard.jsx'
import Sky from './components/Sky/Sky.jsx'
import PlayerPanel from './components/PlayerPanel/PlayerPanel.jsx'
import MoveHistory from './components/MoveHistory/MoveHistory.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx' // We'll build the lobby next
import './App.css'
import Lenis from 'lenis'

import { useParams } from 'react-router-dom'
import useMultiplayer from './hooks/useMultiplayer'
import useGameStore from './store/gameStore'

const GameRoom = () => {
  const { roomId } = useParams()
  const setRoomId = useGameStore(s => s.setRoomId)
  const opponentName = useGameStore(s => s.opponentName)
  const playerColor = useGameStore(s => s.playerColor)

  // Activate real-time sync
  useMultiplayer(roomId)

  // Register room in store
  React.useEffect(() => {
    setRoomId(roomId)
  }, [roomId, setRoomId])

  const [copied, setCopied] = React.useState(false)

  const copyMissionId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="game-container">
      <div className="game-main-area">
        <PlayerPanel color={playerColor === 'w' ? 'b' : 'w'} isOpponent />
        <Chessboard />
        <PlayerPanel color={playerColor === 'w' ? 'w' : 'b'} />
      </div>

      <aside className="game-sidebar">
        <div className="mission-status-panel">
          <h1 className="main-title">MARS CHESS</h1>
          <div className="mission-badge" onClick={copyMissionId} style={{ cursor: 'pointer' }}>
            {copied ? 'COPIED TO HUD' : `MISSION ID: ${roomId}`}
          </div>
        </div>
        <MoveHistory />
        <div className="mission-controls">
          <button className="btn-abort" onClick={() => window.location.href = '/'}>ABORT MISSION</button>
        </div>
      </aside>
    </main>
  )
}

const App = () => {

  // Initialize Lenis
  const lenis = new Lenis();

  // Use requestAnimationFrame to continuously update the scroll
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />

          <Route path="/game/:roomId" element={
            <ProtectedRoute>
              <GameRoom />
            </ProtectedRoute>
          } />

          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Sky />
      </div>
    </Router>
  )
}

export default App