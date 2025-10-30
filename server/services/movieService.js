/**
 * @file movieService.js
 * @description Responsible for handling movie-related operations.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module services/movieService
 *
 * @requires module:api/apiManager - Provides API methods for fetching movie search results.
 * @requires module:domain/MovieItem - Domain model representing a movie entity.
 * @requires module:models/Movie - Mongoose model for storing movies in MongoDB.
 * @requires module:services/personService - Service module for handling related person entities.
 */

const { getMovieSearchResult } = require("../api/apiManager");
const MovieItem = require("../domain/MovieItem");
const { Movie } = require("../models/Movie");
const { addNewPerson } = require("./personService");

const SEARCH_RESULT_CACHE = new Map();

/**
 * Performs a movie search query using the external API.
 * Uses an in-memory cache (`SEARCH_RESULT_CACHE`) to store recent search results
 * to reduce redundant API calls for the same query.
 *
 * @async
 * @function performMovieSearch
 * @param {string} query - The search query string (e.g., movie title).
 * @param {number} page - The page number for paginated results.
 * @returns {Promise<Object>} API response object containing movie search results.
 *
 * @example
 * const results = await performMovieSearch("Inception", 1);
 * console.log(results.results.length); // e.g. 20
 */
async function performMovieSearch(query, page) {
    let cacheKey = query.trim() + "#" + page;
    if (SEARCH_RESULT_CACHE.has(cacheKey)) {
        return SEARCH_RESULT_CACHE.get(cacheKey)
    } else {
        const result = await getMovieSearchResult(query, page);
        SEARCH_RESULT_CACHE.set(cacheKey, result);
        return result;
    }
}

/**
 * Ensures all persons related to a given movie are stored in the database,
 * replacing person objects with their corresponding database `_id` references.
 * This includes directors, writers, producers, composers, and cast members.
 *
 * @async
 * @function unloadAllPersonsFromMovie
 * @param {Object} existingMovie - The movie object containing arrays of related person references.
 * @returns {Promise<void>}
 */
async function unloadAllPersonsFromMovie(existingMovie) {
    try {
        for (let i = 0; i < existingMovie.directors.length; i++) {
            const res = await addNewPerson(existingMovie.directors[i].person);
            if (res) {
                existingMovie.directors[i].person = res._id;
            }
        }
        for (let i = 0; i < existingMovie.writers.length; i++) {
            const res = await addNewPerson(existingMovie.writers[i].person);
            if (res) {
                existingMovie.writers[i].person = res._id;
            }
        }
        for (let i = 0; i < existingMovie.producers.length; i++) {
            const res = await addNewPerson(existingMovie.producers[i].person);
            if (res) {
                existingMovie.producers[i].person = res._id;
            }
        }
        for (let i = 0; i < existingMovie.composers.length; i++) {
            const res = await addNewPerson(existingMovie.composers[i].person);
            if (res) {
                existingMovie.composers[i].person = res._id;
            }
        }
        for (let i = 0; i < existingMovie.cast.length; i++) {
            const res = await addNewPerson(existingMovie.cast[i].person);
            if (res) {
                existingMovie.cast[i].person = res._id;
            }
        }
    } catch (err) {
        console.error("Error in <unloadAllPersonsFromMovie>:", err);
    }
}

/**
 * Adds a new movie record to the database if it does not already exist.
 * Checks for an existing movie by its `tmdbID` and, if not found, inserts a new record.
 *
 * @async
 * @function addNewMovie
 * @param {MovieItem} newMovie - The movie to be added.
 * @returns {Promise<Object|null>} The created or existing movie document, or `null` if an error occurs.
 *
 * @example
 * const { addNewMovie } = require("./services/movieService");
 * const newMovie = new MovieItem({...});
 * const created = await addNewMovie(newMovie);
 * console.log(created?.title); // => "Inception"
 * 
 * @see {@link module:domain/MovieItem|MovieItem}
 */
async function addNewMovie(newMovie) {
    try {
        let existing = await Movie.findOne({ tmdbID: newMovie.tmdbID });
        if (existing) {
            console.log(`>> ${existing.type} <${existing.imdbID}: ${existing.name}(${existing.year})> already exists.`);
            return existing;
        }
        if (newMovie instanceof MovieItem) {
            const res = await Movie.create(newMovie);
            if (res) console.log("++ Movie inserted into DB!");
            return res;
        }
        return;
    } catch (err) {
        console.error("Error in <addNewMovie>:", err);
        return null;
    }
}

module.exports = {
    performMovieSearch,
    unloadAllPersonsFromMovie,
    addNewMovie
}