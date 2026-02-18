/**
 * gameStore.js — Zustand Game State Store
 * 
 * Central state management for the chess game.
 * Manages board state, turns, move history, selections, and game status.
 */

import { create } from 'zustand';
import {
    createGame,
    getValidMoves,
    makeMove,
    getGameStatus,
    getBoardState,
    isPromotionMove,
    getVerboseHistory,
    getKingSquare,
} from '../engine/chessEngine.js';

// Piece images — imported statically for Vite bundling
import bBishop from '../assets/images/black-bishop.png';
import bKing from '../assets/images/black-king.png';
import bKnight from '../assets/images/black-knight.png';
import bPawn from '../assets/images/black-pawn.png';
import bQueen from '../assets/images/black-queen.png';
import bRook from '../assets/images/black-rook.png';
import wBishop from '../assets/images/white-bishop.png';
import wKing from '../assets/images/white-king.png';
import wKnight from '../assets/images/white-knight.png';
import wPawn from '../assets/images/white-pawn.png';
import wQueen from '../assets/images/white-queen.png';
import wRook from '../assets/images/white-rook.png';

/** Map piece type+color to imported image */
const PIECE_IMAGES = {
    wp: wPawn, wn: wKnight, wb: wBishop, wr: wRook, wq: wQueen, wk: wKing,
    bp: bPawn, bn: bKnight, bb: bBishop, br: bRook, bq: bQueen, bk: bKing,
};

/**
 * Get the image for a piece
 * @param {string} color - 'w' or 'b'
 * @param {string} type - 'p','n','b','r','q','k'
 * @returns {string|null} Image import or null
 */
export const getPieceImage = (color, type) => {
    return PIECE_IMAGES[`${color}${type}`] || null;
};

/**
 * Convert col/row indices to algebraic notation
 * @param {number} col - 0-7 (a-h)
 * @param {number} row - 0-7 (row 0 = rank 8)
 */
const toSquare = (col, row) => {
    const files = 'abcdefgh';
    return `${files[col]}${8 - row}`;
};

const useGameStore = create((set, get) => {
    const game = createGame();

    return {
        // ─── Core State ─────────────────────────────
        game,
        board: getBoardState(game),
        turn: 'w',
        moveHistory: [],
        capturedPieces: { w: [], b: [] }, // pieces captured BY each color
        selectedSquare: null,
        validMoves: [],
        lastMove: null, // { from, to }
        gameStatus: getGameStatus(game),
        showPromotion: null, // { from, to } when pawn promotion is pending

        // ─── Multiplayer State ──────────────────────
        playerColor: null, // 'w' or 'b'
        opponentName: 'Waiting...',
        userRole: 'viewer', // 'white', 'black', 'viewer'
        isMultiplayer: false,
        roomId: null,

        // ─── Actions ────────────────────────────────

        /**
         * Select a square (click-to-move first click)
         */
        selectSquare: (square) => {
            const state = get();
            const { game, selectedSquare, validMoves, turn } = state;

            // If clicking on a valid move destination → make the move
            if (selectedSquare && validMoves.includes(square)) {
                // Check for promotion
                if (isPromotionMove(game, selectedSquare, square)) {
                    set({ showPromotion: { from: selectedSquare, to: square } });
                    return;
                }
                get().executeMove(selectedSquare, square);
                return;
            }

            // If clicking on own piece → select it
            const piece = game.get(square);
            if (piece && piece.color === turn) {
                const moves = getValidMoves(game, square);
                set({
                    selectedSquare: square,
                    validMoves: moves,
                });
                return;
            }

            // Clicking empty or opponent piece with nothing selected → deselect
            set({ selectedSquare: null, validMoves: [] });
        },

        /**
         * Execute a move (after validation)
         */
        executeMove: (from, to, promotion = 'q') => {
            const state = get();
            const { game } = state;

            const move = makeMove(game, from, to, promotion);
            if (!move) return false;

            // Track captured pieces
            const capturedPieces = { ...state.capturedPieces };
            if (move.captured) {
                // The capturing color gets credit
                const capturingColor = move.color;
                capturedPieces[capturingColor] = [
                    ...capturedPieces[capturingColor],
                    { type: move.captured, color: move.color === 'w' ? 'b' : 'w' }
                ];
            }

            const status = getGameStatus(game);

            set({
                board: getBoardState(game),
                turn: status.turn,
                moveHistory: getVerboseHistory(game),
                capturedPieces,
                selectedSquare: null,
                validMoves: [],
                lastMove: { from: move.from, to: move.to },
                gameStatus: status,
                showPromotion: null,
            });

            return { fen: game.fen(), move: { from: move.from, to: move.to, san: move.san } };
        },

        /**
         * Handle pawn promotion selection
         */
        promoteWith: (piece) => {
            const state = get();
            const { showPromotion } = state;
            if (!showPromotion) return null;
            return get().executeMove(showPromotion.from, showPromotion.to, piece);
        },

        /**
         * Cancel promotion selection
         */
        cancelPromotion: () => {
            set({ showPromotion: null, selectedSquare: null, validMoves: [] });
        },

        /**
         * Reset the game to starting position
         */
        resetGame: () => {
            const newGame = createGame();
            set({
                game: newGame,
                board: getBoardState(newGame),
                turn: 'w',
                moveHistory: [],
                capturedPieces: { w: [], b: [] },
                selectedSquare: null,
                validMoves: [],
                lastMove: null,
                gameStatus: getGameStatus(newGame),
                showPromotion: null,
            });
        },

        // ─── Multiplayer Actions ────────────────────

        setPlayerColor: (color) => set({ playerColor: color, userRole: color === 'w' ? 'white' : 'black', isMultiplayer: true }),

        setOpponentName: (name) => set({ opponentName: name }),

        setRoomId: (id) => set({ roomId: id, isMultiplayer: !!id }),

        /**
         * Sync local state from remote data (Firestore snapshot)
         */
        syncFromRemote: (data) => {
            const state = get();
            const { game } = state;

            // Only sync if the FEN is different (ignore our own updates)
            if (data.fen !== game.fen()) {
                game.load(data.fen);
                const status = getGameStatus(game);

                set({
                    board: getBoardState(game),
                    turn: status.turn,
                    moveHistory: getVerboseHistory(game),
                    gameStatus: status,
                    lastMove: data.history?.length > 0 ? data.history[data.history.length - 1] : null,
                });
            }
        },

        // ─── Computed Helpers ─────────────────────────

        /**
         * Get the king square if in check
         */
        getCheckSquare: () => {
            const { game, gameStatus } = get();
            if (gameStatus.isCheck || gameStatus.isCheckmate) {
                return getKingSquare(game, game.turn());
            }
            return null;
        },
    };
});

export { toSquare };
export default useGameStore;
