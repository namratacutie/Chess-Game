/**
 * MoveHistory.jsx — Move History Sidebar
 * 
 * Displays the list of moves in the game.
 */

import React, { useEffect, useRef } from 'react'
import './MoveHistory.css'
import useGameStore from '../../store/gameStore.js'

const MoveHistory = () => {
    const moves = useGameStore(s => s.moveHistory)
    const scrollRef = useRef(null)

    // Auto-scroll to bottom on new move
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [moves])

    // Group moves into pairs (rounds)
    const rounds = []
    for (let i = 0; i < moves.length; i += 2) {
        rounds.push({
            number: Math.floor(i / 2) + 1,
            white: moves[i],
            black: moves[i + 1]
        })
    }

    return (
        <div className="move-history-panel">
            <h3 className="history-title">MISSION LOG</h3>
            <div className="moves-list" ref={scrollRef}>
                {rounds.map((round) => (
                    <div key={round.number} className="move-row">
                        <span className="round-number">{round.number}.</span>
                        <span className="move-san white">{round.white?.san}</span>
                        <span className="move-san black">{round.black?.san || '...'}</span>
                    </div>
                ))}
                {moves.length === 0 && <p className="no-moves">READY FOR LAUNCH</p>}
            </div>
        </div>
    )
}

export default MoveHistory
