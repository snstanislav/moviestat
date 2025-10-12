require("dotenv").config();
const jwt = require("jsonwebtoken");

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