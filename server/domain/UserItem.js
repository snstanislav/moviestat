/**
 * @file UserItem.js
 * @description Domain model representing a registered user within the system, including credentials, profile data, and evaluation records.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module domain/UserItem
 */

/**
 * Represents a single user entity in the application.
 *
 * @class UserItem
 * @param {Object} [data={}] - Optional initialization object
 * @param {string} [data._id] - Internal database ID
 * @param {string} [data.email] - The user’s email address
 * @param {string} [data.login] - The user’s login name or username
 * @param {string} [data.password] - The user’s hashed password
 * @param {string} [data.fullName] - The user’s full name
 * @param {string} [data.role="user"] - The user’s role (e.g., "user", "admin")
 * @param {Array<Object>} [data.evals] - A list of evaluations associated with the user
 */
class UserItem {
    constructor(data = {}) {
        this._id = data._id || undefined;
        this.email = data.email || "";
        this.login = data.login || "";
        this.password = data.password || "";
        this.fullName = data.fullName || "";
        this.role = data.role || "user";
        this.evals = data.evals || [];
    }
}
module.exports = UserItem;