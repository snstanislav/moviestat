const { getMovieSearchResult } = require("../api/apiManager");
const { MovieItem } = require("../domain/MovieItem");
const { Movie } = require("../models/Movie");
const { addNewPerson } = require("./personService");

//// temp
const mongoose = require("mongoose");
const { connect, disconnect } = require("../db/connection");
require("dotenv").config();

const SEARCH_RESULT_CACHE = new Map();

async function findMovie(query, page) {
    let cacheKey = query.trim() + "#" + page;
    if (SEARCH_RESULT_CACHE.has(cacheKey)) {
        return SEARCH_RESULT_CACHE.get(cacheKey)
    } else {
        const result = await getMovieSearchResult(query, page);
        SEARCH_RESULT_CACHE.set(cacheKey, result);
        return result;
    }
}
/*(async ()=>{
    var qwe = await findMovie("x files", 1)
    console.log(qwe)
})()*/

async function unloadAllPersonsFromMovie(existingMovie) {
    try {
        for (let i = 0; i < existingMovie.directors.length; i++) {
            const res = await addNewPerson(existingMovie.directors[i].person);
            if (res) {
                existingMovie.directors[i].person = res._id;
            }
        }
        for (let i = 0; i < existingMovie.writers.length; i++) {
            const res = await addNewPerson(existingMovie.writers[i].person);
            if (res) {
                existingMovie.writers[i].person = res._id;
            }
        }
        for (let i = 0; i < existingMovie.producers.length; i++) {
            const res = await addNewPerson(existingMovie.producers[i].person);
            if (res) {
                existingMovie.producers[i].person = res._id;
            }
        }
        for (let i = 0; i < existingMovie.composers.length; i++) {
            const res = await addNewPerson(existingMovie.composers[i].person);
            if (res) {
                existingMovie.composers[i].person = res._id;
            }
        }
        for (let i = 0; i < existingMovie.cast.length; i++) {
            const res = await addNewPerson(existingMovie.cast[i].person);
            if (res) {
                existingMovie.cast[i].person = res._id;
            }
        }
    } catch (err) {
        console.error("Error in unloadAllPersonsFromMovie:", err);
    }
}

async function addNewMovie(newMovie) {
    try {
        let existing = await Movie.findOne({ imdbID: newMovie.imdbID });
        if (existing) {
            console.log(`>> ${existing.type} <${existing.imdbID}: ${existing.name}(${existing.year})> already exists in DB.`);
            return existing;
        }
        if (newMovie instanceof MovieItem) {
            const res = await Movie.create(newMovie);
            if (res) console.log("++ Movie inserted into DB!");
            return res;
        }
        return;
    } catch (err) {
        console.error("Error in addNewMovie:", err);
    }
}

module.exports = {
    findMovie,
    unloadAllPersonsFromMovie,
    addNewMovie
}