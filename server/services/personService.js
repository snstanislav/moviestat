const { Person } = require("../models/Person");

async function addNewPerson(newPerson) {
    try {
        let existing = await Person.findOne({ imdbID: newPerson.imdbID });
        if (existing) {
            console.log(`>> Person <${existing.imdbID}: ${existing.name}> already exists in DB.`);
            return existing;
        } else {
            const res = await Person.create(newPerson);
            if (res) console.log(`+ <${newPerson.name}> inserted into DB!`);
            return res;
        }
    } catch (err) {
        console.error("Error in addNewPerson:", err);
    }
}

module.exports = {
    addNewPerson
}