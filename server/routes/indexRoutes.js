const mongoose = require("mongoose");
const express = require("express");
const { getEvaluatedMoviesList } = require("../services/evaluationService");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", auth(), async (req, res) => {
    const evalList = await getGeneralEvalList(req.user.id, req.params.sortMode);
    if (evalList) {
        return res.status(200).json({ success: true, data: evalList });
    } else {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

async function getGeneralEvalList(currUserId, sortMode) {
    try {
        const userID = new mongoose.Types.ObjectId(currUserId)
        const evalList = await getEvaluatedMoviesList(userID);

        return evalList;
    } catch (err) {
        console.error("Error fetching evals:", err);
        return;
    }
}

module.exports = router;