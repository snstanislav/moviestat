const mongoose = require("mongoose");
const { constructMovieFromAPIs } = require("../api/apiManager");
const { EvaluationItem } = require("../domain/EvaluationItem");
const { User } = require("../models/User");
const { Movie } = require("../models/Movie");
const { unloadAllPersonsFromMovie, addNewMovie } = require("./movieService");

//// temp
const { connect, disconnect } = require("../db/connection");
require("dotenv").config();

var EXISTING_LOGGED_USER;

async function getEvaluatedMoviesList(currLoggedUserID) {
    try {
        let userDoc = null;
        if (currLoggedUserID) {
            /* userDoc = await User.findById(currLoggedUserID)
                 .populate({
                     path: "evals.movie"
                 }).exec();*/
            userDoc = User.aggregate([
                { $match: { _id: currLoggedUserID } }, {
                    $addFields: {
                        evals: {
                            $filter: {
                                input: "$evals",
                                as: "eval",
                                cond: { $eq: ["$$eval.movie.commTitle", "Gravity"] }
                            }
                        }
                    }
                }
            ]);

        }
        return userDoc;
    } catch (err) {
        console.error("Error in getEvaluatedMoviesList:", err);
    }
}
(async () => {
    await connect();
    var doc = await await getEvaluatedMoviesList(new mongoose.Types.ObjectId("68c44133232b7031c0397e15"))
    // doc = doc.evals.filter((elem)=> elem.userRating > 8)
    console.log(JSON.stringify(doc, "", 2))
    //console.log(doc)
    await disconnect();
})

async function evaluateMovie(currLoggedUserID, tmdbIDSearched, mediaType, userRating, userEvalDate) {
    try {
        if (currLoggedUserID) {
            EXISTING_LOGGED_USER = await User.findOne({ _id: currLoggedUserID });
            if (!EXISTING_LOGGED_USER) throw `USER <${currLoggedUserID}> doesn't exist.`

            let existingMovie = await Movie.findOne({ tmdbID: tmdbIDSearched });
            if (!existingMovie) {
                existingMovie = await constructMovieFromAPIs(tmdbIDSearched, mediaType, userRating, userEvalDate);
            } else {
                console.log(`> Object construction is not needed: ${existingMovie.type.toUpperCase()} <${existingMovie.imdbID}: ${existingMovie.commTitle} (${existingMovie.year})> already exists.`);
                // Existing item from db model must be explicit converted
                existingMovie = existingMovie.toObject();
            }

            if (!existingMovie._id) {
                await unloadAllPersonsFromMovie(existingMovie);
                existingMovie = await addNewMovie(existingMovie);
            } else {
                console.log(`>> Movie "${existingMovie.commTitle}" already exists in DB!`);
            }

            if (EXISTING_LOGGED_USER.evals.some((elem) =>
                elem.movie.equals(existingMovie._id))) {
                console.log(`>>> You have already evaluated "${existingMovie.commTitle}"`);
            } else {
                const evalItem = new EvaluationItem(
                    existingMovie._id,
                    userRating,
                    userEvalDate,
                    "",
                    false
                );
                await appendEvaluationToUser(evalItem);
            }
        }
    } catch (err) {
        console.error("Error in evaluateMovie:", err);
    }
}
(async () => {
    var tmdb1 = "273481", tmdb2 = "105", tmdb3 = "49047", tmdb4 = "4087"
    await connect();
    await evaluateMovie(new mongoose.Types.ObjectId("68c44133232b7031c0397e15"), tmdb4, "tv", 8, (new Date()).toString())
    await disconnect();
})

async function appendEvaluationToUser(evalItem) {
    try {
        EXISTING_LOGGED_USER.evals.push(evalItem);
        await EXISTING_LOGGED_USER.save();
        console.log("+++ Evaluated movie successfully added to current User's enrty!");
    } catch (err) {
        console.error("Error in appendEvaluationToUser:", err);
    }
}

async function changeEvaluation(currLoggedUserID, movieID, newUserRating, userChangeEvalDate) {
    const evalItem = new EvaluationItem(
        movieID,
        newUserRating,
        undefined,
        userChangeEvalDate,
        undefined
    );
    await performEvaluationChanging(currLoggedUserID, evalItem);
}

async function changeIsFavorite(currLoggedUserID, movieID, isFavorite) {
    const evalItem = new EvaluationItem(
        movieID,
        undefined,
        undefined,
        undefined,
        isFavorite
    );
    await performEvaluationChanging(currLoggedUserID, evalItem);
}/*(new mongoose.Types.ObjectId("68b474d735c92a36b4d573de"),
    new mongoose.Types.ObjectId("68c094dcce47c58a89a1476b"), true)
*/

async function performEvaluationChanging(currLoggedUserID, evalItem) {
    try {
        if (!EXISTING_LOGGED_USER || !EXISTING_LOGGED_USER._id.equals(currLoggedUserID)) {
            console.log(`EXISTING_LOGGED_USER: ${EXISTING_LOGGED_USER}. Extracting from DB...`);
            EXISTING_LOGGED_USER = await User.findOne({ _id: currLoggedUserID });
        }
        if (EXISTING_LOGGED_USER) {
            let currEval = EXISTING_LOGGED_USER.evals.find((elem) =>
                elem.movie.equals(evalItem.movie));

            if (!currEval || currEval.userRating !== evalItem.userRating || currEval.isFavorite !== evalItem.isFavorite) {
                await User.updateOne({ _id: currLoggedUserID },
                    {
                        $set: {
                            "evals.$[elem].userRating": evalItem.userRating,
                            "evals.$[elem].userChangeEvalDate": evalItem.userChangeEvalDate,
                            "evals.$[elem].isFavorite": evalItem.isFavorite
                        }
                    },
                    { arrayFilters: [{ "elem.movie": evalItem.movie }] });

                console.log(`*** User <${EXISTING_LOGGED_USER.login}>:\n++ Evaluation modifying was performed. OLD:\n${JSON.stringify(currEval, " ", 2)},\nNEW:\n${JSON.stringify(evalItem, " ", 2)}.`);
            } else {
                console.log(`>>> User <${EXISTING_LOGGED_USER.login}>:\nEvaluation wasn't changed. CURRENT value\n ${JSON.stringify(currEval, " ", 2)}\n is the SAME as the NEW one:\n ${JSON.stringify(evalItem, " ", 2)}.`);
            }
        }
    } catch (err) {
        console.error("Error in changeUserEvaluation. The movie seems not to be evaluated yet.\n", err);
    }
}

module.exports = {
    getEvaluatedMoviesList,
    evaluateMovie,
    changeEvaluation,
    changeIsFavorite
}