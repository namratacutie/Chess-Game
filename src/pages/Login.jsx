/**
 * Login.jsx
 * 
 * Landing page for authentication.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInAnonymously } from '../services/authService';
import { syncUserProfile } from '../services/userService';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const user = await signInWithGoogle();
            if (user) {
                await syncUserProfile(user);
                navigate('/');
            }
        } catch (err) {
            console.error("Sign-in error:", err);
            setError("Failed to sign in with Google.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
            const user = await signInAnonymously();
            await syncUserProfile(user);
            navigate('/');
        } catch (err) {
            setError("Failed to sign in as guest.");
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">MARS CHESS</h1>
                <p className="login-subtitle">IDENTIFICATION REQUIRED FOR DEPLOYMENT</p>

                {error && <div className="login-error">{error}</div>}

                <div className="login-actions">
                    <button
                        className="btn-google"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                    >
                        <span className="btn-icon">G</span>
                        {loading ? 'PROCESSING...' : 'INITIALIZE WITH GOOGLE'}
                    </button>

                    <button
                        className="btn-guest"
                        onClick={handleGuestSignIn}
                        disabled={loading}
                    >
                        <span className="btn-icon">👤</span>
                        {loading ? 'PROCESSING...' : 'DEPLOY AS GUEST'}
                    </button>
                </div>

                <p className="login-footer">MISSION CRITICAL: ACCESS LOGS ARE MONITORED</p>
            </div>

            {/* Ambient Background Visuals will be handled by the global Sky component */}
        </div>
    );
};

export default Login;
