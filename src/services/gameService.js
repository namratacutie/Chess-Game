/**
 * gameService.js — Firestore Game Operations
 *
 * CRUD operations for multiplayer games:
 * - createGame(hostId) → Create Firestore doc, return game code
 * - joinGame(gameCode, playerId) → Join existing game
 * - updateGameState(gameId, fen, move) → Push move to Firestore
 * - subscribeToGame(gameId, callback) → onSnapshot listener
 * - resignGame(gameId, playerId) → Handle resignation
 *
 * @module services/gameService
 */

// TODO: Implement in Phase 2
