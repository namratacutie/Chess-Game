/**
 * useMultiplayer.js
 * 
 * Hook to sync game state with Firestore in real-time.
 * Should only be called ONCE per game room (in GameRoom component).
 * makeRemoteMove lives in the Zustand store so any component can use it.
 */

import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import useGameStore from '../store/gameStore';

export const useMultiplayer = (roomId) => {
    const syncFromRemote = useGameStore(s => s.syncFromRemote);
    const setPlayerColor = useGameStore(s => s.setPlayerColor);
    const setOpponentName = useGameStore(s => s.setOpponentName);
    const resetGame = useGameStore(s => s.resetGame);

    useEffect(() => {
        if (!roomId) return;

        // Reset to a clean game state BEFORE subscribing,
        // so the Firestore snapshot always writes into a fresh game.
        resetGame();

        const roomRef = doc(db, 'games', roomId);

        console.log(`[Multiplayer] Subscribing to room: ${roomId}`);

        const unsubscribe = onSnapshot(roomRef, (docSnap) => {
            if (!docSnap.exists()) return;

            const data = docSnap.data();
            const user = auth.currentUser;
            if (!user) return;

            // Determine this player's color FIRST (before sync which could throw)
            if (data.players.white === user.uid) {
                setPlayerColor('w');
                setOpponentName(data.playerNames.black || 'Waiting...');
            } else if (data.players.black === user.uid) {
                setPlayerColor('b');
                setOpponentName(data.playerNames.white || 'Unknown');
            }

            // Then sync the board state from the remote FEN
            syncFromRemote({
                fen: data.fen,
                history: data.history,
                status: data.status,
                winner: data.winner,
            });
        });

        return () => {
            console.log(`[Multiplayer] Unsubscribing from room: ${roomId}`);
            unsubscribe();
        };
    }, [roomId, syncFromRemote, setPlayerColor, setOpponentName, resetGame]);
};

export default useMultiplayer;
