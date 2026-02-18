/**
 * Home.jsx
 * 
 * Game Lobby / Dashboard.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../services/gameService';
import { auth } from '../services/firebase';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [roomCode, setRoomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const user = auth.currentUser;

    const handleCreateGame = async () => {
        setLoading(true);
        setError(null);
        try {
            const roomId = await createRoom(user.uid, user.displayName || `Player ${user.uid.slice(0, 4)}`);
            navigate(`/game/${roomId}`);
        } catch (err) {
            setError("Failed to create mission.");
            setLoading(false);
        }
    };

    const handleJoinGame = async (e) => {
        e.preventDefault();
        if (!roomCode.trim()) return;

        setLoading(true);
        setError(null);
        try {
            await joinRoom(roomCode.trim().toUpperCase(), user.uid, user.displayName || `Player ${user.uid.slice(0, 4)}`);
            navigate(`/game/${roomCode.trim().toUpperCase()}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="home-page">
            <div className="home-container">
                <header className="home-header">
                    <div className="hud-line-top"></div>
                    <h1 className="home-title">MISSION CONTROL</h1>
                    <div className="home-user-badge">
                        <span className="user-icon">👤</span>
                        <span className="home-user">COMMANDER: {user?.displayName || 'GUEST'}</span>
                    </div>
                </header>

                {error && <div className="home-error">{error}</div>}

                <div className="home-grid">
                    <div className="home-card create-card">
                        <div className="card-hud">01</div>
                        <h3>INITIALIZE NEW MISSION</h3>
                        <p>Generate a unique mission code and wait for an opponent.</p>
                        <button
                            className="btn-action btn-create"
                            onClick={handleCreateGame}
                            disabled={loading}
                        >
                            {loading ? 'INITIALIZING...' : 'START NEW MISSION'}
                        </button>
                    </div>

                    <div className="home-card join-card">
                        <div className="card-hud">02</div>
                        <h3>JOIN MISSION</h3>
                        <p>Enter a mission code provided by another commander.</p>
                        <form onSubmit={handleJoinGame} className="join-form">
                            <input
                                type="text"
                                placeholder="ENTER MISSION ID"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                                className="room-input"
                                maxLength={6}
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="btn-action btn-join"
                                disabled={loading || !roomCode}
                            >
                                {loading ? 'SYNCING...' : 'SYNC WITH MISSION'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="home-status-bar">
                    <div className="status-item">
                        <span className="dot pulse"></span>
                        SYSTEMS: OPTIMAL
                    </div>
                    <div className="status-item">
                        LOCATION: JEZERO CRATER
                    </div>
                </div>

                <div className="home-footer">
                    <button className="btn-logout" onClick={() => auth.signOut()}>
                        TERMINATE SESSION
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
