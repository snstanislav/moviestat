const mongoose = require("mongoose");

const personSchema = new mongoose.Schema({
    tmdbID: { type: String, required: true },
    imdbID: { type: String, required: true },
    name: { type: String, required: true },
    birthday: String,
    placeOfBirth: String,
    gender: Number,
    photo: String,
    biography: String
}, { timestamps: true });

module.exports.personSchema = personSchema;
module.exports.Person = mongoose.model("Person", personSchema, "persons");