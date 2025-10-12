const express = require("express");
const mongoose = require("mongoose");
const { performMovieSearch } = require("../services/movieService");
const { evaluateMovie } = require("../services/evaluationService");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        const result = await performMovieSearch(search, 1);
        if (result) {
            return res.status(200).json({
                success: true,
                message: "Movie serach result is ready",
                data: result
            });
        }
        return res.status(404).json({ success: false, message: "No results found" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/rate", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const { tmdbIDSearched, mediaType, userRating, userEvalDate } = req.body;
        const resultObj = await evaluateMovie(userID, tmdbIDSearched, mediaType, userRating, userEvalDate);
        if (resultObj) {
            return res.status(200).json({ success: true, message: "Evaluation successfully added!", data: resultObj });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;