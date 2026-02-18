/**
 * Tiles.jsx — Individual Board Tile
 * 
 * Renders a single chess square with:
 * - Mars-themed light/dark coloring
 * - Piece image (if occupied)
 * - Visual indicators: selected, valid move, last move, check
 */

import React from 'react'
import './Tiles.css'

const Tiles = ({
    square,
    image,
    isLight,
    isSelected,
    isValidMove,
    isLastMoveFrom,
    isLastMoveTo,
    isCheck,
    hasPiece,
    onClick,
}) => {
    // Build CSS class list
    const classNames = [
        'tile',
        isLight ? 'tile--light' : 'tile--dark',
        isSelected && 'tile--selected',
        isLastMoveFrom && 'tile--last-from',
        isLastMoveTo && 'tile--last-to',
        isCheck && 'tile--check',
    ].filter(Boolean).join(' ')

    return (
        <div className={classNames} onClick={onClick} data-square={square}>
            {/* Valid move indicator */}
            {isValidMove && (
                hasPiece
                    ? <div className="tile__capture-ring" />
                    : <div className="tile__move-dot" />
            )}

            {/* Piece image */}
            {image && (
                <img
                    src={image}
                    alt={square}
                    className="tile__piece"
                    draggable={false}
                />
            )}
        </div>
    )
}

export default React.memo(Tiles)