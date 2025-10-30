/**
 * @file mediaRoutes.js
 * @description Express router for managing a user's individual movie or TV media evaluations.
 * Provides endpoints to fetch, modify, mark as favorite, or delete a single evaluated media entry.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module routes/mediaRoutes
 *
 * @requires express - Express framework for defining routes
 * @requires mongoose - For working with MongoDB ObjectId
 * @requires module:services/evaluationService - Evaluation-related service functions
 * @requires module:middleware/auth - JWT authentication middleware
 */

const express = require("express");
const mongoose = require("mongoose");
const { getSingleEvaluatedMovie, changeIsFavorite, changeEvaluation, deleteEvaluation } = require("../services/evaluationService");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route GET /:id
 * @summary Retrieves a single evaluated media item (movie or TV show) for the logged-in user.
 * @middleware auth() - Ensures the request is made by an authenticated user.
 * @param {string} req.params.id - MongoDB ObjectId of the evaluated media.
 * @returns {JSON} 200 - Returns the full evaluated media data with populated person references.
 * @returns {JSON} 401 - Unauthorized if token is invalid or missing.
 * @returns {JSON} 500 - Server error if query fails.
 *
 * @example
 * GET /media/671cd9b3a45f34d21c...
 * Cookie: token=<JWT_TOKEN>
 *
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "evals": [{
 *       "movie": {
 *         "commTitle": "Interstellar",
 *         "year": 2014,
 *         "directors": [{ "person": { "name": "Christopher Nolan" } }],
 *         ...
 *       },
 *       "userRating": 10,
 *       "isFavorite": true
 *     }]
 *   }
 * }
 */
router.get("/:id", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const mediaID = req.params.id;
        const evaluatedSingleMedia = await getSingleEvaluatedMovie(userID, mediaID);
        return res.json({ success: true, data: evaluatedSingleMedia });
    } catch (err) {
        console.error("Error fetching single evaluation:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * @route POST /favorite
 * @summary Updates the “favorite” status of a user's evaluated media.
 * @middleware auth() - Requires valid authentication.
 * @param {string} req.body.mediaID - MongoDB ObjectId of the evaluated media.
 * @param {boolean} req.body.isFavorite - New favorite status.
 * @returns {JSON} 200 - Success message when status is updated.
 * @returns {JSON} 401 - Unauthorized if token is invalid.
 * @returns {JSON} 500 - Server error.
 */
router.post("/favorite", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const { mediaID, isFavorite } = req.body;
        const result = await changeIsFavorite(userID, mediaID, isFavorite);
        if (result) return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error changing favorite status:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * @route POST /change
 * @summary Updates a user’s existing evaluation (rating) for a given media.
 * @middleware auth() - Requires valid authentication.
 * @param {string} req.body.mediaID - MongoDB ObjectId of the evaluated media.
 * @param {number} req.body.newUserRating - The updated user rating value.
 * @param {string} req.body.userChangeEvalDate - Date string for when the change was made.
 * @returns {JSON} 200 - Indicates successful update.
 * @returns {JSON} 500 - Server error on failure.
 */
router.post("/change", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const { mediaID, newUserRating, userChangeEvalDate } = req.body;
        const result = await changeEvaluation(userID, mediaID, newUserRating, userChangeEvalDate);
        if (result) return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error changing evaluation:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * @route POST /delete
 * @summary Deletes an evaluation for a given media from the user’s account.
 * @middleware auth() - Requires valid authentication.
 * @param {string} req.body.mediaID - MongoDB ObjectId of the evaluated media.
 * @returns {JSON} 200 - Success message when evaluation is deleted.
 * @returns {JSON} 500 - Server error if operation fails.
 */
router.post("/delete", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const { mediaID } = req.body;
        const result = await deleteEvaluation(userID, mediaID);
        if (result) return res.status(200).json({ success: true, message: "Evaluation successfully DELETED" });
    } catch (err) {
        console.error("Error deleting evaluation:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;