/**
 * @file MovieItem.js
 * @description Domain model representing a movie entity enriched with metadata and user-specific evaluation data.
 * @author Stanislav Snisar
 * @version 2.0.0
 * @module domain/MovieItem
 */

/**
 * Represents a movie with metadata and user-specific evaluation fields from external sources or DB.
 * It is designed to serve as a unified movie representation within the application.
 *
 * @class MovieItem
 * @param {Object} [data={}] - Optional initialization object
 * @param {string} [data._id] - Internal database ID
 * @param {string} [data.type] - Media type (e.g., 'movie', 'tv')
 * @param {string} [data.tmdbID] - TMDB ID of the movie
 * @param {string} [data.imdbID] - IMDb ID of the movie
 * @param {string} [data.imdbRating] - IMDb rating (e.g., '8.2')
 * @param {string} [data.imdbVotes] - IMDb vote count (e.g., '1,234,567')
 * @param {string} [data.commTitle] - Common or localized title
 * @param {string} [data.origTitle] - Original title
 * @param {string} [data.year] - Release year
 * @param {string} [data.duration] - Runtime duration (e.g., '139 min')
 * @param {string} [data.parental] - Parental rating (e.g., 'PG-13')
 * @param {string} [data.plot] - Plot synopsis
 * @param {string} [data.poster] - Poster image URL
 * @param {string} [data.budget] - Budget information (e.g., '$100,000,000')
 * @param {string} [data.boxOffice] - Box office earnings (e.g., '$500,000,000')
 * @param {Array<string>} [data.countries] - List of production countries
 * @param {Array<string>} [data.languages] - List of spoken languages
 * @param {Array<string>} [data.genres] - List of genre tags
 * @param {Array<string>} [data.directors] - List of director names
 * @param {Array<string>} [data.writers] - List of writer names
 * @param {Array<string>} [data.producers] - List of producer names
 * @param {Array<string>} [data.composers] - List of composer names
 * @param {Array<string>} [data.cast] - List of main cast members
 * @param {number} [data.userRating=0] - User's personal rating
 * @param {string} [data.userEvalDate] - Date of initial user evaluation
 * @param {string} [data.userChangeEvalDate] - Date of last user rating change
 * @param {boolean} [data.isFavorite=false] - Whether the user marked the movie as a favorite
 */
class MovieItem {
    constructor(data = {}) {
        // common id/type props
        this._id = data._id || undefined;
        this.type = data.type || "";
        this.tmdbID = data.tmdbID || "";
        // imdb props
        this.imdbID = data.imdbID || "";
        this.imdbRating = data.imdbRating || "";
        this.imdbVotes = data.imdbVotes || "";
        // general props
        this.commTitle = data.commTitle || "";
        this.origTitle = data.origTitle || "";
        this.year = data.year || "";
        this.duration = data.duration || "";
        this.parental = data.parental || "";
        this.plot = data.plot || "";
        this.poster = data.poster || "";
        this.budget = data.budget || "";
        this.boxOffice = data.boxOffice || "";
        // multiple common props
        this.countries = data.countries || [];
        this.languages = data.languages || [];
        this.genres = data.genres || [];
        // multiple crew props
        this.directors = data.directors || [];
        this.writers = data.writers || [];
        this.producers = data.producers || [];
        this.composers = data.composers || [];
        this.cast = data.cast || [];
        // moviestat props
        this.userRating = data.userRating || 0;
        this.userEvalDate = data.userEvalDate || "";
        this.userChangeEvalDate = data.userChangeEvalDate || "";
        this.isFavorite = data.isFavorite || false;
    }
}
module.exports = MovieItem;