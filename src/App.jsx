/**
 * App.jsx - Main Application Component
 * 
 * This is the root component of the Chess Game application.
 * It serves as the main container and renders the Chessboard component.
 */

import React from 'react'
import Chessboard from './components/ChessBoard/ChessBoard.jsx'  // The main chessboard component
import './App.css'  // App-specific styles

/**
 * App Component
 * 
 * The top-level component that wraps the entire application.
 * Currently renders only the Chessboard, but can be extended
 * to include game controls, player info, move history, etc.
 * 
 * @returns {JSX.Element} The rendered App component
 */
const App = () => {
  return (
    <div className="app">
      <Chessboard />
    </div>
  )
}

export default App