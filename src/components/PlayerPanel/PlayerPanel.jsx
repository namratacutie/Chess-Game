/**
 * PlayerPanel.jsx — Player Info Display
 * 
 * Shows for each player:
 * - Avatar, display name
 * - Chess clock / timer
 * - Captured pieces row
 * - Online/offline indicator
 * 
 * @module components/PlayerPanel
 */

import React from 'react'
import './PlayerPanel.css'

const PlayerPanel = ({ player, timer, capturedPieces, isActive }) => {
    return (
        <div className={`player-panel ${isActive ? 'active' : ''}`}>
            {/* TODO: Implement in Phase 3 */}
        </div>
    )
}

export default PlayerPanel
