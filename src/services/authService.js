/**
 * authService.js
 * 
 * Handles Firebase Authentication operations:
 * - Google Sign-in
 * - Anonymous (Guest) Sign-in
 * - Logout
 */

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInAnonymously as firebaseSignInAnonymously,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
};

export const signInAnonymously = async () => {
    try {
        const result = await firebaseSignInAnonymously(auth);
        return result.user;
    } catch (error) {
        console.error("Error signing in anonymously:", error);
        throw error;
    }
};

export const signOut = () => firebaseSignOut(auth);

export const subscribeToAuthChanges = (callback) => {
    return onAuthStateChanged(auth, callback);
};
