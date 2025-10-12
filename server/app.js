require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { connect, disconnect } = require("./db/connection");
const indexRoutes = require("./routes/indexRoutes");
const authRoutes = require("./routes/authRoutes");
const evalRoutes = require("./routes/evalRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", credentials: true }));

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
