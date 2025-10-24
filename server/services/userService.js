const UserItem = require("../domain/UserItem");
const { User } = require("../models/User");

require("dotenv").config();

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
        console.error("Error in addNewUser:", err);
        return {
            success: false,
            message: err.code === 11000 ? `E-mail <${newUser.email}> already exists.` : `New user creating failed.`
        };
    }
}

module.exports = {
    addNewUser
}