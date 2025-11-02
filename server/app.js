/**
 * @file app.js
 * @description Main entry point for the Movie Evaluation API server.
 * Sets up Express, connects to MongoDB, mounts routes, handles CORS and cookies,
 * and gracefully shuts down on process termination.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module app
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { sanitizeDeep } = require("./middleware/sanitize");
const { connect, disconnect } = require("./db/connection");
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const evalRoutes = require("./routes/evalRoutes");
const mediaRoutes = require("./routes/mediaRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));
app.use((req, res, next) => {
    req.body = sanitizeDeep(req.body);
    req.query = sanitizeDeep(req.query);
    req.params = sanitizeDeep(req.params);
    next();
});

app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/eval", evalRoutes);
app.use("/media", mediaRoutes);

(async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }
        await connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB!");

        app.listen(PORT, () => {
            console.log(`Server listening on port ${PORT}`)
        });
    } catch (err) {
        console.error("App connection error...\n", err);
        process.exit(1);
    }
})();

process.on("SIGINT", async () => {
    console.log("\nShutting down...");
    await disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
});
