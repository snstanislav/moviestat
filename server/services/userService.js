const UserItem = require("../domain/UserItem");
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
            return {
                success: false,
                message: `User <${existing.login}> already exists in DB.`,
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
        console.error("Error in addNewUser:", err);
        return {
            success: false,
            message: `Error: new user creating failed.`
        };
    }
}
/*(async () => {
    const newTestUser = new UserItem();
    newTestUser.email = `user1@domain.com`;
    newTestUser.login = `user1`;
    newTestUser.password = "111";
    newTestUser.fullName = "Jane Doe";
    newTestUser.role = "user";
    newTestUser.evals = [];
    await connect()
    await addNewUser(newTestUser)
    await disconnect();
})()*/

module.exports = {
    addNewUser
}