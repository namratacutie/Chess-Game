/**
 * Chessboard.jsx - Chess Board Component
 * 
 * This component renders the 8x8 chess board with all 64 tiles.
 * It handles the board layout and places pieces in their initial positions.
 */

import React from 'react'
import './Chessboard.css'                                           // Chessboard-specific styles
import Tiles from '../Tiles/Tiles.jsx'                              // Individual tile component
import { InitialPosition } from '../InitialPosition/InitialPosition.jsx'  // Initial piece positions

/**
 * Chessboard Component
 * 
 * Generates the chess board by creating 64 Tile components arranged in an 8x8 grid.
 * The board is rendered from top to bottom (row 8 to row 1) and left to right (a to h).
 * 
 * @returns {JSX.Element} The rendered chessboard with all tiles and pieces
 */
const Chessboard = () => {

    // Chess notation: columns are labeled a-h, rows are labeled 1-8
    const xAxis = ["a", "b", "c", "d", "e", "f", "g", "h"]  // Column labels (files)
    const yAxis = ["1", "2", "3", "4", "5", "6", "7", "8"]  // Row labels (ranks)

    let board = []  // Array to store all 64 Tile components

    // Loop through rows from top (8) to bottom (1)
    // j starts at 7 (index for "8") and goes down to 0 (index for "1")
    for (let j = yAxis.length - 1; j >= 0; j--) {
        // Loop through columns from left (a) to right (h)
        for (let i = 0; i < xAxis.length; i++) {

            // Calculate tile color: alternating pattern based on sum of indices
            // Even sum = black tile, odd sum = white tile
            const number = i + j + 2;

            // Create position string like "a1", "e4", "h8" etc.
            const position = `${xAxis[i]}${yAxis[j]}`;

            // Get the piece image for this position from InitialPosition object
            // Returns null if no piece exists at this position
            const image = InitialPosition[position] || null;

            // Create a Tile component and add it to the board array
            board.push(
                <Tiles
                    key={position}       // Unique key for React's reconciliation
                    number={number}     // Used to determine tile color
                    image={image}       // Piece image (if any)
                />
            );
        }
    }

    // Render the board container with all tiles
    return (
        <div className="chess-board">{board}</div>
    )
}

export default Chessboard