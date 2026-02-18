/**
 * useMultiplayer.js
 * 
 * Hook to sync game state with Firestore in real-time.
 */

import { useEffect } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import useGameStore from '../store/gameStore';

export const useMultiplayer = (roomId) => {
    const {
        syncFromRemote,
        setPlayerColor,
        setOpponentName,
    } = useGameStore();

    useEffect(() => {
        if (!roomId) return;

        const roomRef = doc(db, 'games', roomId);

        console.log(`Subscribing to room: ${roomId}`);

        const unsubscribe = onSnapshot(roomRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Sync the FEN and history to our local store
                syncFromRemote({
                    fen: data.fen,
                    history: data.history,
                    status: data.status,
                    winner: data.winner,
                    playerNames: data.playerNames,
                });

                // Helper to update opponent info and role
                const user = auth.currentUser;
                if (!user) return;

                if (data.players.white === user.uid) {
                    setPlayerColor('w');
                    setOpponentName(data.playerNames.black || 'Waiting...');
                } else if (data.players.black === user.uid) {
                    setPlayerColor('b');
                    setOpponentName(data.playerNames.white);
                }
            }
        });

        return () => unsubscribe();
    }, [roomId, syncFromRemote, setPlayerColor, setOpponentName]);

    /**
     * Updates the remote game state after a local move.
     */
    const makeRemoteMove = async (fen, move) => {
        if (!roomId) return;
        const roomRef = doc(db, 'games', roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) return;

        await updateDoc(roomRef, {
            fen: fen,
            history: [...(roomSnap.data().history || []), move],
            lastMoveAt: serverTimestamp()
        });
    };

    return { makeRemoteMove };
};

export default useMultiplayer;
