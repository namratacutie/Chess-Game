/**
 * useAuth.js
 * 
 * Custom hook to manage the global authentication state.
 */

import { useState, useEffect } from 'react';
import { subscribeToAuthChanges } from '../services/authService';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = subscribeToAuthChanges((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, loading };
};

export default useAuth;
