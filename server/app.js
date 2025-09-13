const express = require("express");
const path = require("path");
const { connect, disconnect } = require("./db/connection");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.json("TEST");
});

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
    console.log("\nShutting down...")
    await disconnect();
    console.log("Disconnected from MongoDB.")
    process.exit(0);
});
