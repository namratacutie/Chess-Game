/**
 * useMultiplayer.js
 * 
 * Hook to sync game state with Firestore in real-time.
 * Also handles player presence (online/away/offline).
 * Should only be called ONCE per game room (in GameRoom component).
 */

import { useEffect } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import useGameStore from '../store/gameStore';

export const useMultiplayer = (roomId) => {
    const syncFromRemote = useGameStore(s => s.syncFromRemote);
    const setPlayerColor = useGameStore(s => s.setPlayerColor);
    const setOpponentName = useGameStore(s => s.setOpponentName);
    const setOpponentOnline = useGameStore(s => s.setOpponentOnline);
    const resetGame = useGameStore(s => s.resetGame);

    // ─── Game State Sync ─────────────────────────
    useEffect(() => {
        if (!roomId) return;

        // Reset to a clean game state BEFORE subscribing,
        // so the Firestore snapshot always writes into a fresh game.
        resetGame();

        const roomRef = doc(db, 'games', roomId);
        const user = auth.currentUser;

        console.log(`[Multiplayer] Subscribing to room: ${roomId}`);

        const unsubscribe = onSnapshot(roomRef, (docSnap) => {
            if (!docSnap.exists()) return;

            const data = docSnap.data();
            if (!user) return;

            // Determine this player's color and opponent info
            const presence = data.presence || {};
            if (data.players.white === user.uid) {
                setPlayerColor('w');
                setOpponentName(data.playerNames.black || 'Waiting...');
                setOpponentOnline(presence.black || 'offline');
            } else if (data.players.black === user.uid) {
                setPlayerColor('b');
                setOpponentName(data.playerNames.white || 'Unknown');
                setOpponentOnline(presence.white || 'offline');
            }

            // Sync the board state from the remote FEN
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
    }, [roomId, syncFromRemote, setPlayerColor, setOpponentName, setOpponentOnline, resetGame]);

    // ─── Presence Tracking ───────────────────────
    useEffect(() => {
        if (!roomId) return;

        const user = auth.currentUser;
        if (!user) return;

        const roomRef = doc(db, 'games', roomId);

        // Figure out which slot this user occupies
        const getPresenceKey = async () => {
            const { getDoc } = await import('firebase/firestore');
            const snap = await getDoc(roomRef);
            if (!snap.exists()) return null;
            const data = snap.data();
            if (data.players.white === user.uid) return 'white';
            if (data.players.black === user.uid) return 'black';
            return null;
        };

        let presenceKey = null;

        const setPresence = (status) => {
            if (!presenceKey) return;
            updateDoc(roomRef, {
                [`presence.${presenceKey}`]: status,
                [`presenceUpdatedAt.${presenceKey}`]: serverTimestamp(),
            }).catch(() => { });
        };

        const handleVisibility = () => {
            setPresence(document.hidden ? 'away' : 'online');
        };

        const handleBeforeUnload = () => {
            setPresence('offline');
        };

        // Initialize
        getPresenceKey().then((key) => {
            presenceKey = key;
            if (presenceKey) {
                setPresence('online');
                document.addEventListener('visibilitychange', handleVisibility);
                window.addEventListener('beforeunload', handleBeforeUnload);
            }
        });

        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Mark offline when unmounting (navigating away in-app)
            setPresence('offline');
        };
    }, [roomId]);
};

export default useMultiplayer;

