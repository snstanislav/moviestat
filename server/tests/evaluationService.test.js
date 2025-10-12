require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const { connect, disconnect, clearDB } = require("./setupTestDB");
const { getTestUserObj } = require("./setupTestObj");
const { addNewUser } = require("../services/userService");
const { evaluateMovie, changeEvaluation, changeIsFavorite } = require("../services/evaluationService");
const { User } = require("../models/User");
const { Movie } = require("../models/Movie");

beforeAll(async () => {
    process.env.MONGO_URI = "mongodb://fakehost:27017/fakedb";
    await connect();
});
afterEach(async () => { await clearDB(); });
afterAll(async () => { await disconnect(); });

test("evaluation of the new Movie", async () => {
    // Two test options set
    const newTestMovie = JSON.parse(fs.readFileSync("./tests/testTV.json"));
    const mediaType = "tv";
    const tmdbIDSearched = "4087";
    /*const newTestMovie = JSON.parse(fs.readFileSync("./tests/testMovie.json"));
    const mediaType = "movie";
    const tmdbIDSearched = "49047";
    */

    // Imitates curr logged user and inserts him temporarily into DB
    const testUser = await addNewUser(getTestUserObj());

    const userRating = 7;
    const userEvalDate = (new Date()).toString();

    // Run main tested feature
    await evaluateMovie(testUser._id, tmdbIDSearched, mediaType, userRating, userEvalDate);
    // Extract MOVIE item should be inserted into DB if succeed
    const resObj = await Movie.findOne({ tmdbID: tmdbIDSearched });
    //console.log(JSON.stringify(resObj, " ", 2))

    expect(resObj.type).toBe(newTestMovie.type);
    expect(resObj.tmdbID.toString()).toBe(newTestMovie.tmdbID.toString());
    expect(resObj.imdbID).toBe(newTestMovie.imdbID);
    expect(resObj.imdbRating).toBe(newTestMovie.imdbRating);
    expect(resObj.imdbVotes).toBe(newTestMovie.imdbVotes);
    expect(resObj.commTitle).toBe(newTestMovie.commTitle);
    expect(resObj.year).toBe(newTestMovie.year);

    for (let i = 0; i < resObj.countries.length; i++) {
        expect(resObj.countries[i]).not.toBe(undefined);
        expect(resObj.countries[i]).toBe(newTestMovie.countries[i]);
    }
    for (let i = 0; i < resObj.languages.length; i++) {
        expect(resObj.languages[i]).not.toBe(undefined);
        expect(resObj.languages[i]).toBe(newTestMovie.languages[i]);
    }
    for (let i = 0; i < resObj.genres.length; i++) {
        expect(resObj.genres[i]).not.toBe(undefined);
        expect(resObj.genres[i]).toBe(newTestMovie.genres[i]);
    }

    for (let i = 0; i < resObj.directors.length; i++) {
        expect(resObj.directors[i].person).not.toBe(undefined);
        expect(resObj.directors[i].person instanceof mongoose.Types.ObjectId).toBe(true);
    }
    for (let i = 0; i < resObj.writers.length; i++) {
        expect(resObj.writers[i].person).not.toBe(undefined);
        expect(resObj.writers[i].person instanceof mongoose.Types.ObjectId).toBe(true);
    }
    for (let i = 0; i < resObj.producers.length; i++) {
        expect(resObj.producers[i].person).not.toBe(undefined);
        expect(resObj.producers[i].person instanceof mongoose.Types.ObjectId).toBe(true);
    }
    for (let i = 0; i < resObj.composers.length; i++) {
        expect(resObj.composers[i].person).not.toBe(undefined);
        expect(resObj.composers[i].person instanceof mongoose.Types.ObjectId).toBe(true);
    }
    for (let i = 0; i < resObj.cast.length; i++) {
        expect(resObj.cast[i].person).not.toBe(undefined);
        expect(resObj.cast[i].person instanceof mongoose.Types.ObjectId).toBe(true);
        expect(resObj.cast[i].character).toBe(newTestMovie.cast[i].character);
    }
});

test("changing of the evaluation", async () => {
    ///
    /// START preparation of test items 
    ///

    // Imitates curr logged user and inserts him temporarily into DB
    const testUser = await addNewUser(getTestUserObj());

    const mediaType = "movie";
    const tmdbIDSearched = "49047";

    const firstRating = 7;
    const secondRating = 10;
    const evalDate = (new Date()).toString();

    // Perform test evalution and extract MOVIE item should be inserted into DB if succeed & USER to which the movie evaluation was added
    await evaluateMovie(testUser._id, tmdbIDSearched, mediaType, firstRating, evalDate);
    const insertedMovie = await Movie.findOne({ tmdbID: tmdbIDSearched });
    const INIT_USER_OBJ = await User.findOne({ _id: testUser._id }); // extract to compare
    // Find position of the current evaluation
    const index = INIT_USER_OBJ.evals.findIndex(elem => elem.movie.equals(insertedMovie._id));
    ///
    /// END preparation of test items
    ///

    // Run main tested feature and extract USER item to test changes
    await changeEvaluation(testUser._id, insertedMovie._id, secondRating, evalDate);
    const RES_USER_OBJ = await User.findOne({ _id: testUser._id }); // extract to compare

    // is user entry is the same one
    expect(RES_USER_OBJ._id).toStrictEqual(INIT_USER_OBJ._id);
    // is movie is the same one
    expect(RES_USER_OBJ.evals[index].movie).toStrictEqual(INIT_USER_OBJ.evals[index].movie);

    expect(INIT_USER_OBJ.evals[index].userRating).toBe(7);
    expect(RES_USER_OBJ.evals[index].userRating).toBe(10);

    // initial dates state
    expect(INIT_USER_OBJ.evals[index].userEvalDate).not.toBe(undefined);
    expect(INIT_USER_OBJ.evals[index].userChangeEvalDate).toBe("");

    // after changing
    expect(RES_USER_OBJ.evals[index].userEvalDate).toBe(INIT_USER_OBJ.evals[index].userEvalDate);
    expect(RES_USER_OBJ.evals[index].userChangeEvalDate).not.toBe(undefined);
    expect(RES_USER_OBJ.evals[index].userChangeEvalDate).not.toBe("");
});

test("changing of isFavourite mode", async () => {
    ///
    /// START preparation of test items 
    ///
    // Imitates curr logged user and inserts him temporarily into DB
    const testUser = await addNewUser(getTestUserObj());

    const mediaType = "movie";
    const tmdbIDSearched = "49047";

    const firstRating = "7";
    const secondRating = "10";
    const evalDate = (new Date()).toString();

    // Perform test evalution and extract MOVIE item should be inserted into DB if succeed & USER to which the movie evaluation was added
    await evaluateMovie(testUser._id, tmdbIDSearched, mediaType, firstRating, evalDate);
    const insertedMovie = await Movie.findOne({ tmdbID: tmdbIDSearched });
    const INIT_USER_OBJ = await User.findOne({ _id: testUser._id }); // extract to compare
    // Find position of the current evaluation
    const index = INIT_USER_OBJ.evals.findIndex(elem => elem.movie.equals(insertedMovie._id));
    ///
    /// END preparation of test items
    ///

    // Run main tested feature and extract USER item to test changes
    await changeIsFavorite(testUser._id, insertedMovie._id, true);
    const RES_USER_OBJ = await User.findOne({ _id: testUser._id }); // extract to compare

    // is user entry is the same one
    expect(RES_USER_OBJ._id).toStrictEqual(INIT_USER_OBJ._id);
    // is movie is the same one
    expect(RES_USER_OBJ.evals[index].movie).toStrictEqual(INIT_USER_OBJ.evals[index].movie);

    expect(typeof INIT_USER_OBJ.evals[index].isFavorite).toBe("boolean");
    expect(typeof RES_USER_OBJ.evals[index].isFavorite).toBe("boolean");

    expect(INIT_USER_OBJ.evals[index].isFavorite).toBe(false);
    expect(RES_USER_OBJ.evals[index].isFavorite).toBe(true);
});