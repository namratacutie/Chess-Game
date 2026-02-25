/**
 * PlayerPanel.jsx — Player Info Display
 * 
 * Shows player info, captured pieces, active turn indicator,
 * and online/offline presence status.
 */

import React from 'react'
import './PlayerPanel.css'
import useGameStore, { getPieceImage } from '../../store/gameStore.js'

const PRESENCE_CONFIG = {
    online: { label: 'ONLINE', className: 'presence--online' },
    away: { label: 'AWAY', className: 'presence--away' },
    offline: { label: 'OFFLINE', className: 'presence--offline' },
};

const PlayerPanel = ({ color, isOpponent }) => {
    const turn = useGameStore(s => s.turn)
    const captured = useGameStore(s => s.capturedPieces[color])
    const opponentName = useGameStore(s => s.opponentName)
    const opponentOnline = useGameStore(s => s.opponentOnline)
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

    // Presence status: own panel is always online, opponent reads from store
    const presenceStatus = isOpponent ? (opponentOnline || 'offline') : 'online';
    const presence = PRESENCE_CONFIG[presenceStatus] || PRESENCE_CONFIG.offline;

    // Status text: turn status + presence
    const statusText = isMultiplayer
        ? (isPlayerTurn ? 'DECIDING...' : 'WAITING')
        : (isPlayerTurn ? 'DECIDING...' : 'WAITING');

    return (
        <div className={`player-panel ${color} ${isPlayerTurn ? 'active' : ''}`}>
            <div className="player-info">
                <div className="player-avatar">
                    {color === 'w' ? '👨‍🚀' : '👽'}
                </div>
                <div className="player-meta">
                    <span className="player-name">{playerName}</span>
                    <span className="player-status">
                        <span className={`presence-dot ${presence.className}`}></span>
                        {isMultiplayer ? presence.label : statusText}
                    </span>
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
