const mongoose = require("mongoose");
const { constructMovieFromAPIs } = require("../api/apiManager");
const EvaluationItem = require("../domain/EvaluationItem");
const { User } = require("../models/User");
const { Movie } = require("../models/Movie");
const { unloadAllPersonsFromMovie, addNewMovie } = require("./movieService");

var EXISTING_LOGGED_USER;

async function getSingleEvaluatedMovie(currLoggedUserID, movieID) {
    try {
        let movieDoc = null;
        if (currLoggedUserID) {
            movieDoc = await User.findOne({ _id: currLoggedUserID },
                { evals: { $elemMatch: { movie: movieID } } },)
                .populate({
                    path: "evals.movie",
                    populate: [
                        { path: "directors.person" },
                        { path: "writers.person" },
                        { path: "producers.person" },
                        { path: "composers.person" },
                        { path: "cast.person" }
                    ]
                }).exec();
        }
        return movieDoc;
    } catch (err) {
        console.error("Error in getEvaluatedMoviesList:", err);
    }
}

async function getEvaluatedMoviesList(currLoggedUserID) {
    try {
        let userDoc = null;
        if (currLoggedUserID) {
            userDoc = await User.findById(currLoggedUserID)
                .select("evals").populate({
                    path: "evals.movie",
                    populate: [
                        { path: "directors.person" },
                        { path: "writers.person" },
                        { path: "producers.person" },
                        { path: "composers.person" },
                        { path: "cast.person" }
                    ]
                }).exec();
        }
        return userDoc;
    } catch (err) {
        console.error("Error in getEvaluatedMoviesList:", err);
    }
}

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
                return {
                    isJustInserted: false,
                    movieID: existingMovie._id
                };
            } else {
                const evalItem = new EvaluationItem({
                    movie: existingMovie._id,
                    userRating: Number(userRating),
                    userEvalDate: userEvalDate,
                    userChangeEvalDate: "",
                    isFavorite: false
                });
                const saved = await appendEvaluationToUser(evalItem);
                if (saved) {
                    return {
                        isJustInserted: true,
                        movieID: saved.evals[saved.evals.length - 1].movie._id
                    };
                }
            }
        }
    } catch (err) {
        console.error("Error in evaluateMovie:", err);
    }
}

async function appendEvaluationToUser(evalItem) {
    try {
        EXISTING_LOGGED_USER.evals.push(evalItem);
        console.log("+++ Evaluated movie successfully added to current User's enrty!");
        return await EXISTING_LOGGED_USER.save();
    } catch (err) {
        console.error("Error in appendEvaluationToUser:", err);
    }
}

async function changeIsFavorite(currLoggedUserID, movieID, isFavorite) {
    const evalItem = new EvaluationItem({
        movie: movieID,
        userRating: undefined,
        userEvalDate: undefined,
        userChangeEvalDate: undefined,
        isFavorite: isFavorite
    });
    return await performEvaluationChanging(currLoggedUserID, evalItem);
}

async function changeEvaluation(currLoggedUserID, movieID, newUserRating, userChangeEvalDate) {
    const evalItem = new EvaluationItem({
        movie: movieID,
        userRating: newUserRating,
        userEvalDate: undefined,
        userChangeEvalDate: userChangeEvalDate,
        isFavorite: undefined
    });
    return await performEvaluationChanging(currLoggedUserID, evalItem);
}

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
                return true;
            } else {
                console.log(`>>> User <${EXISTING_LOGGED_USER.login}>:\nEvaluation wasn't changed. CURRENT value\n ${JSON.stringify(currEval, " ", 2)}\n is the SAME as the NEW one:\n ${JSON.stringify(evalItem, " ", 2)}.`);
            }
        }
    } catch (err) {
        console.error("Error in changeUserEvaluation. The movie seems not to be evaluated yet.\n", err);
    }
}

async function deleteEvaluation(currLoggedUserID, movieID) {
    try {
        let userDoc = null;
        if (currLoggedUserID) {
            userDoc = await User.findById(currLoggedUserID).select("evals");
            const initLength = userDoc.evals.length;

            const index = userDoc.evals.findIndex(elem => elem.movie.toString() === movieID);
            if (index !== -1) {
                userDoc.evals.splice(index, 1);
            }
            const result = await userDoc.save();
            return initLength - result.evals.length === 1 ? true : false;
        }
        return;
    } catch (err) {
        console.error("Error in getEvaluatedMoviesList:", err);
    }
}

module.exports = {
    getSingleEvaluatedMovie,
    getEvaluatedMoviesList,
    evaluateMovie,
    changeIsFavorite,
    changeEvaluation,
    deleteEvaluation
}