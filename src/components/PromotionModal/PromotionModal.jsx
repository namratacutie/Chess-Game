/**
 * PromotionModal.jsx — Pawn Promotion Selection
 * 
 * Mars-themed modal for selecting promotion piece.
 */

import React from 'react'
import './PromotionModal.css'
import useGameStore, { getPieceImage } from '../../store/gameStore.js'

const PROMOTION_PIECES = ['q', 'r', 'b', 'n']
const PIECE_NAMES = { q: 'Queen', r: 'Rook', b: 'Bishop', n: 'Knight' }

const PromotionModal = ({ color }) => {
    const promoteWith = useGameStore(s => s.promoteWith)
    const cancelPromotion = useGameStore(s => s.cancelPromotion)
    const isMultiplayer = useGameStore(s => s.isMultiplayer)
    const makeRemoteMove = useGameStore(s => s.makeRemoteMove)

    const handlePromote = async (piece) => {
        const result = promoteWith(piece);
        if (result && isMultiplayer) {
            await makeRemoteMove(result.fen, result.move);
        }
    }

    return (
        <div className="promotion-overlay" onClick={cancelPromotion}>
            <div className="promotion-card" onClick={e => e.stopPropagation()}>
                <h3 className="promotion-title">Promote Pawn</h3>
                <p className="promotion-subtitle">Choose your piece</p>
                <div className="promotion-pieces">
                    {PROMOTION_PIECES.map(piece => (
                        <button
                            key={piece}
                            className="promotion-piece-btn"
                            onClick={() => handlePromote(piece)}
                            title={PIECE_NAMES[piece]}
                        >
                            <img
                                src={getPieceImage(color, piece)}
                                alt={PIECE_NAMES[piece]}
                                className="promotion-piece-img"
                            />
                            <span className="promotion-piece-label">
                                {PIECE_NAMES[piece]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PromotionModal
