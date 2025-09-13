const { fetchWithRetry } = require("./utils");

require("dotenv").config();

const LABELS = {
    DIRECTOR: ["Director"],
    SCREENPLAY: ["Screenplay", "Writer"],
    PRODUCER: ["Executive Producer", "Producer"],
    COMPOSER: ["Original Music Composer"]
}

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.TMDB_API_TOKEN}`
    }
};

async function extractSearchResults(query, page) {
    const urlSearch = `https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=${page}`;
    try {
        return await fetchWithRetry(urlSearch, options);
    } catch (err) {
        console.error('Error searching <tmdb>:\n', err);
    }
}

async function extractMovie(tmdbID, mediaType) {
    const urlMovie = `https://api.themoviedb.org/3/${mediaType}/${tmdbID}`;
    try {
        const content = await fetchWithRetry(urlMovie, options);
        // TV-series details provide no 'imdb_id' prop - additional request is needed
        if (!content.imdb_id) {
            const urlExternals = `https://api.themoviedb.org/3/${mediaType}/${tmdbID}/external_ids`;
            const obj = await fetchWithRetry(urlExternals, options);
            content.imdb_id = obj.imdb_id;
        }
        return content;
    } catch (err) {
        console.error('Error fetching movie <tmdb>:\n', err);
    }
}

async function extractCredits(tmdbID, mediaType) {
    const urlCastCrew = `https://api.themoviedb.org/3/${mediaType}/${tmdbID}/credits?language=en-US`;
    try {
        return await fetchWithRetry(urlCastCrew, options);
    } catch (err) {
        console.error('Error fetching credits <tmdb>:\n', err);
    }
}

async function extractPerson(tmdbPersonID) {
    const urlPerson = `https://api.themoviedb.org/3/person/${tmdbPersonID}`;
    try {
        return await fetchWithRetry(urlPerson, options);
    } catch (err) {
        console.error('Error fetching person <tmdb>:\n', err);
    }
}

module.exports = {
    LABELS,
    extractSearchResults: extractSearchResults,
    extractMovie: extractMovie,
    extractCredits: extractCredits,
    extractPerson: extractPerson
}