/**
 * Chessboard.jsx - Chess Board Component
 * 
 * Renders the 8x8 chess board using game state from Zustand store.
 * Handles piece selection and move execution via click-to-move.
 */

import React from 'react'
import './Chessboard.css'
import Tiles from '../Tiles/Tiles.jsx'
import PromotionModal from '../PromotionModal/PromotionModal.jsx'
import useGameStore, { getPieceImage, toSquare } from '../../store/gameStore.js'

const Chessboard = () => {
    const board = useGameStore(s => s.board)
    const selectedSquare = useGameStore(s => s.selectedSquare)
    const validMoves = useGameStore(s => s.validMoves)
    const lastMove = useGameStore(s => s.lastMove)
    const gameStatus = useGameStore(s => s.gameStatus)
    const showPromotion = useGameStore(s => s.showPromotion)
    const selectSquare = useGameStore(s => s.selectSquare)
    const getCheckSquare = useGameStore(s => s.getCheckSquare)

    const checkSquare = getCheckSquare()

    // Build the board tiles from the chess.js 2D array
    // board[row][col]: row 0 = rank 8, col 0 = file a
    let tiles = []

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = toSquare(col, row)
            const piece = board[row][col]
            const image = piece ? getPieceImage(piece.color, piece.type) : null

            // Tile color: (row + col) even = light, odd = dark
            const isLight = (row + col) % 2 === 0

            // Highlight states
            const isSelected = selectedSquare === square
            const isValidMove = validMoves.includes(square)
            const isLastMoveFrom = lastMove?.from === square
            const isLastMoveTo = lastMove?.to === square
            const isCheck = checkSquare === square

            tiles.push(
                <Tiles
                    key={square}
                    square={square}
                    image={image}
                    isLight={isLight}
                    isSelected={isSelected}
                    isValidMove={isValidMove}
                    isLastMoveFrom={isLastMoveFrom}
                    isLastMoveTo={isLastMoveTo}
                    isCheck={isCheck}
                    hasPiece={!!piece}
                    onClick={() => selectSquare(square)}
                />
            )
        }
    }

    return (
        <div className="chess-board-wrapper">
            {/* Board coordinate labels */}
            <div className="board-files">
                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(f => (
                    <span key={f} className="file-label">{f}</span>
                ))}
            </div>
            <div className="board-with-ranks">
                <div className="board-ranks">
                    {[8, 7, 6, 5, 4, 3, 2, 1].map(r => (
                        <span key={r} className="rank-label">{r}</span>
                    ))}
                </div>
                <div className="chess-board">{tiles}</div>
            </div>

            {/* Game status overlay */}
            {gameStatus.isGameOver && (
                <GameOverOverlay status={gameStatus} />
            )}

            {/* Pawn promotion modal */}
            {showPromotion && (
                <PromotionModal
                    color={useGameStore.getState().turn === 'b' ? 'w' : 'b'}
                />
            )}
        </div>
    )
}

/**
 * Game Over Overlay — shown when game ends
 */
const GameOverOverlay = ({ status }) => {
    const resetGame = useGameStore(s => s.resetGame)

    let message = ''
    if (status.isCheckmate) {
        message = `Checkmate! ${status.turn === 'w' ? 'Black' : 'White'} wins! 🏆`
    } else if (status.isStalemate) {
        message = 'Stalemate! It\'s a draw 🤝'
    } else if (status.isDraw) {
        message = 'Draw! 🤝'
    }

    return (
        <div className="game-over-overlay">
            <div className="game-over-card">
                <h2 className="game-over-title">Game Over</h2>
                <p className="game-over-message">{message}</p>
                <button className="btn-rematch" onClick={resetGame}>
                    ⟳ New Game
                </button>
            </div>
        </div>
    )
}

export default Chessboard