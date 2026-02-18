/**
 * PlayerPanel.jsx — Player Info Display
 * 
 * Shows player info, captured pieces, and active turn indicator.
 */

import React from 'react'
import './PlayerPanel.css'
import useGameStore, { getPieceImage } from '../../store/gameStore.js'

const PlayerPanel = ({ color, isOpponent }) => {
    const turn = useGameStore(s => s.turn)
    const captured = useGameStore(s => s.capturedPieces[color])
    const opponentName = useGameStore(s => s.opponentName)
    const playerColor = useGameStore(s => s.playerColor)
    const isMultiplayer = useGameStore(s => s.isMultiplayer)

    const isPlayerTurn = turn === color

    let playerName = color === 'w' ? 'COMMANDER (WHITE)' : 'OPPONENT (BLACK)'
    if (isMultiplayer) {
        if (isOpponent) {
            playerName = opponentName.toUpperCase()
        } else {
            playerName = "YOU (COMMANDER)"
        }
    }

    return (
        <div className={`player-panel ${color} ${isPlayerTurn ? 'active' : ''}`}>
            <div className="player-info">
                <div className="player-avatar">
                    {color === 'w' ? '👨‍🚀' : '👽'}
                </div>
                <div className="player-meta">
                    <span className="player-name">{playerName}</span>
                    <span className="player-status">{isPlayerTurn ? 'DECIDING...' : 'WAITING'}</span>
                </div>
            </div>

            <div className="captured-box">
                {captured.map((piece, i) => (
                    <img
                        key={i}
                        src={getPieceImage(piece.color, piece.type)}
                        alt="captured"
                        className="captured-piece"
                    />
                ))}
            </div>

            {isPlayerTurn && <div className="turn-scanner"></div>}
        </div>
    )
}

export default PlayerPanel
