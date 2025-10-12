require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { addNewUser } = require("../services/userService");
const UserItem = require("../domain/UserItem");
const auth = require("../middleware/auth");

const router = express.Router();

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
            sameSite: "strict",
            maxAge: 3000 * 60 * 60
        });
        res.status(200).json({ success: true, message: "User logged in" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Signin error: " + err.message });
    }
});

router.post("signup", async (req, res) => {
    try {
        const { email, login, fullName, password } = req.body;
        const newUser = new UserItem({ email, login, password, fullName });
        const result = await addNewUser(newUser);
        if (!result) return res.status(400).json({ success: false, message: "Registration failed" });
        res.status(201).json({ success: true, message: "User registered" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Signup error: " + err.message });
    }
});

router.post("/signout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out" });
});

router.get("/profile", auth(), async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" }).select("login email fullName role");

    res.json({
        success: true, message: "Restored user data",
        user: {
            id: user._id,
            login: user.login,
            fullName: user.fullName,
            role: user.role,
            email: user.email
        }
    });
});

router.get("/admin", auth("admin"), (req, res) => {
    res.json({ success: true, message: "You are admin!" });
});

module.exports = router;