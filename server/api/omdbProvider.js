/**
 * @file omdbProvider.js
 * @description Module provides nesessary interacting with The Open Movie Database (OMDB) API.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module api/omdbProvider
 * @requires dotenv - For loading environment variables
 */

require("dotenv").config();
const { fetchWithRetry } = require("./utils");

/**
 * Retrieves detailed information about a specific movie, TV series, or episode from OMDB by IMDb ID.
 * 
 * @async
 * @function extractMedia
 * @param {string} imdbMovieID - The IMDb ID of the media (e.g., 'tt0088763')
 * 
 * @returns {Promise<Object|undefined>} A promise that resolves to the media details object containing:
 *   - {string} Title - Media title
 *   - {string} Year - Release year or year range for TV series (e.g., '1999' or '2011-2019')
 *   - {string} Rated - Content rating (e.g., 'PG-13', 'R', 'TV-MA', 'N/A')
 *   - {string} Released - Release date (e.g., '15 Oct 1999')
 *   - {string} Runtime - Runtime (e.g., '139 min', 'N/A')
 *   - {string} Genre - Comma-separated genres (e.g., 'Drama, Thriller')
 *   - {string} Director - Director name(s) (e.g., 'David Fincher')
 *   - {string} Writer - Writer name(s), comma-separated
 *   - {string} Actors - Main actors, comma-separated
 *   - {string} Plot - Plot synopsis
 *   - {string} Language - Languages, comma-separated
 *   - {string} Country - Countries, comma-separated
 *   - {string} Awards - Awards and nominations summary
 *   - {string} Poster - Poster image URL or 'N/A'
 *   - {Array<Object>} Ratings - Array of rating objects with properties:
 *     - {string} Source - Rating source (e.g., 'Internet Movie Database', 'Rotten Tomatoes', 'Metacritic')
 *     - {string} Value - Rating value (e.g., '8.8/10', '79%', '66/100')
 *   - {string} Metascore - Metacritic score (0-100) or 'N/A'
 *   - {string} imdbRating - IMDb rating (0.0-10.0) or 'N/A'
 *   - {string} imdbVotes - Number of IMDb votes with commas (e.g., '2,234,567')
 *   - {string} imdbID - IMDb ID (e.g., 'tt0137523')
 *   - {string} Type - Media type ('movie', 'series', or 'episode')
 *   - {string} DVD - DVD release date or 'N/A'
 *   - {string} BoxOffice - Box office earnings (e.g., '$37,030,102') or 'N/A'
 *   - {string} Production - Production company or 'N/A'
 *   - {string} Website - Official website URL or 'N/A'
 *   - {string} Response - API response status ('True' or 'False')
 *   - **For TV series only:**
 *     - {string} totalSeasons - Total number of seasons
 *   - **For episodes only:**
 *     - {string} Season - Season number
 *     - {string} Episode - Episode number
 *     - {string} seriesID - IMDb ID of the parent series
 * 
 * @returns {Promise<undefined>} Returns undefined if an error occurs
 * @throws {Error} Throws if the API request fails or network error occurs
 * @description Fetches comprehensive information about a movie, TV series, or episode from OMDB
 * using the IMDb ID. This is useful for additional information not available in TMDB 
 * (imdbRating, imdbVotes, etc.)
 * 
 * **Important notes:**
 * - Many fields may contain 'N/A' if data is not available
 * - All numeric values are returned as strings, not numbers
 * - Ratings array may be empty if no external ratings exist
 * - For specific episodes, use the episode's IMDb ID
 * 
 * @example
 * const movie = await extractMedia('tt0088763');
 * 
 * @see {@link https://www.omdbapi.com/#parameters|OMDB API Parameters}
 */
async function extractMedia(imdbMovieID) {
    const urlMovie = `https://www.omdbapi.com/?i=${imdbMovieID}&apikey=${process.env.OMDB_API_KEY}`;
    try {
        return await fetchWithRetry(urlMovie)
    } catch (err) {
        const error = new Error(`OMDB API error <extractMedia>: ${err.message}`);
        error.source = 'omdb';
        error.originalError = err;
        throw error;
    }
}

module.exports.extractMedia = extractMedia;