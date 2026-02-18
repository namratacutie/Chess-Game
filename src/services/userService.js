/**
 * userService.js
 * 
 * Manages user profile data in Firestore.
 */

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Creates or updates a user profile in Firestore after authentication.
 */
export const syncUserProfile = async (user) => {
    if (!user) return null;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    const userData = {
        uid: user.uid,
        displayName: user.displayName || `Commander ${user.uid.slice(0, 5)}`,
        email: user.email || null,
        photoURL: user.photoURL || null,
        isAnonymous: user.isAnonymous,
        lastLogin: serverTimestamp(),
        stats: {
            wins: 0,
            losses: 0,
            draws: 0,
            totalGames: 0
        }
    };

    if (!userSnap.exists()) {
        await setDoc(userRef, userData);
    } else {
        // Only update certain fields to avoid overwriting stats
        await updateDoc(userRef, {
            lastLogin: serverTimestamp(),
            displayName: user.displayName || userSnap.data().displayName,
            photoURL: user.photoURL || userSnap.data().photoURL
        });
    }

    return userData;
};

export const getUserProfile = async (uid) => {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
};
