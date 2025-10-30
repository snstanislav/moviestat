/**
 * @file apiManager.js
 * @description API manager module that orchestrates data retrieval from multiple movie database APIs
 *   (TMDB and OMDB) and transforms the data into standardized domain objects. Handles caching,
 *   data aggregation, and formatting for consistent application-wide use.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module api/apiManager
 * @requires dotenv - For loading environment variables
 * @requires ./tmdbProvider - TMDB API provider functions
 * @requires ./omdbProvider - OMDB API provider functions
 * @requires ../domain/MovieItem - Movie domain model
 * @requires ../domain/PersonItem - Person domain model
 * @requires ../domain/SearchItem - Search result domain model
 */

require("dotenv").config();
const tmdb = require("./tmdbProvider");
const { LABELS } = tmdb;
const omdb = require("./omdbProvider");
const MovieItem = require("../domain/MovieItem");
const PersonItem = require("../domain/PersonItem");
const SearchItem = require("../domain/SearchItem");

/**
 * Cache is used to avoid additional API requests for multiple occasions of the same person
 */
const CAST_CREW_CACHE = new Map();

/**
 * Searches for movies and TV shows across TMDB and returns formatted results.
 * 
 * @async
 * @function getMovieSearchResult
 * @param {string} query - Search query string (movie/TV show title)
 * @param {string} page - Page number for paginated results (1-indexed)
 * 
 * @returns {Promise<Object>} A promise that resolves to a formatted search results object containing:
 *   - {number} totalResults - Total number of search results found
 *   - {number} totalPages - Total number of pages available
 *   - {number} currentPage - Current page number
 *   - {Array<SearchItem>} results - Array of SearchItem instances with properties:
 *     - {number} tmdbID - TMDB ID of the media
 *     - {string} title - Title of the movie or TV show
 *     - {('movie'|'tv')} type - Media type
 *     - {string} year - Release year (YYYY format) or empty string if unavailable
 *     - {string} poster - Full URL to poster image or TMDB placeholder logo
 *     - {string} overview - Plot synopsis/overview
 * 
 * @throws {Error} May throw errors from tmdb.extractSearchResults if API request fails
 * 
 * @description Searches TMDB for movies and TV shows matching the query, filters out non-media results
 *   (excludes 'person' type), sorts by popularity (descending), and formats the data into SearchItem domain objects. 
 *   Handles missing data gracefully by providing fallback values.
 * 
 * **Data transformations:**
 * - Filters results to include only 'movie' and 'tv' media types
 * - Sorts results by popularity (highest first)
 * - Extracts year from full date strings (YYYY-MM-DD → YYYY)
 * - Constructs full poster URLs using TMDB image base URL
 * - Falls back to backdrop image if poster is unavailable
 * - Uses TMDB placeholder logo if no images are available
 * - Handles both movie fields (title, release_date) and TV fields (name, first_air_date)
 * 
 * **Image URL construction:**
 * - Poster images: `https://image.tmdb.org/t/p/original{poster_path}`
 * - Fallback: TMDB blue square logo
 * 
 * @example
 * // Search for movies and TV shows
 * const results = await getMovieSearchResult('inception', '1');
 * console.log(results);
 * // {
 * //   totalResults: 45,
 * //   totalPages: 3,
 * //   currentPage: 1,
 * //   results: [
 * //     SearchItem {
 * //       tmdbID: 27205,
 * //       title: 'Inception',
 * //       type: 'movie',
 * //       year: '2010',
 * //       poster: 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
 * //       overview: 'Cobb, a skilled thief...'
 * //     },
 * //     ...
 * //   ]
 * // }
 * 
 * @see {@link SearchItem} - Domain model for search results
 * @see {@link module:tmdbProvider.extractSearchResults} - TMDB search API function
 */
async function getMovieSearchResult(query, page) {
    const searchResult = await tmdb.extractSearchResults(query, page);
    searchResult.results.sort((a, b) => b.popularity - a.popularity);

    const resultObj = {
        totalResults: searchResult.total_results,
        totalPages: searchResult.total_pages,
        currentPage: searchResult.page,
        results: []
    }

    for (let i = 0; i < searchResult.results.length; i++) {
        if (searchResult.results[i].media_type === "movie"
            || searchResult.results[i].media_type === "tv") {
            let searchObj = new SearchItem({
                tmdbID: searchResult.results[i].id,
                title: searchResult.results[i].title || searchResult.results[i].name,
                type: searchResult.results[i].media_type,
                year: searchResult.results[i].release_date || searchResult.results[i].first_air_date || "",
                poster: searchResult.results[i].poster_path || searchResult.results[i].backdrop_path || "",
                overview: searchResult.results[i].overview
            });

            resultObj.results.push(searchObj);
            var lastIndex = resultObj.results.length - 1;
            var lastElem = resultObj.results[lastIndex];

            lastElem.year || lastElem.year.trim() !== ""
                ? lastElem.year = lastElem.year.slice(0, 4) : "";

            lastElem.poster || lastElem.poster.trim() !== ""
                ? lastElem.poster = "https://image.tmdb.org/t/p/original" + lastElem.poster
                : lastElem.poster = "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg";
        }
    }
    return resultObj;
}

/**
 * Constructs a complete MovieItem by aggregating data from TMDB and OMDB APIs.
 * 
 * @async
 * @function constructMovieFromAPIs
 * @param {string} tmdbIdSearched - The TMDB ID of the movie or TV show
 * @param {('movie'|'tv')} mediaType - The type of media to fetch
 * @param {number} [userRating] - Optional user rating (0-10 scale)
 * @param {string} [userEvalDate] - Optional user evaluation date
 * 
 * @returns {Promise<MovieItem|undefined>} A promise that resolves to a fully populated MovieItem instance
 *   containing aggregated data from both TMDB and OMDB, or undefined if an error occurs.
 * 
 * @throws {Error} Throws if API requests fail or data construction fails
 * 
 * @description Orchestrates data retrieval from multiple APIs (TMDB and OMDB) and combines
 *   the results into a single MovieItem domain object. Prioritizes data sources based on
 *   completeness and reliability. Also fetches and attaches complete cast and crew information.
 * 
 * **Data source priority:**
 * - IDs: TMDB for tmdbID, TMDB/OMDB fallback for imdbID
 * - Ratings: OMDB for IMDb ratings and vote counts
 * - Titles: TMDB for common title, TMDB for original title
 * - Year: OMDB first, falls back to TMDB release_date or first_air_date
 * - Duration: OMDB first, falls back to TMDB runtime (converted to "X min" format)
 * - Content rating: OMDB only (Rated field)
 * - Plot: TMDB overview first, falls back to OMDB Plot
 * - Poster: TMDB poster_path first (full resolution), falls back to OMDB Poster (URL cleaned)
 * - Financial: TMDB for budget and revenue (boxOffice)
 * - Lists: TMDB for countries, languages, genres (extracted from objects to name strings)
 * - Credits: Fetched separately via constructCredits function
 * 
 * **Image URL handling:**
 * - TMDB posters: Converted to full URL with "original" quality
 * - OMDB posters: SX{width} parameter removed for maximum resolution
 * 
 * **Cast and crew processing:**
 * - Directors, writers, producers, composers filtered by job title
 * - All persons fetched with caching to avoid duplicate requests
 * - Missing person data handled gracefully with placeholders
 * 
 * @example
 * // Construct a TV show with user rating
 * const tvShow = await constructMovieFromAPIs('4087', 'tv', 8, '2024-10-15T10:30:00Z');
 * console.log(tvShow.userRating); // 8
 * 
 * @see {@link MovieItem} - Domain model for movies and TV shows
 * @see {@link constructCredits} - Helper function for fetching credits
 * @see {@link module:tmdbProvider.extractMedia} - TMDB media details API
 * @see {@link module:omdbProvider.extractMedia} - OMDB media details API
 */
async function constructMovieFromAPIs(tmdbIdSearched, mediaType, userRating, userEvalDate) {
    try {
        const resultMovieItem = new MovieItem();
        const tmdbSrcMovieItem = await tmdb.extractMedia(tmdbIdSearched, mediaType); //fetch
        const omdbSrcMovieItem = await omdb.extractMedia(tmdbSrcMovieItem.imdb_id); //fetch

        resultMovieItem.type = mediaType;
        resultMovieItem.tmdbID = tmdbSrcMovieItem.id.toString();
        resultMovieItem.imdbID = tmdbSrcMovieItem.imdb_id || omdbSrcMovieItem.imdbID;
        resultMovieItem.imdbRating = omdbSrcMovieItem.imdbRating;
        resultMovieItem.imdbVotes = omdbSrcMovieItem.imdbVotes;
        resultMovieItem.commTitle = tmdbSrcMovieItem.title || omdbSrcMovieItem.Title;
        resultMovieItem.origTitle = tmdbSrcMovieItem.original_title || tmdbSrcMovieItem.original_name;
        resultMovieItem.year = omdbSrcMovieItem.Year || tmdbSrcMovieItem.release_date || tmdbSrcMovieItem.first_air_date;
        resultMovieItem.duration = omdbSrcMovieItem.Runtime || tmdbSrcMovieItem.runtime ? tmdbSrcMovieItem.runtime + " min" : "";
        resultMovieItem.parental = omdbSrcMovieItem.Rated;
        resultMovieItem.plot = tmdbSrcMovieItem.overview || omdbSrcMovieItem.Plot;
        resultMovieItem.poster =
            (tmdbSrcMovieItem.poster_path ? "https://image.tmdb.org/t/p/original" + tmdbSrcMovieItem.poster_path : "")
            || (omdbSrcMovieItem.Poster ? omdbSrcMovieItem.Poster.replace(/_SX\d+/, "") : "");
        resultMovieItem.budget = tmdbSrcMovieItem.budget;
        resultMovieItem.boxOffice = tmdbSrcMovieItem.revenue;

        resultMovieItem.year ? resultMovieItem.year.slice(0, 4) : "";

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
        const error = new Error(`Error movie item constructing <constructMovieFromAPIs>: ${err.message}`);
        error.originalError = err;
        throw error;
    }
}

/**
 * Fetches and organizes cast and crew credits from TMDB, categorized by role.
 * 
 * @async
 * @function constructCredits
 * @param {string} tmdbMovieID - The TMDB ID of the movie or TV show
 * @param {('movie'|'tv')} mediaType - The type of media
 * 
 * @returns {Promise<Object|undefined>} A promise that resolves to an object containing categorized credits:
 *   - {Array<Object>} directors - Array of director objects, each containing:
 *     - {PersonItem} person - PersonItem instance with director details
 *   - {Array<Object>} writers - Array of writer objects (screenplay writers), each containing:
 *     - {PersonItem} person - PersonItem instance with writer details
 *   - {Array<Object>} producers - Array of producer objects, each containing:
 *     - {PersonItem} person - PersonItem instance with producer details
 *   - {Array<Object>} composers - Array of composer objects (music composers), each containing:
 *     - {PersonItem} person - PersonItem instance with composer details
 *   - {Array<Object>} cast - Array of cast member objects, each containing:
 *     - {PersonItem} person - PersonItem instance with actor details
 *     - {string} character - Character name portrayed by the actor
 * 
 * @returns {Promise<undefined>} Returns undefined if an error occurs
 * @throws {Error} Throws if API request fails
 * @description Retrieves cast and crew data from TMDB and filters crew members into specific
 *   role categories (directors, writers, producers, composers) based on their job titles.
 *   Uses LABELS constants to match job titles to categories. All persons are processed through
 *   prepareCastCrewList which handles caching and detailed person data fetching.
 * 
 * **Performance considerations:**
 * - Person data fetched in parallel via prepareCastCrewList
 * - Caching prevents duplicate API requests for the same person
 * 
 * @example
 * // Get credits for a movie
 * const credits = await constructCredits('550', 'movie');
 * console.log(credits);
 * // {
 * //   directors: [{ person: PersonItem { name: 'David Fincher', ... } }],
 * //   writers: [{ person: PersonItem { name: 'Chuck Palahniuk', ... } }],
 * //   producers: [{ person: PersonItem { name: 'Art Linson', ... } }],
 * //   composers: [{ person: PersonItem { name: 'Dust Brothers', ... } }],
 * //   cast: [
 * //     { person: PersonItem { name: 'Brad Pitt', ... }, character: 'Tyler Durden' },
 * //     { person: PersonItem { name: 'Edward Norton', ... }, character: 'The Narrator' }
 * //   ]
 * // }
 * 
 * @see {@link prepareCastCrewList} - Helper function for processing person arrays
 * @see {@link module:tmdbProvider.extractCredits} - TMDB credits API
 * @see {@link module:tmdbProvider.LABELS} - Job title constants for filtering crew members
 * @see {@link PersonItem} - Domain model for persons
 */
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
        const error = new Error(`Error fetching cast/crew <constructCredits>: ${err.message}`);
        error.originalError = err;
        throw error;
    }
}

/**
 * Processes an array of cast or crew members, fetches detailed person data, and returns
 * formatted objects with optional character information. Utilizes caching to minimize API requests.
 * 
 * @async
 * @function prepareCastCrewList
 * @param {Array<Object>} personArr - Array of person objects from TMDB credits API, each containing:
 *   - {number} id - TMDB person ID
 *   - {string} [character] - Character name (for cast members only)
 *   - Additional TMDB person/credit fields
 * @param {boolean} isCast - Flag indicating if the array contains cast members (true) or crew (false)
 *   - If true, includes character field in the returned objects
 *   - If false, omits character field
 * 
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of objects, each containing:
 *   - {PersonItem|null} person - PersonItem instance with detailed person data, or null if fetch failed
 *   - {string} [character] - Character name (only included if isCast is true)
 * 
 * @description Processes person data in parallel, fetching detailed information from TMDB for each person.
 *   Maintains original order from the input array (important for cast billing order).
 * 
 * **Caching mechanism:**
 * - Stores fetched PersonItem instances in cache using TMDB person ID as key
 * - Cache persists across multiple function calls during application lifetime
 * 
 * **Error handling:**
 * - Individual person fetch failures are caught and logged
 * - Failed fetches result in placeholder entries with person: null
 * - Errors don't stop processing of other persons in the array
 * - Missing required fields (id, imdb_id, name) trigger console warnings
 * 
 * **Performance optimizations:**
 * - All person fetches executed in parallel using Promise.all
 * - Uses Map for O(1) insertion and maintains order
 * - Sorts final array by original index to preserve appearance order
 * 
 * **Photo URL construction:**
 * - TMDB profile_path converted to full URL with "original" quality
 * - Empty string used if profile_path is null/undefined
 * 
 * @example
 * // Process cast members (with character names)
 * const castData = [
 *   { id: 287, character: 'Tyler Durden', ... },
 *   { id: 819, character: 'The Narrator', ... }
 * ];
 * const cast = await prepareCastCrewList(castData, true);
 * console.log(cast);
 * // [
 * //   {
 * //     person: PersonItem { tmdbID: '287', name: 'Brad Pitt', ... },
 * //     character: 'Tyler Durden'
 * //   },
 * //   {
 * //     person: PersonItem { tmdbID: '819', name: 'Edward Norton', ... },
 * //     character: 'The Narrator'
 * //   }
 * // ]
 * 
 * @example
 * // Process crew members (without character names)
 * const crewData = [
 *   { id: 7467, job: 'Director', ... }
 * ];
 * const directors = await prepareCastCrewList(crewData, false);
 * console.log(directors);
 * // [
 * //   {
 * //     person: PersonItem { tmdbID: '7467', name: 'David Fincher', ... }
 * //     // No character field
 * //   }
 * // ]
 * 
 * @example
 * // Handling cache hits
 * const cast1 = await prepareCastCrewList([{ id: 287, character: 'Tyler' }], true);
 * // First call: Fetches from API and caches
 * 
 * const cast2 = await prepareCastCrewList([{ id: 287, character: 'Mr. Smith' }], true);
 * // Second call: Uses cached data, no API request
 * // Same person, different character
 * 
 * @example
 * // Handling failed fetches
 * const cast = await prepareCastCrewList([
 *   { id: 999999, character: 'Ghost' } // Invalid ID
 * ], true);
 * console.log(cast[0].person); // null (placeholder)
 * console.log(cast[0].character); // 'Ghost' (still included)
 * 
 * @see {@link PersonItem} - Domain model for persons
 * @see {@link module:tmdbProvider.extractPerson} - TMDB person details API
 */
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
                    const person = (new PersonItem({
                        tmdbID: personData.id.toString(),
                        imdbID: personData.imdb_id,
                        name: personData.name,
                        birthday: personData.birthday,
                        placeOfBirth: personData.place_of_birth,
                        gender: personData.gender,
                        photo: personData.profile_path ? "https://image.tmdb.org/t/p/original" + personData.profile_path : "",
                        biography: personData.biography
                    }));

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
    getMovieSearchResult,
    constructMovieFromAPIs
}