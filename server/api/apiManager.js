const tmdb = require("./tmdbProvider");
const { LABELS } = tmdb;
const omdb = require("./omdbProvider");
const { MovieItem } = require("../domain/MovieItem");
const { PersonItem } = require("../domain/PersonItem");
const { SearchItem } = require("../domain/SearchItem");

require("dotenv").config();

/**
 * Cache is used to avoid additional API requests for multiple occasions of the same person
 */
const CAST_CREW_CACHE = new Map();

async function getMovieSearchResult(query, page) {
    const searchResult = await tmdb.extractSearchResults(query, page)
    const resultObj = {
        totalResults: searchResult.total_results,
        totalPages: searchResult.total_pages,
        currentPage: searchResult.page,
        results: []
    }
    for (let i = 0; i < searchResult.results.length; i++) {
        resultObj.results.push(new SearchItem(
            searchResult.results[i].id,
            searchResult.results[i].title || searchResult.results[i].name,
            searchResult.results[i].media_type,
            searchResult.results[i].release_date || searchResult.results[i].first_air_date,
            searchResult.results[i].backdrop_path || searchResult.results[i].poster_path,
            searchResult.results[i].overview
        ));
        resultObj.results[i].poster ? resultObj.results[i].poster = "https://image.tmdb.org/t/p/original" + resultObj.results[i].poster
            : resultObj.results[i].poster = "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg";
        resultObj.results[i].year ? resultObj.results[i].year = resultObj.results[i].year.slice(0, 4) : "";
    }
    return resultObj;
}

async function constructMovieFromAPIs(tmdbIdSearched, mediaType, userRating, userEvalDate) {
    try {
        const resultMovieItem = new MovieItem();
        const tmdbSrcMovieItem = await tmdb.extractMovie(tmdbIdSearched, mediaType); //fetch
        const omdbSrcMovieItem = await omdb.extractMovie(tmdbSrcMovieItem.imdb_id); //fetch

        resultMovieItem.type = mediaType;
        resultMovieItem.tmdbID = tmdbSrcMovieItem.id.toString();
        resultMovieItem.imdbID = tmdbSrcMovieItem.imdb_id || omdbSrcMovieItem.imdbID;
        resultMovieItem.imdbRating = omdbSrcMovieItem.imdbRating;
        resultMovieItem.imdbVotes = omdbSrcMovieItem.imdbVotes;
        resultMovieItem.commTitle = tmdbSrcMovieItem.title || omdbSrcMovieItem.Title;
        resultMovieItem.origTitle = tmdbSrcMovieItem.original_title || tmdbSrcMovieItem.original_name;
        resultMovieItem.year = omdbSrcMovieItem.Year || tmdbSrcMovieItem.release_date || tmdbSrcMovieItem.first_air_date;
        resultMovieItem.duration = omdbSrcMovieItem.Runtime || tmdbSrcMovieItem.runtime + " min";
        resultMovieItem.parental = omdbSrcMovieItem.Rated;
        resultMovieItem.plot = tmdbSrcMovieItem.overview || omdbSrcMovieItem.Plot;
        resultMovieItem.poster = "https://image.tmdb.org/t/p/original" + tmdbSrcMovieItem.poster_path || omdbSrcMovieItem.Poster.replace(/_SX\d+/, "");
        resultMovieItem.budget = tmdbSrcMovieItem.budget;
        resultMovieItem.boxOffice = tmdbSrcMovieItem.revenue;

        resultMovieItem.year.slice(0, 4);

        tmdbSrcMovieItem.production_countries.map((elem) => { resultMovieItem.countries.push(elem.name) });
        tmdbSrcMovieItem.spoken_languages.map((elem) => { resultMovieItem.languages.push(elem.english_name) });
        tmdbSrcMovieItem.genres.map((elem) => { resultMovieItem.genres.push(elem.name) });

        const credits = await constructCredits(tmdbSrcMovieItem.id, mediaType)
        resultMovieItem.directors = [...credits.directors];
        resultMovieItem.writers = [...credits.writers];
        resultMovieItem.producers = [...credits.producers];
        resultMovieItem.composers = [...credits.composers];
        resultMovieItem.cast = [...credits.cast];

        resultMovieItem.userRating = userRating;
        resultMovieItem.userEvalDate = userEvalDate;

        return resultMovieItem;
    } catch (err) {
        console.error("Error movie item constructing:\n", err)
    }
}

async function constructCredits(tmdbMovieID, mediaType) {
    try {
        const content = await tmdb.extractCredits(tmdbMovieID, mediaType); // fetch
        const directorArr = [];
        const writerArr = [];
        const producerArr = [];
        const composerArr = [];
        for (let i = 0; i < content.crew.length; i++) {
            if (LABELS.DIRECTOR.includes(content.crew[i].job)) {
                directorArr.push(content.crew[i]);
            }
            if (LABELS.SCREENPLAY.includes(content.crew[i].job)) {
                writerArr.push(content.crew[i]);
            }
            if (LABELS.PRODUCER.includes(content.crew[i].job)) {
                producerArr.push(content.crew[i]);
            }
            if (LABELS.COMPOSER.includes(content.crew[i].job)) {
                composerArr.push(content.crew[i]);
            }
        }

        return {
            directors: await prepareCastCrewList(directorArr, false),
            writers: await prepareCastCrewList(writerArr, false),
            producers: await prepareCastCrewList(producerArr, false),
            composers: await prepareCastCrewList(composerArr, false),
            cast: await prepareCastCrewList(content.cast, true)
        }
    } catch (err) {
        console.error('Error fetching cast/crew <tmdb>:\n', err);
    }
}

async function prepareCastCrewList(personArr, isCast) {
    let personMap = new Map();
    const personPromises = personArr.map(async (elem, index) => {
        const cachedPerson = CAST_CREW_CACHE.get(elem.id);
        if (cachedPerson) {
            personMap.set(index + 1, {
                person: cachedPerson,
                ...(isCast ? { character: elem.character } : {})
            });
        } else {
            try {
                const personData = await tmdb.extractPerson(elem.id); // fetch
                if (!personData.id || !personData.imdb_id || !personData.name) {
                    console.log("Missing <tmdbID>, <imdbID> or <name> in apiManager.personData " + personData.name);
                } else {
                    const person = (new PersonItem()).setInstance(
                        personData.id.toString(),
                        personData.imdb_id,
                        personData.name,
                        personData.birthday,
                        personData.place_of_birth,
                        personData.gender,
                        "https://image.tmdb.org/t/p/original" + personData.profile_path,
                        personData.biography);

                    CAST_CREW_CACHE.set(elem.id, person);
                    personMap.set(index + 1, {
                        person,
                        ...(isCast ? { character: elem.character } : {})
                    });
                }
            } catch (err) {
                console.error(`Error fetching person ${elem.id} <tmdb>:\n`, err);
                // insert a placeholder entry
                personMap.set(index + 1, {
                    person: null,
                    ...(isCast ? { character: elem.character } : {})
                });
            }
        }
    });
    await Promise.all(personPromises);
    return [...personMap.entries()].sort((a, b) => a[0] - b[0]).map((elem) => elem[1]);
}

module.exports = {
    getMovieSearchResult: getMovieSearchResult,
    constructMovieFromAPIs: constructMovieFromAPIs
}