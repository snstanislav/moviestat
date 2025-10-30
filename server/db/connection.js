/**
 * @file connection.js
 * @description MongoDB connection manager module using Mongoose ODM.
 *   Provides functions to establish and close database connections with connection state checking.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module db/connection
 * @requires mongoose - MongoDB ODM for Node.js
 */

const mongoose = require("mongoose");

/**
 * Establishes a connection to MongoDB database using Mongoose.
 * 
 * @async
 * @function connect
 * @param {string} uri - MongoDB connection URI
 * 
 * @returns {Promise<void>} A promise that resolves when connection is established or already exists
 * @throws {Error} Throws if connection fails (MongoDB server unreachable, invalid URI, etc.)
 * @description Connects to MongoDB using the URI after checking URI and connection state.
 *   If already connected (readyState === 1), returns immediately without reconnecting.
 * 
 * @example
 * // Safe to call multiple times
 * await connect(); // Establishes connection
 * await connect(); // Returns immediately, no duplicate connection
 * 
 * @example
 * // Check connection state after connecting
 * await connect();
 * console.log('Connection state:', mongoose.connection.readyState);
 * // Output: Connection state: 1 (connected)
 */
async function connect(uri) {
    if (!uri) throw new Error("MongoDB URI is required. Set MONGO_URI environment variable.");
    if (mongoose.connection.readyState === 1) return;
    await mongoose.connect(uri);
}

/**
 * Closes the MongoDB database connection using Mongoose.
 * 
 * @async
 * @function disconnect
 * 
 * @returns {Promise<void>} A promise that resolves when connection is closed or already disconnected
 * @throws {Error} Throws if disconnection fails (rare, usually only network issues)
 * @description Safely disconnects from MongoDB database after checking connection state.
 *   If already disconnected (readyState === 0), returns immediately without attempting to disconnect.
 * 
 * @example
 * // Safe to call multiple times
 * await disconnect(); // Closes connection
 * await disconnect(); // Returns immediately, already disconnected
 * 
 * @example
 * // Check connection state after disconnecting
 * await disconnect();
 * console.log('Connection state:', mongoose.connection.readyState);
 * // Output: Connection state: 0 (disconnected)
 */
async function disconnect() {
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
}

module.exports = {
    connect,
    disconnect
}
