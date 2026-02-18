/**
 * ProtectedRoute.jsx
 * 
 * Guards routes that require authentication.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="auth-loading">
                <div className="scanner-line"></div>
                <p>IDENTIFYING COMMANDER...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
