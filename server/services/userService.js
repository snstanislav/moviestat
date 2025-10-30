/**
 * @file userService.js
 * @description Responsible for user-related business logic and database operations.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module services/userService
 * @requires dotenv - Loads environment variables from `.env` file.
 * @requires module:domain/UserItem - Domain representation of a user.
 * @requires module:models/User - Mongoose User model for database operations.
 */

require("dotenv").config();
const UserItem = require("../domain/UserItem");
const { User } = require("../models/User");

/**
 * Adds a new user to the database if a user with the same login does not already exist.
 * Checks for an existing user by login, and if not found, creates a new user record.
 *
 * @async
 * @function addNewUser
 * @param {UserItem} newUser - The new user to be created
 * @returns {Promise<Object>} Result object containing the operation status and data
 *  - {boolean} return.success - Indicates whether the operation was successful
 *  - {string} return.message - Human-readable message describing the result
 *  - {Object|null} return.data - The created user document or `null` if the operation failed
 *
 * @throws {Error} If the MongoDB operation fails or if a duplicate key constraint is violated.
 * @example
 * const newUser = new UserItem({...});
 * const result = await addNewUser(newUser);
 * console.log(result.message);
 * // Example output: "User <john_doe> successfully created."
 * 
 * @see {@link module:domain/UserItem|UserItem}
 */
async function addNewUser(newUser) {
    try {
        let existing = await User.findOne({ login: newUser.login });
        if (existing) {
            console.log(`>> User <${existing.login}> already exists.`);
            return {
                success: false,
                message: `User <${existing.login}> already exists.`,
                data: existing
            };
        }
        if (newUser instanceof UserItem || typeof newUser === "object") {
            console.log(`Inserting new user: <${newUser.login}>`);
            const created = await User.create(newUser);
            return {
                success: true,
                message: `User <${created.login}> successfully created.`,
                data: created
            };
        }
    } catch (err) {
        console.error("Error adding user into DB <addNewUser>:", err);
        return {
            success: false,
            message: err.code === 11000 ? `E-mail <${newUser.email}> already exists.` : `New user creating failed.`,
            data: null
        };
    }
}

module.exports = {
    addNewUser
}