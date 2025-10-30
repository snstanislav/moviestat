/**
 * @file indexRoutes.js
 * @description Express router for the main (index) route of the application.
 * Handles requests for fetching the list of movies evaluated by the currently authenticated user.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module routes/indexRoutes
 *
 * @requires express - Express framework for routing
 * @requires mongoose - For working with MongoDB ObjectId
 * @requires module:services/evaluationService - Provides movie evaluation-related data
 * @requires module:middleware/auth - JWT authentication middleware
 */

const express = require("express");
const mongoose = require("mongoose");
const { getEvaluatedMoviesList } = require("../services/evaluationService");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route GET /
 * @summary Retrieves the list of movies evaluated by the authenticated user.
 * @middleware auth() - Ensures the request is made by an authenticated user.
 * @returns {JSON} 200 - List of evaluated movies for the current user
 * @returns {JSON} 401 - Unauthorized (if user not authenticated)
 * @returns {JSON} 500 - Internal server error
 *
 * @example
 * // Request (authenticated):
 * GET /
 * Cookie: token=<JWT_TOKEN>
 *
 * // Response:
 * {
 *   "success": true,
 *   "data": {
 *     "evals": [
 *       {
 *         "movie": {
 *           "commTitle": "Inception",
 *           "year": 2010,
 *           ...
 *         },
 *         "userRating": 7,
 *         "isFavorite": true
 *       }
 *     ]
 *   }
 * }
 */
router.get("/", auth(), async (req, res) => {
    const evalList = await getGeneralEvalList(req.user.id);
    if (evalList) {
        return res.status(200).json({ success: true, data: evalList });
    } else {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

/**
 * @function getGeneralEvalList
 * @description Helper function for retrieving all evaluated movies for a given user.
 * @private
 *
 * @param {string} currUserId - MongoDB ObjectId of the current logged-in user
 * @returns {Promise<Object|null>} User document containing evaluations, or null on error
 */
async function getGeneralEvalList(currUserId) {
    try {
        const userID = new mongoose.Types.ObjectId(currUserId)
        const evalList = await getEvaluatedMoviesList(userID);

        return evalList;
    } catch (err) {
        console.error("Error fetching evals:", err);
        return;
    }
}

module.exports = router;