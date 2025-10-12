require("dotenv").config();
const { fetchWithRetry } = require("./utils");

async function extractMovie(imdbMovieID) {
    const urlMovie = `https://www.omdbapi.com/?i=${imdbMovieID}&apikey=${process.env.OMDB_API_KEY}`;
    try {
        return await fetchWithRetry(urlMovie)
    } catch (err) {
        console.error('Error fetching movie <omdb>:\n', err);
    }
}

module.exports.extractMovie = extractMovie;