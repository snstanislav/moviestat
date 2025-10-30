/**
 * @file evalRoutes.js
 * @description Express router for handling movie evaluation and search endpoints.
 * Provides endpoints for searching movies and allowing authenticated users to rate/evaluate them.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module routes/evalRoutes
 *
 * @requires express - Express framework for routing
 * @requires mongoose - For working with MongoDB ObjectId
 * @requires module:services/movieService - Provides movie search and related logic
 * @requires module:services/evaluationService - Handles evaluation (rating) operations
 * @requires module:middleware/auth - JWT authentication middleware
 */

const express = require("express");
const mongoose = require("mongoose");
const { performMovieSearch } = require("../services/movieService");
const { evaluateMovie } = require("../services/evaluationService");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route GET /eval
 * @summary Searches for movies by title using an external API.
 * @param {string} req.query.search - The search query (movie title or keyword)
 * @returns {JSON} 200 - Search results with success message
 * @returns {JSON} 404 - No results found
 * @returns {JSON} 500 - Internal server error
 */
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

/**
 * @route POST /eval/rate
 * @summary Allows an authenticated user to evaluate (rate) a movie.
 * @middleware auth() - Ensures the user is logged in
 * @param {string} req.body.tmdbIDSearched - TMDB movie ID of the evaluated movie
 * @param {string} req.body.mediaType - Type of media (e.g., "movie" or "tv")
 * @param {number} req.body.userRating - The user's rating (typically 1–10)
 * @param {string} req.body.userEvalDate - Date when the evaluation was made
 * @returns {JSON} 200 - Evaluation successfully added
 * @returns {JSON} 401 - Unauthorized (if no valid token)
 * @returns {JSON} 500 - Internal server error
 *
 * @example
 * // Request:
 * POST /eval/rate
 * {
 *   "tmdbIDSearched": "27205",
 *   "mediaType": "movie",
 *   "userRating": 7,
 *   "userEvalDate": "2025-10-28"
 * }
 *
 * // Response:
 * {
 *   "success": true,
 *   "message": "Evaluation successfully added!",
 *   "data": {
 *      "isJustInserted": true,
 *      "movieID": "674fa2b5b84b3c0012b05f13"
 *   }
 * }
 */
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