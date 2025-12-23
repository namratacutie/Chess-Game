import React from 'react'
import Chessboard from './components/ChessBoard/ChessBoard.jsx'
import Sky from './components/Sky/Sky.jsx'
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
    <div>
      <div className="app">
        <Chessboard />
      </div>
      <Sky />
    </div>
  )
}

export default App