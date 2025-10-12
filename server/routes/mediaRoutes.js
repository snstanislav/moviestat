const express = require("express");
const { Movie } = require("../models/Movie");
const { getSingleEvaluatedMovie, changeIsFavorite, changeEvaluation, deleteEvaluation } = require("../services/evaluationService");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/:id", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const mediaID = req.params.id;
        const evaluatedSingleMedia = await getSingleEvaluatedMovie(userID, mediaID);
        return res.json({ success: true, data: evaluatedSingleMedia });
    } catch (err) {
        console.error("Error fetching single evaluation:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/favorite", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const { mediaID, isFavorite } = req.body;
        const result = await changeIsFavorite(userID, mediaID, isFavorite);
        if (result) return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error changing favorite status:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/change", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const { mediaID, newUserRating, userChangeEvalDate } = req.body;
        const result = await changeEvaluation(userID, mediaID, newUserRating, userChangeEvalDate);
        if (result) return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error changing evaluation:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.post("/delete", auth(), async (req, res) => {
    try {
        const userID = new mongoose.Types.ObjectId(req.user.id);
        const { mediaID } = req.body;
        const result = await deleteEvaluation(userID, mediaID);
        if (result) return res.status(200).json({ success: true, message: "Evaluation successfully DELETED" });
    } catch (err) {
        console.error("Error deleting evaluation:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;