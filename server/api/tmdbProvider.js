/**
 * @file tmdbProvider.js
 * @description Module provides nesessary interacting with The Movie Database (TMDB) API.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module api/tmdbProvider
 * @requires dotenv - For loading environment variables
 */

require("dotenv").config();
const { fetchWithRetry } = require("./utils");

/**
 * Represents keywords to extract necessary data from a response 
 */
const LABELS = {
    DIRECTOR: ["Director"],
    SCREENPLAY: ["Screenplay", "Writer"],
    PRODUCER: ["Executive Producer", "Producer"],
    COMPOSER: ["Original Music Composer"]
}

/**
 * Defines standard request options for TMDB REST API
 */
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
    }
};

/**
 * Searches for movies, TV shows, and people on TMDB based on a query string.
 * 
 * @async
 * @function extractSearchResults
 * @param {string} query - The search query string from user input
 * @param {number} page - The page number for paginated results
 * @returns {Promise<Object|undefined>} A promise that resolves to the search results object containing:
 *   - {number} page - Current page number
 *   - {Array<Object>} results - Array of search result objects
 *   - {number} total_pages - Total number of pages available
 *   - {number} total_results - Total number of results found
 * @returns {Promise<undefined>} Returns undefined if an error occurs
 * @throws {Error} Throws if the API request fails or network error occurs
 * @description Performs a multi-search across movies, TV shows, and people on TMDB. Adult content is excluded from results. Results are returned in English.
 * 
 * @example
 * const results = await extractSearchResults('Inception', 1);
 * 
 * @see {@link https://developer.themoviedb.org/reference/search-multi|TMDB Multi Search API}
 */
async function extractSearchResults(query, page) {
    const urlSearch = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`;
    try {
        return await fetchWithRetry(urlSearch, options);
    } catch (err) {
        const error = new Error(`TMDB API error <extractSearchResults>: ${err.message}`);
        error.source = 'tmdb';
        error.originalError = err;
        throw error;
    }
}

/**
 * Retrieves detailed information about a specific movie or TV show from TMDB.
 * 
 * @async
 * @function extractMedia
 * @param {string} tmdbID - The TMDB ID of the movie or TV show
 * @param {('movie'|'tv')} mediaType - The type of media
 * @returns {Promise<Object|undefined>} A promise that resolves to the media details object.
 * 
 * **For movies**, returns an object containing:
 *   - {boolean} adult - Adult content flag
 *   - {string} backdrop_path - Backdrop image path (partial URL)
 *   - {number} budget - Production budget in USD
 *   - {Array<Object>} genres - Array of genre objects (id, name)
 *   - {string} homepage - Official website URL
 *   - {number} id - TMDB movie ID
 *   - {string} imdb_id - IMDb ID (e.g., 'tt0137523')
 *   - {Array<string>} origin_country - Array of origin country codes
 *   - {string} original_language - ISO 639-1 language code
 *   - {string} original_title - Original movie title
 *   - {string} overview - Plot synopsis
 *   - {number} popularity - Popularity score
 *   - {string} poster_path - Poster image path (partial URL)
 *   - {Array<Object>} production_companies - Production companies
 *   - {Array<Object>} production_countries - Production countries
 *   - {string} release_date - Release date (YYYY-MM-DD)
 *   - {number} revenue - Box office revenue in USD
 *   - {number} runtime - Runtime in minutes
 *   - {Array<Object>} spoken_languages - Spoken languages
 *   - {string} status - Release status ('Released', 'Post Production', etc.)
 *   - {string} tagline - Movie tagline
 *   - {string} title - Movie title
 *   - {boolean} video - Video flag
 *   - {number} vote_average - Average rating (0-10)
 *   - {number} vote_count - Number of votes
 * 
 * **For TV shows**, returns an object containing:
 *   - {boolean} adult - Adult content flag
 *   - {string} backdrop_path - Backdrop image path (partial URL)
 *   - {Array<Object>} created_by - Array of creator objects
 *   - {Array<number>} episode_run_time - Array of episode runtimes
 *   - {string} first_air_date - First air date (YYYY-MM-DD)
 *   - {Array<Object>} genres - Array of genre objects (id, name)
 *   - {string} homepage - Official website URL
 *   - {number} id - TMDB TV show ID
 *   - {string} imdb_id - IMDb ID (fetched via additional request to external_ids endpoint)
 *   - {boolean} in_production - Production status flag
 *   - {Array<string>} languages - Array of language codes
 *   - {string} last_air_date - Last air date (YYYY-MM-DD)
 *   - {Object} last_episode_to_air - Last episode details
 *   - {string} name - TV show name
 *   - {Object|null} next_episode_to_air - Next episode details or null
 *   - {Array<Object>} networks - Broadcasting networks
 *   - {number} number_of_episodes - Total episodes
 *   - {number} number_of_seasons - Total seasons
 *   - {Array<string>} origin_country - Origin countries
 *   - {string} original_language - ISO 639-1 language code
 *   - {string} original_name - Original TV show name
 *   - {string} overview - Plot synopsis
 *   - {number} popularity - Popularity score
 *   - {string} poster_path - Poster image path (partial URL)
 *   - {Array<Object>} production_companies - Production companies
 *   - {Array<Object>} production_countries - Production countries
 *   - {Array<Object>} seasons - Array of season objects
 *   - {Array<Object>} spoken_languages - Spoken languages
 *   - {string} status - Status ('Returning Series', 'Ended', etc.)
 *   - {string} tagline - TV show tagline
 *   - {string} type - Type ('Scripted', 'Documentary', etc.)
 *   - {number} vote_average - Average rating (0-10)
 *   - {number} vote_count - Number of votes
 * 
 * @returns {Promise<undefined>} Returns undefined if an error occurs
 * @throws {Error} Throws if the API request fails or network error occurs
 * @description Fetches comprehensive details for a movie or TV show. For TV series,
 *   the imdb_id is not included in the main response, so an additional request is made
 *   to the external_ids endpoint to retrieve it.
 * 
 * @example
 * const movie = await extractMedia('603', 'movie');
 * @example
 * const tvShow = await extractMedia('4087', 'tv');
 * 
 * @see {@link https://developer.themoviedb.org/reference/movie-details|TMDB Movie Details API}
 * @see {@link https://developer.themoviedb.org/reference/tv-series-details|TMDB TV Details API}
 */
async function extractMedia(tmdbID, mediaType) {
    const urlMedia = `https://api.themoviedb.org/3/${mediaType}/${tmdbID}`;
    try {
        const content = await fetchWithRetry(urlMedia, options);
        // TV-series details provide no 'imdb_id' prop - additional request is needed
        if (!content.imdb_id) {
            const urlExternals = `https://api.themoviedb.org/3/${mediaType}/${tmdbID}/external_ids`;
            const obj = await fetchWithRetry(urlExternals, options);
            content.imdb_id = obj.imdb_id;
        }
        return content;
    } catch (err) {
        const error = new Error(`TMDB API error <extractMedia>: ${err.message}`);
        error.source = 'tmdb';
        error.originalError = err;
        throw error;
    }
}

/**
 * Retrieves cast and crew credits for a specific movie or TV show from TMDB.
 * 
 * @async
 * @function extractCredits
 * @param {string} tmdbID - The TMDB ID of the movie or TV show
 * @param {('movie'|'tv')} mediaType - The type of media
 * 
 * @returns {Promise<Object>} A promise that resolves to the credits object containing:
 *   - {number} id - TMDB ID of the media
 *   - {Array<Object>} cast - Array of cast member objects with properties:
 *     - {boolean} adult - Adult content flag
 *     - {number} gender - Gender (0=not set, 1=female, 2=male, 3=non-binary)
 *     - {number} id - Actor's TMDB ID
 *     - {string} known_for_department - Primary department (typically 'Acting')
 *     - {string} name - Actor's name
 *     - {string} original_name - Original name in native language
 *     - {number} popularity - Popularity score
 *     - {string|null} profile_path - Profile image path (partial URL) or null if no image
 *     - {number} cast_id - Unique cast identifier for this credit
 *     - {string} character - Character name portrayed
 *     - {string} credit_id - Unique credit identifier (can be used with /credit/{id} endpoint)
 *     - {number} order - Billing order (0 = top billing, incrementing for lower billing positions)
 * 
 *   - {Array<Object>} crew - Array of crew member objects with properties:
 *     - {boolean} adult - Adult content flag
 *     - {number} gender - Gender (0=not set, 1=female, 2=male, 3=non-binary)
 *     - {number} id - Crew member's TMDB ID
 *     - {string} known_for_department - Primary department (e.g., 'Directing', 'Writing', 'Production')
 *     - {string} name - Crew member's name
 *     - {string} original_name - Original name in native language
 *     - {number} popularity - Popularity score
 *     - {string|null} profile_path - Profile image path (partial URL) or null if no image
 *     - {string} credit_id - Unique credit identifier
 *     - {string} department - Department name (e.g., 'Directing', 'Writing', 'Production', 'Camera', 'Editing')
 *     - {string} job - Specific job title (e.g., 'Director', 'Screenplay', 'Producer', 'Director of Photography')
 * 
 * @throws {Error} Throws if the API request fails or network error occurs.
 * @description Fetches complete cast and crew information for a movie or TV show in English.
 * 
 * @example
 * const credits = await extractCredits('4087', 'tv');
 * 
 * @see {@link https://developer.themoviedb.org/reference/movie-credits|TMDB Movie Credits API}
 * @see {@link https://developer.themoviedb.org/reference/tv-series-credits|TMDB TV Credits API}
 */
async function extractCredits(tmdbID, mediaType) {
    const urlCastCrew = `https://api.themoviedb.org/3/${mediaType}/${tmdbID}/credits?language=en-US`;
    try {
        return await fetchWithRetry(urlCastCrew, options);
    } catch (err) {
        const error = new Error(`TMDB API error <extractCredits>: ${err.message}`);
        error.source = 'tmdb';
        error.originalError = err;
        throw error;
    }
}

/**
 * Retrieves detailed information about a specific person (cast or crew member) from TMDB.
 * 
 * @async
 * @function extractPerson
 * @param {string} tmdbPersonID - The TMDB ID of the person
 * 
 * @returns {Promise<Object>} A promise that resolves to the person details object containing:
 *   - {boolean} adult - Adult flag
 *   - {Array<string>} also_known_as - Array of alternative names and aliases
 *   - {string} biography - Biographical information and career summary
 *   - {string|null} birthday - Birth date in YYYY-MM-DD format, or null if unknown
 *   - {string|null} deathday - Death date in YYYY-MM-DD format, or null if alive or unknown
 *   - {number} gender - Gender code:
 *     - 0 = Not set / not specified
 *     - 1 = Female
 *     - 2 = Male
 *     - 3 = Non-binary
 *   - {string|null} homepage - Official personal or professional website URL, or null if none
 *   - {number} id - TMDB person ID
 *   - {string} imdb_id - IMDb ID, or empty string if not available
 *   - {string} known_for_department - Primary department of work (e.g., 'Acting', 'Directing', 'Writing', 'Production')
 *   - {string} name - Person's full name as displayed on TMDB
 *   - {string|null} place_of_birth - Birthplace, or null if unknown
 *   - {number} popularity - Popularity score (floating-point number, higher = more popular)
 *   - {string|null} profile_path - Profile image path (partial URL to be combined with image base URL), or null if no image
 * 
 * @throws {Error}  Throws if the API request fails or network error occurs.
 * @description Fetches comprehensive biographical and professional information about a person.
 * 
 * @example
 *   const person = await extractPerson('287');
 * 
 * @see {@link https://developer.themoviedb.org/reference/person-details|TMDB Person Details API}
 */
async function extractPerson(tmdbPersonID) {
    const urlPerson = `https://api.themoviedb.org/3/person/${tmdbPersonID}`;
    try {
        return await fetchWithRetry(urlPerson, options);
    } catch (err) {
        const error = new Error(`TMDB API error <extractPerson>: ${err.message}`);
        error.source = 'tmdb';
        error.originalError = err;
        throw error;
    }
}

module.exports = {
    LABELS,
    extractSearchResults,
    extractMedia,
    extractCredits,
    extractPerson
}