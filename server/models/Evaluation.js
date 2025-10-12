
const mongoose = require("mongoose");

const evaluationSchema = new mongoose.Schema({
    movie: { type: mongoose.Types.ObjectId, ref: "Movie" },
    userRating: Number,
    userEvalDate: String,
    userChangeEvalDate: String,
    isFavorite: Boolean
}, { _id: false });

module.exports.evaluationSchema = evaluationSchema;