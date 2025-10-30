/**
 * @file EvaluationItem.js
 * @description Domain model representing a user's evaluation of a movie.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module domain/EvaluationItem
 */

/**
 * Represents a single evaluation entry of user-specific metadata about a movie.
 * 
 * @class EvaluationItem
 * @param {Object} [data={}] - Optional initialization object
 * @param {Object} data.movie - The movie internal database ID
 * @param {number} [data.userRating] - The user's rating for the movie
 * @param {string} [data.userEvalDate] - The date the user first evaluated the movie.
 * @param {string} [data.userChangeEvalDate] - The date the user last changed their evaluation.
 * @param {boolean} [data.isFavorite] - Whether the user marked the movie as a favorite.
 */
class EvaluationItem {
    constructor(data = {}) {
        this.movie = data.movie;
        this.userRating = data.userRating;
        this.userEvalDate = data.userEvalDate;
        this.userChangeEvalDate = data.userChangeEvalDate;
        this.isFavorite = data.isFavorite;
    }
}
module.exports = EvaluationItem;