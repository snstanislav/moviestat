/**
 * @file evaluationService.js
 * @description Handling user movie evaluations and associated movie data.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module services/evaluationService
 *
 * @requires module:api/apiManager - Provides API methods for constructing movies from external sources.
 * @requires module:domain/EvaluationItem - Domain model representing a user's movie evaluation.
 * @requires module:models/User - Mongoose model for user documents.
 * @requires module:models/Movie - Mongoose model for movie documents.
 * @requires module:services/movieService - Provides helpers for movie insertion and person linking.
 */

const { constructMovieFromAPIs } = require("../api/apiManager");
const EvaluationItem = require("../domain/EvaluationItem");
const { User } = require("../models/User");
const { Movie } = require("../models/Movie");
const { unloadAllPersonsFromMovie, addNewMovie } = require("./movieService");

var EXISTING_LOGGED_USER;

/**
 * Retrieves a single evaluated movie entry for a specific user.
 * Populates the movie reference and its related persons (directors, writers, etc.).
 *
 * @async
 * @function getSingleEvaluatedMovie
 * @param {string} currLoggedUserID - The logged-in user's MongoDB ID.
 * @param {string} movieID - The movie's MongoDB ID.
 * @returns {Promise<Object|null>} The populated evaluation document or `null` if not found.
 */
async function getSingleEvaluatedMovie(currLoggedUserID, movieID) {
    try {
        let movieDoc = null;
        if (currLoggedUserID) {
            movieDoc = await User.findOne({ _id: currLoggedUserID },
                { evals: { $elemMatch: { movie: movieID } } },)
                .populate({
                    path: "evals.movie",
                    populate: [
                        { path: "directors.person" },
                        { path: "writers.person" },
                        { path: "producers.person" },
                        { path: "composers.person" },
                        { path: "cast.person" }
                    ]
                }).exec();
        }
        return movieDoc;
    } catch (err) {
        console.error("Error in getEvaluatedMoviesList:", err);
        return null;
    }
}

/**
 * Retrieves all evaluated movies for a given user, including nested person references.
 *
 * @async
 * @function getEvaluatedMoviesList
 * @param {string} currLoggedUserID - The logged-in user's MongoDB ID.
 * @returns {Promise<Object|null>} The user document containing populated `evals` array, or `null` if not found.
 */
async function getEvaluatedMoviesList(currLoggedUserID) {
    try {
        let userDoc = null;
        if (currLoggedUserID) {
            userDoc = await User.findById(currLoggedUserID)
                .select("evals").populate({
                    path: "evals.movie",
                    populate: [
                        { path: "directors.person" },
                        { path: "writers.person" },
                        { path: "producers.person" },
                        { path: "composers.person" },
                        { path: "cast.person" }
                    ]
                }).exec();
        }
        return userDoc;
    } catch (err) {
        console.error("Error in getEvaluatedMoviesList:", err);
        return null;
    }
}

/**
 * Evaluates a movie for a specific user.  
 * If the movie doesn’t exist in the database, it is created using data fetched from external APIs.
 *
 * @async
 * @function evaluateMovie
 * @param {string} currLoggedUserID - The logged-in user's ID.
 * @param {string} tmdbIDSearched - TMDB ID of the movie being evaluated.
 * @param {string} mediaType - The media type (`"movie"` or `"tv"`).
 * @param {number} userRating - The user's rating (typically 1–10).
 * @param {string} userEvalDate - The date the user evaluated the movie.
 * @returns {Promise<Object|undefined>} Object describing insertion status and movie ID.
 *
 * @example
 * const result = await evaluateMovie(userId, "27205", "movie", 7, "2024-10-01");
 * console.log(result.isJustInserted); // true if new evaluation added
 */
async function evaluateMovie(currLoggedUserID, tmdbIDSearched, mediaType, userRating, userEvalDate) {
    try {
        if (currLoggedUserID) {
            EXISTING_LOGGED_USER = await User.findOne({ _id: currLoggedUserID });
            if (!EXISTING_LOGGED_USER) throw `USER <${currLoggedUserID}> doesn't exist.`

            let existingMovie = await Movie.findOne({ tmdbID: tmdbIDSearched });
            if (!existingMovie) {
                existingMovie = await constructMovieFromAPIs(tmdbIDSearched, mediaType, userRating, userEvalDate);
            } else {
                console.log(`> Object construction is not needed: ${existingMovie.type.toUpperCase()} <${existingMovie.imdbID}: ${existingMovie.commTitle} (${existingMovie.year})> already exists.`);
                // Existing item from db model must be explicit converted
                existingMovie = existingMovie.toObject();
            }

            if (!existingMovie._id) {
                await unloadAllPersonsFromMovie(existingMovie);
                existingMovie = await addNewMovie(existingMovie);
            } else {
                console.log(`>> Movie "${existingMovie.commTitle}" already exists in DB!`);
            }

            if (EXISTING_LOGGED_USER.evals.some((elem) =>
                elem.movie.equals(existingMovie._id))) {
                console.log(`>>> You have already evaluated "${existingMovie.commTitle}"`);
                return {
                    isJustInserted: false,
                    movieID: existingMovie._id
                };
            } else {
                const evalItem = new EvaluationItem({
                    movie: existingMovie._id,
                    userRating: Number(userRating),
                    userEvalDate: userEvalDate,
                    userChangeEvalDate: "",
                    isFavorite: false
                });
                const saved = await appendEvaluationToUser(evalItem);
                if (saved) {
                    return {
                        isJustInserted: true,
                        movieID: saved.evals[saved.evals.length - 1].movie._id
                    };
                }
            }
        }
    } catch (err) {
        console.error("Error in evaluateMovie:", err);
    }
}

/**
 * Appends a new evaluation item to the currently loaded user document and saves it.
 *
 * @async
 * @function appendEvaluationToUser
 * @param {EvaluationItem} evalItem - The evaluation item to add.
 * @returns {Promise<Object|undefined>} The updated user document after saving.
 * 
 * @see {@link module:domain/EvaluationItem|EvaluationItem}
 */
async function appendEvaluationToUser(evalItem) {
    try {
        EXISTING_LOGGED_USER.evals.push(evalItem);
        console.log("+++ Evaluated movie successfully added to current User's enrty!");
        return await EXISTING_LOGGED_USER.save();
    } catch (err) {
        console.error("Error in appendEvaluationToUser:", err);
    }
}

/**
 * Toggles or sets the `isFavorite` property of a user's movie evaluation.
 *
 * @async
 * @function changeIsFavorite
 * @param {string} currLoggedUserID - The user's ID.
 * @param {string} movieID - The movie's ID.
 * @param {boolean} isFavorite - Whether the movie is marked as favorite.
 * @returns {Promise<boolean|undefined>} True if the update was successful.
 */
async function changeIsFavorite(currLoggedUserID, movieID, isFavorite) {
    const evalItem = new EvaluationItem({
        movie: movieID,
        userRating: undefined,
        userEvalDate: undefined,
        userChangeEvalDate: undefined,
        isFavorite: isFavorite
    });
    return await performEvaluationChanging(currLoggedUserID, evalItem);
}

/**
 * Updates the user’s rating for a specific movie.
 *
 * @async
 * @function changeEvaluation
 * @param {string} currLoggedUserID - The user's ID.
 * @param {string} movieID - The movie's ID.
 * @param {number} newUserRating - The updated rating value.
 * @param {string} userChangeEvalDate - The timestamp for when the rating was changed.
 * @returns {Promise<boolean|undefined>} True if the update was performed, otherwise false or undefined.
 */
async function changeEvaluation(currLoggedUserID, movieID, newUserRating, userChangeEvalDate) {
    const evalItem = new EvaluationItem({
        movie: movieID,
        userRating: newUserRating,
        userEvalDate: undefined,
        userChangeEvalDate: userChangeEvalDate,
        isFavorite: undefined
    });
    return await performEvaluationChanging(currLoggedUserID, evalItem);
}

/**
 * Performs a generic evaluation modification (rating or favorite flag).
 *
 * @async
 * @function performEvaluationChanging
 * @param {string} currLoggedUserID - The user's ID.
 * @param {EvaluationItem} evalItem - The updated evaluation item.
 * @returns {Promise<boolean|undefined>} True if the database was updated successfully.
 * 
 * @see {@link module:domain/EvaluationItem|EvaluationItem}
 */
async function performEvaluationChanging(currLoggedUserID, evalItem) {
    try {
        if (!EXISTING_LOGGED_USER || !EXISTING_LOGGED_USER._id.equals(currLoggedUserID)) {
            console.log(`EXISTING_LOGGED_USER: ${EXISTING_LOGGED_USER}. Extracting from DB...`);
            EXISTING_LOGGED_USER = await User.findOne({ _id: currLoggedUserID });
        }
        if (EXISTING_LOGGED_USER) {
            let currEval = EXISTING_LOGGED_USER.evals.find((elem) =>
                elem.movie.equals(evalItem.movie));

            if (!currEval || currEval.userRating !== evalItem.userRating || currEval.isFavorite !== evalItem.isFavorite) {
                await User.updateOne({ _id: currLoggedUserID },
                    {
                        $set: {
                            "evals.$[elem].userRating": evalItem.userRating,
                            "evals.$[elem].userChangeEvalDate": evalItem.userChangeEvalDate,
                            "evals.$[elem].isFavorite": evalItem.isFavorite
                        }
                    },
                    { arrayFilters: [{ "elem.movie": evalItem.movie }] });
                console.log(`*** User <${EXISTING_LOGGED_USER.login}>:\n++ Evaluation modifying was performed. OLD:\n${JSON.stringify(currEval, " ", 2)},\nNEW:\n${JSON.stringify(evalItem, " ", 2)}.`);
                return true;
            } else {
                console.log(`>>> User <${EXISTING_LOGGED_USER.login}>:\nEvaluation wasn't changed. CURRENT value\n ${JSON.stringify(currEval, " ", 2)}\n is the SAME as the NEW one:\n ${JSON.stringify(evalItem, " ", 2)}.`);
            }
        }
    } catch (err) {
        console.error("Error in changeUserEvaluation. The movie seems not to be evaluated yet.\n", err);
    }
}

/**
 * Deletes a user's evaluation for a specific movie.
 *
 * @async
 * @function deleteEvaluation
 * @param {string} currLoggedUserID - The user's ID.
 * @param {string} movieID - The movie's ID to remove from evaluations.
 * @returns {Promise<boolean|undefined>} True if the evaluation was successfully removed, otherwise false.
 */
async function deleteEvaluation(currLoggedUserID, movieID) {
    try {
        let userDoc = null;
        if (currLoggedUserID) {
            userDoc = await User.findById(currLoggedUserID).select("evals");
            const initLength = userDoc.evals.length;

            const index = userDoc.evals.findIndex(elem => elem.movie.toString() === movieID);
            if (index !== -1) {
                userDoc.evals.splice(index, 1);
            }
            const result = await userDoc.save();
            return initLength - result.evals.length === 1 ? true : false;
        }
        return;
    } catch (err) {
        console.error("Error in getEvaluatedMoviesList:", err);
    }
}

module.exports = {
    getSingleEvaluatedMovie,
    getEvaluatedMoviesList,
    evaluateMovie,
    changeIsFavorite,
    changeEvaluation,
    deleteEvaluation
}