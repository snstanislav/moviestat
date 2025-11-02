/**
 * @file authRoutes.js
 * @description Express router for authentication and authorization endpoints.
 * Handles user signup, signin, signout, and protected routes (including admin-only access).
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module routes/authRoutes
 *
 * @requires dotenv - For loading environment variables
 * @requires express - Express framework for routing
 * @requires jsonwebtoken - For generating and verifying authentication tokens
 * @requires module:models/User - Mongoose User model
 * @requires module:services/userService - Business logic for user creation
 * @requires module:domain/UserItem - Domain model representing a user
 * @requires module:middleware/auth - Middleware for authentication and role authorization
 */

require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { addNewUser } = require("../services/userService");
const UserItem = require("../domain/UserItem");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * @route POST /authRoutes/signin
 * @summary Authenticates a user and returns a signed JWT token stored as an HTTP-only cookie.
 * @param {string} req.body.login - User login identifier
 * @param {string} req.body.password - User password
 * @returns {JSON} 200 - User successfully authenticated
 * @returns {JSON} 400 - Invalid password
 * @returns {JSON} 404 - User not found
 * @returns {JSON} 500 - Internal server error
 *
 * @example
 * // Request:
 * POST /auth/signin
 * { "login": "john123", "password": "securePass" }
 *
 * // Response:
 * { "success": true, "message": "User logged in" }
 */
router.post("/signin", async (req, res) => {
    try {
        const { login, password } = req.body;
        const user = await User.findOne({ login });
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const isValidPass = await user.comparePassword(password);
        if (!isValidPass) return res.status(400).json({ success: false, message: "Invalid password" });

        const token = jwt.sign({ id: user._id, role: user.role },
            process.env.JWT_SECRET, { expiresIn: "3h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict",
            maxAge: 3 * 60 * 60 * 1000,
            path: '/',
        });
        res.status(200).json({ success: true, message: "User logged in" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Signin error: " + err.message });
    }
});

/**
 * @route POST /authRoutes/signup
 * @summary Registers a new user and stores their data in MongoDB.
 * @param {string} req.body.login - User's chosen login name
 * @param {string} req.body.fullName - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's chosen password
 * @returns {JSON} 201 - User created successfully
 * @returns {JSON} 400 - Validation or duplication error
 * @returns {JSON} 500 - Server error
 *
 * @example
 * POST /auth/signup
 * { "login": "john123", "email": "john@example.com", "password": "securePass", "fullName": "John Doe" }
 */
router.post("/signup", async (req, res) => {
    try {
        const { login, fullName, email, password } = req.body;
        const newUser = new UserItem({ email, login, password, fullName });
        const result = await addNewUser(newUser);
        if (!result) return res.status(400).json({ success: result.success, message: result.message });
        res.status(201).json({ success: result.success, message: result.message });
    } catch (err) {
        res.status(500).json({ success: false, message: "Signup error: " + err.message });
    }
});

/**
 * @route POST /authRoutes/signout
 * @summary Logs out the user by clearing the authentication token cookie.
 * @returns {JSON} 200 - Successfully logged out
 * @returns {JSON} 500 - Server error
 *
 * @example
 * POST /auth/signout
 * -> Clears token and returns { "success": true, "message": "Logged out" }
 */
router.post("/signout", (req, res) => {
    try {
        res.clearCookie("token",
            {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                path: '/',
                maxAge: 0,
                expires: new Date(0),
            });
        res.status(200).json({ success: true, message: "Logged out" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Signout error: " + err.message });
    }
});

/**
 * @route GET /authRoutes/profile
 * @summary Returns the authenticated user's profile information.
 * @middleware auth() - Verifies JWT token and populates req.user
 * @returns {JSON} 200 - User profile data
 * @returns {JSON} 404 - User not found
 * @returns {JSON} 401 - Unauthorized
 * @returns {JSON} 500 - Server error
 *
 * @example
 * GET /authRoutes/profile
 * Authorization: Cookie token
 * -> { "success": true, "user": { "login": "john123", "email": "...", ... } }
 */
router.get("/profile", auth(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({
            success: true, message: "Restored user data",
            user: {
                id: user._id,
                login: user.login,
                fullName: user.fullName,
                role: user.role,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Profile error:", err);
        return res.status(500).json({
            success: false, message: "Error retrieving profile: " + err.message
        });
    }
});

/**
 * @route GET /authRoutes/admin
 * @summary Example of an admin-only protected route.
 * @middleware auth("admin") - Ensures that only admins can access
 * @returns {JSON} 200 - Access granted
 * @returns {JSON} 403 - Forbidden (if not admin)
 */
router.get("/admin", auth("admin"), (req, res) => {
    res.status(200).json({ success: true, message: "You are admin!" });
});

module.exports = router;