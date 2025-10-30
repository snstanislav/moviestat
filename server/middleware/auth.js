/**
 * @file auth.js
 * @description Express middleware for verifying JSON Web Tokens (JWT) and enforcing role-based access control.
 * This middleware ensures that only authenticated users — and optionally, users with a specific role — can access protected routes.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module middleware/auth
 */

require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * Authentication and authorization middleware factory.
 *
 * This function returns an Express middleware that:
 * - Validates the presence and validity of a JWT stored in cookies.
 * - Verifies the token using the server's `JWT_SECRET`.
 * - Attaches the decoded user data to `req.user`.
 * - Optionally enforces role-based access by comparing the user’s role to a required role.
 *
 * @function auth
 * @param {string} [requiredRole] - Optional. The user role required to access the route (e.g., `"admin"`).
 * @returns {import('express').RequestHandler} Express middleware function that validates authentication and authorization.
 *
 * @example
 * // Protect a route for any authenticated user
 * app.get("/profile", auth(), (req, res) => {
 *   res.json({ success: true, user: req.user });
 * });
 *
 * @example
 * // Protect a route only for admin users
 * app.delete("/admin/delete-user/:id", auth("admin"), (req, res) => {
 *   // Only users with role 'admin' can reach this
 *   res.json({ success: true, message: "User deleted" });
 * });
 */
function auth(requiredRole) {
    return (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (requiredRole && decoded.role !== requiredRole) {
                return res.status(403).json({ success: false, message: "Forbidden" });
            }
            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
    }
}

module.exports = auth;