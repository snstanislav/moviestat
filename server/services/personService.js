/**
 * @file personService.js
 * @description Provides logic for inserting new person records into the database.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module services/personService
 * @requires module:models/Person - Mongoose model representing a person document.
 */

const { Person } = require("../models/Person");

/**
 * Adds a new person to the database if a person with the same TMDb ID does not already exist.
 * Checks for an existing record by `tmdbID`, and if none is found, creates and saves a new person.
 *
 * @async
 * @function addNewPerson
 * @param {PersonItem} newPerson - The new person to be created.
 * @returns {Promise<Object|null>} The existing or newly created person document, or `null` if an error occurs.
 *
 * @example
 * const newPerson = new PersonItem({...});
 * const result = await addNewPerson(newPerson);
 * console.log(result?.name);
 * 
 * @see {@link module:domain/PersonItem|PersonItem}
 */
async function addNewPerson(newPerson) {
    try {
        let existing = await Person.findOne({ tmdbID: newPerson.tmdbID });
        if (existing) {
            console.log(`>> Person <${existing.tmdbID}: ${existing.name}> already exists.`);
            return existing;
        } else {
            const res = await Person.create(newPerson);
            if (res) console.log(`+ <${newPerson.name}> inserted into DB!`);
            return res;
        }
    } catch (err) {
        console.error("Error in addNewPerson:", err);
        return null;
    }
}

module.exports = {
    addNewPerson
}