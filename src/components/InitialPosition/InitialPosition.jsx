/**
 * InitialPosition.jsx - Chess Piece Starting Positions
 * 
 * This file defines the initial setup of all chess pieces on the board.
 * It maps each board position (like "a1", "e8") to its corresponding piece image.
 * 
 * Chess Board Layout:
 * 
 *     a   b   c   d   e   f   g   h
 *   +---+---+---+---+---+---+---+---+
 * 8 | ♜ | ♞ | ♝ | ♛ | ♚ | ♝ | ♞ | ♜ |  <- Black back row
 *   +---+---+---+---+---+---+---+---+
 * 7 | ♟ | ♟ | ♟ | ♟ | ♟ | ♟ | ♟ | ♟ |  <- Black pawns
 *   +---+---+---+---+---+---+---+---+
 * 6 |   |   |   |   |   |   |   |   |
 *   +---+---+---+---+---+---+---+---+
 * 5 |   |   |   |   |   |   |   |   |
 *   +---+---+---+---+---+---+---+---+
 * 4 |   |   |   |   |   |   |   |   |
 *   +---+---+---+---+---+---+---+---+
 * 3 |   |   |   |   |   |   |   |   |
 *   +---+---+---+---+---+---+---+---+
 * 2 | ♙ | ♙ | ♙ | ♙ | ♙ | ♙ | ♙ | ♙ |  <- White pawns
 *   +---+---+---+---+---+---+---+---+
 * 1 | ♖ | ♘ | ♗ | ♕ | ♔ | ♗ | ♘ | ♖ |  <- White back row
 *   +---+---+---+---+---+---+---+---+
 */

// Import all black piece images (prefix: b)
import bBishop from '../../assets/images/black-bishop.png'
import bKing from '../../assets/images/black-king.png'
import bKnight from '../../assets/images/black-knight.png'
import bPawn from '../../assets/images/black-pawn.png'
import bQueen from '../../assets/images/black-queen.png'
import bRook from '../../assets/images/black-rook.png'

// Import all white piece images (prefix: w)
import wBishop from '../../assets/images/white-bishop.png'
import wKing from '../../assets/images/white-king.png'
import wKnight from '../../assets/images/white-knight.png'
import wPawn from '../../assets/images/white-pawn.png'
import wQueen from '../../assets/images/white-queen.png'
import wRook from '../../assets/images/white-rook.png'

/**
 * InitialPosition Object
 * 
 * Maps chess notation positions to piece images.
 * Key format: [column][row] (e.g., "a1", "e8")
 * Value: Imported image path for the piece at that position
 * 
 * Positions without pieces (rows 3-6) are not included in this object.
 * When accessed, they return undefined, which is handled as null in Chessboard.jsx
 */
export const InitialPosition = {
    // White back row (row 1): Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
    a1: wRook, b1: wKnight, c1: wBishop, d1: wQueen,
    e1: wKing, f1: wBishop, g1: wKnight, h1: wRook,

    // White pawns (row 2): All 8 pawns
    a2: wPawn, b2: wPawn, c2: wPawn, d2: wPawn,
    e2: wPawn, f2: wPawn, g2: wPawn, h2: wPawn,

    // Black back row (row 8): Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook
    a8: bRook, b8: bKnight, c8: bBishop, d8: bQueen,
    e8: bKing, f8: bBishop, g8: bKnight, h8: bRook,

    // Black pawns (row 7): All 8 pawns
    a7: bPawn, b7: bPawn, c7: bPawn, d7: bPawn,
    e7: bPawn, f7: bPawn, g7: bPawn, h7: bPawn
}