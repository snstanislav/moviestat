/**
 * @file Evaluation.js
 * @description Mongoose schema for user movie evaluations (ratings and favorites).
 *   This is an embedded subdocument schema used within the User model to track
 *   individual movie ratings, evaluation dates, and favorite status.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module models/Evaluation
 * @requires mongoose - MongoDB ODM for Node.js
 */

const mongoose = require("mongoose");

/**
 * Mongoose schema for user movie evaluation data.
 * 
 * @typedef {Object} EvaluationSchema
 * 
 * @property {mongoose.Types.ObjectId} movie - Reference to the Movie document being evaluated
 * @property {number} userRating - User's rating score for the movie
 * @property {string} userEvalDate - Timestamp of when the user first evaluated the movie
 * @property {string} userChangeEvalDate - Timestamp of the last evaluation change
 * @property {boolean} isFavorite - Flag indicating if the movie is marked as favorite
 * 
 * @description This schema is designed as an embedded subdocument (not a standalone collection).
 *   The `_id: false` option prevents Mongoose from automatically creating an _id field for each
 *   evaluation subdocument, as the parent document's _id and movie reference together provide
 *   sufficient identification.
 * 
 * @example
 * // Adding a new evaluation to a user
 * const user = await User.findById(userId);
 * user.evals.push({
 *   movie: movieId,
 *   userRating: 9,
 *   userEvalDate: new Date().toString(),
 *   isFavorite: false
 * });
 * await user.save();
 */
const evaluationSchema = new mongoose.Schema({
    movie: { type: mongoose.Types.ObjectId, ref: "Movie" },
    userRating: Number,
    userEvalDate: String,
    userChangeEvalDate: String,
    isFavorite: Boolean
}, { _id: false });

module.exports.evaluationSchema = evaluationSchema;