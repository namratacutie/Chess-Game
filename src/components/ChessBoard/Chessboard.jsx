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

    const playerColor = useGameStore(s => s.playerColor)
    const turn = useGameStore(s => s.turn)
    const isMultiplayer = useGameStore(s => s.isMultiplayer)
    const makeRemoteMove = useGameStore(s => s.makeRemoteMove)

    const checkSquare = getCheckSquare()

    const handleSquareClick = async (square) => {
        // Multi-player turn check
        if (isMultiplayer && turn !== playerColor) return;

        const state = useGameStore.getState();
        const { selectedSquare, validMoves } = state;

        // If a move is about to be made
        if (selectedSquare && validMoves.includes(square)) {
            const result = state.executeMove(selectedSquare, square);
            if (result && isMultiplayer) {
                await makeRemoteMove(result.fen, result.move);
            }
        } else {
            selectSquare(square);
        }
    }

    // Flip the board when playing as black
    const isFlipped = playerColor === 'b'

    // Build the board tiles from the chess.js 2D array
    let tiles = []
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const row = isFlipped ? 7 - i : i
            const col = isFlipped ? 7 - j : j
            const square = toSquare(col, row)
            const piece = board[row][col]
            const image = piece ? getPieceImage(piece.color, piece.type) : null
            const isLight = (row + col) % 2 === 0

            tiles.push(
                <Tiles
                    key={square}
                    square={square}
                    image={image}
                    isLight={isLight}
                    isSelected={selectedSquare === square}
                    isValidMove={validMoves.includes(square)}
                    isLastMoveFrom={lastMove?.from === square}
                    isLastMoveTo={lastMove?.to === square}
                    isCheck={checkSquare === square}
                    hasPiece={!!piece}
                    onClick={() => handleSquareClick(square)}
                />
            )
        }
    }

    // Coordinate labels — reversed when board is flipped
    const files = isFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const ranks = isFlipped ? [1, 2, 3, 4, 5, 6, 7, 8] : [8, 7, 6, 5, 4, 3, 2, 1]

    return (
        <div className="chess-board-wrapper">
            {/* Board coordinate labels */}
            <div className="board-files">
                {files.map(f => (
                    <span key={f} className="file-label">{f}</span>
                ))}
            </div>
            <div className="board-with-ranks">
                <div className="board-ranks">
                    {ranks.map(r => (
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
        message = 'Stalemate! It\'s a draw babe 🤝'
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