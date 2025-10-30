/**
 * @file SearchItem.js
 * @description Domain model representing a single search result item, which can be a movie or TV show entry.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module domain/SearchItem
 */

/**
 * Represents a single search result entry returned from a database or API query.
 *
 * @class SearchItem
 * @param {Object} [data={}] - Optional initialization object
 * @param {string} [data.tmdbID] - The TMDB ID or other unique external identifier for the item
 * @param {string} [data.title] - The title of the movie or TV show
 * @param {string} [data.type] - The type of the item (e.g., "movie", "tv")
 * @param {string} [data.year] - The release or air year of the item
 * @param {string} [data.poster] - The URL or path to the item's poster image
 * @param {string} [data.overview] - A short summary or description of the item
 */
class SearchItem {
    constructor(data = {}) {
        this.tmdbID = data.tmdbID || "";
        this.title = data.title || "";
        this.type = data.type || "";
        this.year = data.year || "";
        this.poster = data.poster || "";
        this.overview = data.overview || "";
    }
}
module.exports = SearchItem;