const { UserItem } = require("../domain/UserItem");
const { User } = require("../models/User");

/// temp
const mongoose = require("mongoose");
const { connect, disconnect } = require("../db/connection");

require("dotenv").config();

//var EXISTING_LOGGED_USER;

async function addNewUser(newUser) {
    try {
        let existing = await User.findOne({ login: newUser.login });
        if (existing) {
            console.log(`>> User <${existing.login}> already exists in DB.`);
            return existing;
        }
        if (newUser instanceof UserItem) {
            console.log(`Inserting new user: <${newUser.login}>`);
            return await User.create(newUser);
        }
    } catch (err) {
        console.error("Error in addNewUser:", err);
    }
}
/*(async () => {
    const newTestUser = new UserItem();
    newTestUser.email = `test_1@domain.com`;
    newTestUser.login = `testUser_1`;
    newTestUser.password = "123456789";
    newTestUser.fullName = "John Doe";
    newTestUser.role = "admin";
    newTestUser.evals = [];
    await connect()
    await addNewUser(newTestUser)
    await disconnect();
})*/

module.exports = {
    addNewUser
}