/**
 * chessEngine.js — Chess Rules Engine
 * 
 * Wrapper around chess.js providing all game logic:
 * - Move validation, execution, and undo
 * - Special moves: castling, en passant, pawn promotion
 * - Check, checkmate, stalemate, draw detection
 * - Board state via FEN strings
 */

import { Chess } from 'chess.js';

/**
 * Create a new chess engine instance
 * @param {string} [fen] - Optional FEN string to restore a position
 * @returns {Chess} chess.js instance
 */
export const createGame = (fen) => {
    return fen ? new Chess(fen) : new Chess();
};

/**
 * Get all valid moves for a specific square
 * @param {Chess} game - chess.js instance
 * @param {string} square - e.g. "e2"
 * @returns {string[]} Array of target squares e.g. ["e3", "e4"]
 */
export const getValidMoves = (game, square) => {
    const moves = game.moves({ square, verbose: true });
    return moves.map(m => m.to);
};

/**
 * Attempt to make a move
 * @param {Chess} game - chess.js instance
 * @param {string} from - Source square e.g. "e2"
 * @param {string} to - Target square e.g. "e4"
 * @param {string} [promotion] - Promotion piece: 'q', 'r', 'b', 'n'
 * @returns {object|null} Move object if valid, null if illegal
 */
export const makeMove = (game, from, to, promotion = 'q') => {
    try {
        const move = game.move({ from, to, promotion });
        return move;
    } catch {
        return null;
    }
};

/**
 * Get the current game status
 * @param {Chess} game - chess.js instance
 * @returns {object} { isCheck, isCheckmate, isStalemate, isDraw, isGameOver, turn }
 */
export const getGameStatus = (game) => {
    return {
        isCheck: game.isCheck(),
        isCheckmate: game.isCheckmate(),
        isStalemate: game.isStalemate(),
        isDraw: game.isDraw(),
        isGameOver: game.isGameOver(),
        turn: game.turn(), // 'w' or 'b'
        fen: game.fen(),
    };
};

/**
 * Convert the board to a 2D array for rendering
 * Each cell is either null or { type, color, square }
 * type: 'p','n','b','r','q','k'  color: 'w','b'
 * @param {Chess} game - chess.js instance
 * @returns {Array} 8x8 board array
 */
export const getBoardState = (game) => {
    const board = game.board(); // 8x8 array, [row][col], row 0 = rank 8
    return board;
};

/**
 * Get the piece at a specific square
 * @param {Chess} game - chess.js instance
 * @param {string} square - e.g. "e2"
 * @returns {object|null} { type, color } or null
 */
export const getPiece = (game, square) => {
    return game.get(square);
};

/**
 * Check if a move requires pawn promotion
 * @param {Chess} game - chess.js instance
 * @param {string} from - Source square
 * @param {string} to - Target square
 * @returns {boolean}
 */
export const isPromotionMove = (game, from, to) => {
    const piece = game.get(from);
    if (!piece || piece.type !== 'p') return false;
    const targetRank = to[1];
    return (piece.color === 'w' && targetRank === '8') ||
        (piece.color === 'b' && targetRank === '1');
};

/**
 * Get move history in SAN notation
 * @param {Chess} game - chess.js instance
 * @returns {string[]} Array of moves in algebraic notation
 */
export const getMoveHistory = (game) => {
    return game.history();
};

/**
 * Get verbose move history with details
 * @param {Chess} game - chess.js instance
 * @returns {object[]} Array of move objects with from, to, san, captured, etc.
 */
export const getVerboseHistory = (game) => {
    return game.history({ verbose: true });
};

/**
 * Map piece type + color to the image filename
 * @param {string} type - 'p','n','b','r','q','k'
 * @param {string} color - 'w' or 'b'
 * @returns {string} Image filename e.g. "white-king"
 */
export const getPieceImageName = (type, color) => {
    const colorName = color === 'w' ? 'white' : 'black';
    const pieceNames = {
        p: 'pawn',
        n: 'knight',
        b: 'bishop',
        r: 'rook',
        q: 'queen',
        k: 'king',
    };
    return `${colorName}-${pieceNames[type]}`;
};

/**
 * Get the king's square for a given color
 * @param {Chess} game - chess.js instance
 * @param {string} color - 'w' or 'b'
 * @returns {string|null} Square of the king e.g. "e1"
 */
export const getKingSquare = (game, color) => {
    const board = game.board();
    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const piece = board[r][c];
            if (piece && piece.type === 'k' && piece.color === color) {
                return piece.square;
            }
        }
    }
    return null;
};
