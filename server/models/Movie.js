const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    // common id/type props
    type: String,
    tmdbID: String,
    // imdb props
    imdbID: String,
    imdbRating: String,
    imdbVotes: String,
    // general props
    commTitle: String,
    origTitle: String,
    year: String,
    duration: String,
    parental: String,
    plot: String,
    poster: String,
    budget: String,
    boxOffice: String,
    // multiple common props
    countries: [String],
    languages: [String],
    genres: [String],
    // multiple crew props
    directors: [{ person: { type: mongoose.Types.ObjectId, ref: "Person" } }],
    writers: [{ person: { type: mongoose.Types.ObjectId, ref: "Person" } }],
    producers: [{ person: { type: mongoose.Types.ObjectId, ref: "Person" } }],
    composers: [{ person: { type: mongoose.Types.ObjectId, ref: "Person" } }],
    cast: [{
        person: { type: mongoose.Types.ObjectId, ref: "Person" },
        character: { type: String }
    }]

    // moviestat props -- contains in User schema as evals[]
    // userRating: Number,
    // userEvalDate: String,
    // userChangeEvalDate: String,
    // isFavorite: false,
});

module.exports.movieSchema = movieSchema;
module.exports.Movie = mongoose.model("Movie", movieSchema, "movies");

