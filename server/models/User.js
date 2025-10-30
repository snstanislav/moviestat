/**
 * @file User.js
 * @description Mongoose schema and model for application users.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module models/User
 * @requires mongoose - MongoDB ODM for Node.js
 * @requires bcrypt - Library for hashing and verifying passwords
 * @requires module:models/Evaluation - Imported evaluation schema for embedded documents
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { evaluationSchema } = require("./Evaluation")

/**
 * Mongoose schema for user documents.
 * Handles user authentication, role management, and embedded evaluations.
 * 
 * @typedef {Object} UserSchema
 *
 * @property {string} email - Unique user's email
 * @property {string} login - Unique username used for authentication
 * @property {string} password - Hashed user password
 * @property {string} fullName - Full name of the user
 * @property {"user"|"admin"} [role="user"] - User's access role (defaults to `"user"`)
 * @property {Array<Object>} evals - Array of embedded evaluation documents (see {@link module:models/Evaluation})
 *
 * @property {Date} createdAt - Auto-generated creation timestamp
 * @property {Date} updatedAt - Auto-updated modification timestamp
 *
 * @description Schema for storing registered users, including authentication details,
 * personal information, and associated movie evaluations. 
 * Includes pre-save password hashing and instance methods for password comparison.
 *
 * @example
 * // Creating a new user
 * const user = new User({
 *   email: "user@example.com",
 *   login: "john_doe",
 *   password: "plaintextpassword",
 *   fullName: "John Doe"
 * });
 * await user.save();
 */
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    evals: [evaluationSchema]
}, { timestamps: true });

/**
 * Middleware: Hash the password before saving if it has been modified.
 * 
 * @function
 * @memberof module:models/User~userSchema
 * @param {import('mongoose').HookNextFunction} next - Callback to proceed with save operation.
 * @returns {Promise<void>}
 */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Compare a plain text password with the stored hashed password.
 *
 * @async
 * @function comparePassword
 * @memberof module:models/User~userSchema
 * @param {string} candidatePassword - The password to verify.
 * @returns {Promise<boolean>} Resolves to `true` if passwords match, otherwise `false`.
 *
 * @example
 * const isValid = await user.comparePassword("plaintextpassword");
 * if (isValid) console.log("Access granted");
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

module.exports.userSchema = userSchema;
module.exports.User = mongoose.model("User", userSchema, "users");