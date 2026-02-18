import React from 'react'
import Chessboard from './components/ChessBoard/Chessboard.jsx'
import Sky from './components/Sky/Sky.jsx'
import PlayerPanel from './components/PlayerPanel/PlayerPanel.jsx'
import MoveHistory from './components/MoveHistory/MoveHistory.jsx'
import './App.css'
import Lenis from 'lenis'

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
    <div className="app">
      <main className="game-container">
        <div className="game-main-area">
          <PlayerPanel color="b" />
          <Chessboard />
          <PlayerPanel color="w" />
        </div>

        <aside className="game-sidebar">
          <h1 className="main-title">MARS CHESS</h1>
          <MoveHistory />
        </aside>
      </main>

      <Sky />
    </div>
  )
}

export default App