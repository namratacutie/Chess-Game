/**
 * gameService.js
 * 
 * Manages game sessions (Rooms) in Firestore.
 */

import { collection, doc, setDoc, getDoc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a new game room.
 */
export const createRoom = async (hostId, hostName) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase(); // Short readable code
    const roomRef = doc(db, 'games', roomId);

    const roomData = {
        roomId,
        hostId,
        hostName,
        status: 'waiting', // waiting, playing, finished
        players: {
            white: hostId,
            black: null
        },
        playerNames: {
            white: hostName,
            black: null
        },
        fen: 'start',
        history: [],
        createdAt: serverTimestamp(),
        lastMoveAt: serverTimestamp(),
        winner: null
    };

    await setDoc(roomRef, roomData);
    return roomId;
};

/**
 * Joins an existing game room.
 */
export const joinRoom = async (roomId, userId, userName) => {
    const roomRef = doc(db, 'games', roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        throw new Error("Mission ID not found.");
    }

    const roomData = roomSnap.data();

    if (roomData.status !== 'waiting') {
        throw new Error("Mission already in progress or completed.");
    }

    // Assign player to the empty slot (black)
    await updateDoc(roomRef, {
        'players.black': userId,
        'playerNames.black': userName,
        status: 'playing',
        lastMoveAt: serverTimestamp()
    });

    return roomData;
};

export const getRoomData = async (roomId) => {
    const roomRef = doc(db, 'games', roomId);
    const roomSnap = await getDoc(roomRef);
    return roomSnap.exists() ? roomSnap.data() : null;
};
