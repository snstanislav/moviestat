/**
 * @file PersonItem.js
 * @description Domain model representing a person associated with a cast or crew member.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module domain/PersonItem
 */

/**
 * Represents a single person entry with descriptive information.
 *
 * @class PersonItem
 * @param {Object} [data={}] - Optional initialization object
 * @param {string} [data._id] - Internal database ID
 * @param {string} [data.tmdbID] - The person's TMDB (The Movie Database) ID
 * @param {string} [data.imdbID] - The person's IMDB (Internet Movie Database) ID
 * @param {string} [data.name] - The full name of the person
 * @param {string} [data.birthday] - The person's date of birth
 * @param {string} [data.placeOfBirth] - The city, region, or country where the person was born
 * @param {number} [data.gender=-1] - The person's gender
 * @param {string} [data.photo] - The URL to the person's photo or portrait
 * @param {string} [data.biography] - A brief biography or career summary of the person
 */
class PersonItem {
    constructor(data = {}) {
        this._id = data._id || undefined;
        this.tmdbID = data.tmdbID || "";
        this.imdbID = data.imdbID || "";
        this.name = data.name || "";
        this.birthday = data.birthday || "";
        this.placeOfBirth = data.placeOfBirth || "";
        this.gender = data.gender || -1;
        this.photo = data.photo || "";
        this.biography = data.biography || "";
    }
}
module.exports = PersonItem;