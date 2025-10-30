/**
 * @file statisticsGenerator.js
 * @description Core statistics generation engine for film data analysis.
 *   Provides functions to aggregate, calculate, and sort film statistics across various
 *   properties (year, genre, country, language, etc.) with support for ratings and percentages.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @created 04.03.2024
 * @modified 10.2025
 * @module composables/statistics/statisticsGenerator
 */

/**
 * Enumeration of available film statistical properties for analysis.
 * 
 * @constant {Object} FilmStatMode
 * @property {string} TYPE - Media type ('movie' or 'tv')
 * @property {string}  YEAR - Release year
 * @property {string} DECADE - Release decade (derived from year)
 * @property {string} COUNTRY - Production countries
 * @property {string} LANGUAGE - Spoken languages
 * @property {string} GENRE - Film genres
 * @property {string} DIRECTOR - Directors
 * @property {string} WRITER - Writers/screenwriters
 * @property {string} PRODUCER - Producers
 * @property {string} COMPOSER - Music composers
 * @property {string} ACTOR - Cast members
 * @property {string} USER_RATING - User's rating score
 * @property {string} FAVORITE - Favorite flag status
 * 
 * @description Defines property keys used for statistical analysis and grouping.
 *   Values correspond to field names in film evaluation objects.
 */
export const FilmStatMode = {
  TYPE: "type",
  YEAR: "year",
  DECADE: "decade",
  COUNTRY: "countries",
  LANGUAGE: "languages",
  GENRE: "genres",
  DIRECTOR: "directors",
  WRITER: "writers",
  PRODUCER: "producers",
  COMPOSER: "composers",
  ACTOR: "cast",
  USER_RATING: "userRating",
  FAVORITE: "isFavorite"
};

/**
 * Enumeration of available sorting modes for statistical data.
 * 
 * @constant {Object} SortStatMode
 * @property {string} KEY_ASC - Sort by key (alphabetically ascending)
 * @property {string} KEY_DESC - Sort by key (alphabetically descending)
 * @property {string} QUANTITY_ASC - Sort by quantity (ascending)
 * @property {string} QUANTITY_DESC - Sort by quantity (descending)
 * @property {string} RATING_ASC - Sort by rating (ascending)
 * @property {string} RATING_DESC - Sort by rating (descending)
 * 
 * Film-specific:
 * @property {string} YEAR_ASC - Sort by year (ascending)
 * @property {string} YEAR_DESC - Sort by year (descending)
 * @property {string} USER_RATING_ASC - Sort by user rating (ascending)
 * @property {string} USER_RATING_DESC - Sort by user rating (descending)
 * @property {string} IMDB_RATING_ASC - Sort by IMDb rating (ascending)
 * @property {string} IMDB_RATING_DESC - Sort by IMDb rating (descending)
 * @property {string} IMDB_EVALNUM_ASC - Sort by IMDb vote count (ascending)
 * @property {string} IMDB_EVALNUM_DESC - Sort by IMDb vote count (descending)
 * @property {string} EVAL_DATETIME_ASC - Sort by evaluation date (ascending)
 * @property {string} EVAL_DATETIME_DESC - Sort by evaluation date (descending)
 * 
 * @description Defines sorting strategies for statistical maps and film lists.
 *   Universal modes work with any statistics; film-specific modes are for individual film sorting.
 */
export const SortStatMode = {
  // universal
  KEY_ASC: "key-asc",
  KEY_DESC: "key-desc",
  QUANTITY_ASC: "quantity-asc",
  QUANTITY_DESC: "quantity-desc",
  RATING_ASC: "rating-asc",
  RATING_DESC: "rating-desc",
  // for films
  YEAR_ASC: "year-asc",
  YEAR_DESC: "year-desc",
  USER_RATING_ASC: "user-rating-asc",
  USER_RATING_DESC: "user-rating-desc",
  IMDB_RATING_ASC: "imdb-rating-asc",
  IMDB_RATING_DESC: "imdb-rating-desc",
  IMDB_EVALNUM_ASC: "imdb-evalnum-asc",
  IMDB_EVALNUM_DESC: "imdb-evalnum-desc",
  EVAL_DATETIME_ASC: "eval-datetime-asc",
  EVAL_DATETIME_DESC: "eval-datetime-desc"
};

/**
 * Composes complete statistical data for a specific film property.
 * 
 * @function composeFullStat
 * @param {Array<Object>} db - Array of film evaluation objects, each containing:
 *   - {Object} movie - Movie object with all film properties
 *   - {number} userRating - User's rating for the film
 * @param {string} filmProperty - Property to analyze (from FilmStatMode)
 * @param {Map<string, Object>} [propertyMap=new Map()] - Optional initial Map to populate
 * 
 * @returns {Map<string, Object>|undefined} Map where:
 *   - Key: Property value (e.g., genre name, year, country)
 *   - Value: Object containing:
 *     - {number} quantity - Number of films with this property
 *     - {string} percent - Percentage of total films (2 decimal places)
 *     - {string} rating - Average user rating for films with this property (2 decimal places)
 *   Returns undefined if db is invalid
 * 
 * @description Analyzes user film evaluation database
 * and generates statistical aggregations for a specified property.
 * 
 * **Calculation process:**
 * 1. Iterates through all films in database
 * 2. For each property value, accumulates quantity and rating sum
 * 3. Calculates percentage relative to total films
 * 4. Calculates average rating (total rating / quantity)
 * 
 * @example
 * // Generate genre statistics
 * const films = [
 *   { movie: { genres: ['Drama', 'Thriller'], year: '1999' }, userRating: 9.0 },
 *   { movie: { genres: ['Drama'], year: '2010' }, userRating: 8.5 }
 * ];
 * 
 * const genreStats = composeFullStat(films, FilmStatMode.GENRE);
 * // Map {
 * //   'Drama' => { quantity: 2, percent: '100.00', rating: '8.75' },
 * //   'Thriller' => { quantity: 1, percent: '50.00', rating: '9.00' }
 * // }
 * 
 * @example
 * // Generate year statistics (automatically sorted descending)
 * const yearStats = composeFullStat(films, FilmStatMode.YEAR);
 * // Map {
 * //   '2010' => { quantity: 1, percent: '50.00', rating: '8.50' },
 * //   '1999' => { quantity: 1, percent: '50.00', rating: '9.00' }
 * // }
 */
export function composeFullStat(db, filmProperty, propertyMap = new Map()) {
  if (db) {
    let totalQuantity = 0;
    if (filmProperty === FilmStatMode.YEAR
      || filmProperty === FilmStatMode.DECADE
      || filmProperty === FilmStatMode.GENRE
      || filmProperty === FilmStatMode.LANGUAGE
      || filmProperty === FilmStatMode.COUNTRY) {

      switch (filmProperty) {
        case FilmStatMode.YEAR:
          db.forEach(item => {
            totalQuantity = setStatMapEntry(propertyMap, item.movie.year.slice(0, 4), totalQuantity, item.userRating, 1);
          });
          /* do not change initial sort order */
          propertyMap = new Map([...propertyMap.entries()]
            .sort((a, b) => b[0] - a[0]));
          break;
        case FilmStatMode.GENRE:
          db.forEach(item => {
            item.movie[filmProperty].forEach(elem => {
              totalQuantity = setStatMapEntry(propertyMap, elem, totalQuantity, item.userRating, 1);
            });
          });
          break;
        case FilmStatMode.LANGUAGE:
          db.forEach(item => {
            item.movie[filmProperty].forEach(elem => {
              totalQuantity = setStatMapEntry(propertyMap, elem, totalQuantity, item.userRating, 1);
            });
          });
          break;
        case FilmStatMode.COUNTRY:
          db.forEach(item => {
            item.movie[filmProperty].forEach(elem => {
              totalQuantity = setStatMapEntry(propertyMap, elem, totalQuantity, item.userRating, 1);
            });
          });
          break;
        default:
          console.error(`StatisticsGenerator: compose mode error`);
          break;
      }
    } else {
      console.error(`StatisticsGenerator: compose mode is not valid`)
    }

    return calcPercentsAndRatesStat(propertyMap, totalQuantity);
  } else {
    console.log("composeFullStat: 'db' is invalid");
  }
}

/**
 * Sorts statistical data according to specified sorting mode.
 * 
 * @function sortStat
 * @param {Map<string, Object>} map - Map of statistical data with structure:
 *   - Key: Property value (string)
 *   - Value: Object with { quantity, percent, rating }
 * @param {string} sortMode - Sorting mode from SortStatMode enum
 * @returns {Map<string, Object>} New sorted Map with same structure as input
 *   Returns empty Map if input is invalid
 * 
 * @description Sorts statistical Map according to various criteria.
 *   Creates a new Map (doesn't modify original) with entries sorted by the specified mode.
 * 
 * **Sorting behavior:**
 * - KEY_ASC/DESC: Alphabetical sorting by key
 * - QUANTITY_ASC/DESC: Primary sort by quantity, secondary by rating (same direction)
 * - RATING_ASC/DESC: Primary sort by rating, secondary by quantity (same direction)
 * - Unrecognized mode: Returns original map unchanged
 * 
 * **Multi-level sorting:**
 * - Quantity modes: First sorts by rating, then by quantity (stable sort ensures secondary order)
 * - Rating modes: First sorts by quantity, then by rating (stable sort ensures secondary order)
 * 
 * @example
 * // Sort by most common (highest quantity first)
 * const stats = new Map([
 *   ['Action', { quantity: 10, percent: '20.00', rating: '7.50' }],
 *   ['Drama', { quantity: 25, percent: '50.00', rating: '8.20' }],
 *   ['Comedy', { quantity: 15, percent: '30.00', rating: '7.80' }]
 * ]);
 * 
 * const sorted = sortStat(stats, SortStatMode.QUANTITY_DESC);
 * // Map {
 * //   'Drama' => { quantity: 25, ... },
 * //   'Comedy' => { quantity: 15, ... },
 * //   'Action' => { quantity: 10, ... }
 * // }
 * 
 * @example
 * // Sort by highest rated (with quantity as tiebreaker)
 * const byRating = sortStat(stats, SortStatMode.RATING_DESC);
 * // Map {
 * //   'Drama' => { rating: '8.20', quantity: 25, ... },
 * //   'Comedy' => { rating: '7.80', quantity: 15, ... },
 * //   'Action' => { rating: '7.50', quantity: 10, ... }
 * // }
 * 
 * @example
 * // Alphabetical sorting
 * const alphabetical = sortStat(stats, SortStatMode.KEY_ASC);
 * // Map { 'Action' => {...}, 'Comedy' => {...}, 'Drama' => {...} }
 */
export function sortStat(map, sortMode) {
  if (map) {
    switch (sortMode) {
      case SortStatMode.KEY_ASC:
        return new Map([...map.entries()].sort());
      case SortStatMode.KEY_DESC:
        return new Map([...map.entries()].sort().reverse());
      case SortStatMode.QUANTITY_ASC:
        return new Map([...map.entries()]
          .sort((a, b) => a[1].rating - b[1].rating)
          .sort((a, b) => a[1].quantity - b[1].quantity));
      case SortStatMode.QUANTITY_DESC:
        return new Map([...map.entries()]
          .sort((a, b) => b[1].rating - a[1].rating)
          .sort((a, b) => b[1].quantity - a[1].quantity));
      case SortStatMode.RATING_ASC:
        return new Map([...map.entries()]
          .sort((a, b) => a[1].quantity - b[1].quantity)
          .sort((a, b) => a[1].rating - b[1].rating));
      case SortStatMode.RATING_DESC:
        return new Map([...map.entries()]
          .sort((a, b) => b[1].quantity - a[1].quantity)
          .sort((a, b) => b[1].rating - a[1].rating));

      default:
        return map;
    }
  } else {
    console.error("sortStat: src map was empty...")
    return new Map();
  }
}

/**
 * Calculates percentages and average ratings for statistical data.
 * 
 * @function calcPercentsAndRatesStat
 * @param {Map<string, Object>} propertyMap - Map with accumulated statistics:
 *   - Key: Property value
 *   - Value: Object with { quantity, rating (sum) }
 * @param {number} totalQuantity - Total number of items across all properties
 * @returns {Map<string, Object>} New Map with calculated values:
 *   - Key: Property value (unchanged)
 *   - Value: Object with:
 *     - {number} quantity - Number of items (unchanged)
 *     - {string} percent - Percentage of total (2 decimal places)
 *     - {string} rating - Average rating (2 decimal places)
 * 
 * @description Performs final statistical calculations on accumulated data.
 *   Converts rating sums to averages and calculates percentage distribution.
 * 
 * **Calculations:**
 * - Percent: (quantity / totalQuantity) × 100, fixed to 2 decimals
 * - Rating: (accumulated rating sum / quantity), fixed to 2 decimals
 * - Special case: If quantity is 0, rating defaults to 0
 * 
 * @example
 * // Calculate final statistics
 * const accumulated = new Map([
 *   ['Drama', { quantity: 2, rating: 17.5 }],  // Sum of ratings: 9.0 + 8.5
 *   ['Thriller', { quantity: 1, rating: 9.0 }]
 * ]);
 * 
 * const result = calcPercentsAndRatesStat(accumulated, 3);
 * // Map {
 * //   'Drama' => { quantity: 2, percent: '66.67', rating: '8.75' },
 * //   'Thriller' => { quantity: 1, percent: '33.33', rating: '9.00' }
 * // }
 * 
 * @example
 * // Handle zero quantity edge case
 * const edge = new Map([
 *   ['Empty', { quantity: 0, rating: 0 }]
 * ]);
 * const result = calcPercentsAndRatesStat(edge, 10);
 * // Map { 'Empty' => { quantity: 0, percent: '0.00', rating: 0 } }
 */
export function calcPercentsAndRatesStat(propertyMap, totalQuantity) {
  const propertyArr = [...propertyMap.entries()];
  const resultMap = new Map()
  propertyArr.forEach(item => {
    resultMap.set(item[0],
      {
        quantity: item[1].quantity,
        percent: (item[1].quantity / totalQuantity * 100).toFixed(2),
        rating: item[1].quantity != 0 ?
          (item[1].rating / item[1].quantity).toFixed(2) : 0
      });
  });
  return resultMap;
}

/**
 * Updates a statistical map entry with new data.
 * 
 * @function setStatMapEntry
 * @param {Map<string, Object>} propertyMap - Map to update
 * @param {string} key - Property value key
 * @param {number} totalQuantity - Current total quantity counter
 * @param {number} rating - Rating value to add to accumulated sum
 * @param {number} incrValue - Value to increment quantity by (typically 1)
 * @returns {number} Updated total quantity after increment
 * 
 * @description Updates or creates a map entry with accumulated statistics.
 *   If key exists, adds to existing values; if not, creates new entry.
 *   Percent is set to 0 and calculated later by calcPercentsAndRatesStat.
 * 
 * **Important notes:**
 * - Rating is accumulated as a sum (not averaged here)
 * - Percent is always 0 until calcPercentsAndRatesStat is called
 * - Skips update if key is falsy (null, undefined, empty string)
 * 
 * @example
 * // Build statistics incrementally
 * const map = new Map();
 * let total = 0;
 * 
 * // First film: Drama rated 9.0
 * total = setStatMapEntry(map, 'Drama', total, 9.0, 1);
 * // map: Map { 'Drama' => { quantity: 1, percent: 0, rating: 9.0 } }
 * // total: 1
 * 
 * // Second film: Drama rated 8.5
 * total = setStatMapEntry(map, 'Drama', total, 8.5, 1);
 * // map: Map { 'Drama' => { quantity: 2, percent: 0, rating: 17.5 } }
 * // total: 2
 * 
 * // Third film: Thriller rated 7.0
 * total = setStatMapEntry(map, 'Thriller', total, 7.0, 1);
 * // map: Map {
 * //   'Drama' => { quantity: 2, percent: 0, rating: 17.5 },
 * //   'Thriller' => { quantity: 1, percent: 0, rating: 7.0 }
 * // }
 * // total: 3
 */
export function setStatMapEntry(propertyMap, key, totalQuantity, rating, incrValue) {
  if (key) {
    let currQuantity = propertyMap.get(key) == undefined ? 0 :
      propertyMap.get(key).quantity;
    let currRate = propertyMap.get(key) == undefined ? 0 :
      propertyMap.get(key).rating;

    propertyMap.set(key, {
      quantity: currQuantity += incrValue,
      percent: 0,
      rating: currRate += Number(rating)
    });
    totalQuantity += incrValue;
  }

  return totalQuantity;
}

/**
 * Retrieves films matching a specific property value with statistics.
 * 
 * @function getSingleProperty
 * @param {Array<Object>} db - Array of film objects
 * @param {string} value - Property value to search for (e.g., '1999', 'Drama')
 * @param {string} filmProperty - Property to search in (from FilmStatMode)
 * 
 * @returns {Object|undefined} Statistics object containing:
 *   - {string} searchItem - The searched value
 *   - {number} quantity - Number of films matching the criteria
 *   - {string} rating - Average rating of matching films (3 decimal places)
 *   - {Array<Object>} filmList - Array of matching film objects
 *   Returns undefined if parameters are invalid
 * 
 * @description Filters films by a specific property value and calculates aggregate statistics.
 *   Handles both simple properties (year, type) and array properties (genres, cast, crew).
 *   For cast and directors, extracts IMDb ID from link for comparison.
 * 
 * **Property handling:**
 * - YEAR: Direct string comparison with film.year
 * - TYPE: Direct string comparison with film.type
 * - Array properties (genres, cast, directors, etc.): Iterates through array
 * 
 * @example
 * // Get all films from 1999
 * const films = [
 *   { commTitle: 'The Matrix', year: '1999', userRating: 9.0, type: 'movie' },
 *   { commTitle: 'Fight Club', year: '1999', userRating: 8.8, type: 'movie' },
 *   { commTitle: 'Inception', year: '2010', userRating: 8.7, type: 'movie' }
 * ];
 * 
 * const result = getSingleProperty(films, '1999', FilmStatMode.YEAR);
 * // {
 * //   searchItem: '1999',
 * //   quantity: 2,
 * //   rating: '8.900',
 * //   filmList: [
 * //     { commTitle: 'The Matrix', year: '1999', userRating: 9.0, ... },
 * //     { commTitle: 'Fight Club', year: '1999', userRating: 8.8, ... }
 * //   ]
 * // }
 */
export function getSingleProperty(db, value, filmProperty) {
  if (filmProperty && db) {
    let count = 0;
    let amount = 0;
    let filmList = [];
    db.forEach((film) => {

      if (filmProperty == FilmStatMode.YEAR) {
        if (film.year == value) {
          count += 1;
          amount += Number(film.userRating);
          filmList.push([film.commTitle, film.year])
        }
      } else if (filmProperty == FilmStatMode.TYPE) {
        if (film.type == value) {
          count += 1;
          amount += Number(film.userRating);
          filmList.push([film.commTitle, film.year])
        }
      } else {
        film[filmProperty].forEach(elem => {
          const property = (filmProperty == FilmStatMode.ACTOR || filmProperty ==
            FilmStatMode.DIRECTOR) ? extractIdFromLinkIMDB(elem.imdbLink) : elem;
          if (property == value) {
            count += 1;
            amount += Number(film.userRating);
            //filmList.push([film.commTitle, film.year, film.userRating]);
            //filmList.push(film.commTitle);
            filmList.push(film);
          }
        });
      }
    });
    return {
      searchItem: value,
      quantity: count,
      rating: (amount / count).toFixed(3),
      filmList: filmList
    }
  } else {
    console.error("StatisticsGenerator: invalid single property...")
  }
}

/**
 * Extracts IMDb ID from an IMDb URL.
 * @function extractIdFromLinkIMDB
 * @param {string} link - Full IMDb URL (e.g., 'https://imdb.com/name/nm0000093/bio')
 * @returns {string|undefined} Extracted IMDb ID (e.g., 'nm0000093', 'tt0137523')
 *   Returns undefined if link doesn't contain '/name/' or '/title/'
 * @description Parses IMDb URLs and extracts the ID portion.
 *   Supports both person URLs (/name/) and title URLs (/title/).
 */
export function extractIdFromLinkIMDB(link) {
  if (link.includes("/name/") || link.includes("/title/")) {
    let category = link.includes("/name/") ? "/name/" : (link.includes("/title/") ?
      "/title/" : "")
    let indS = link.indexOf(category) + category.length;
    let indE = link.indexOf("/", indS);
    return link.substring(indS, indE);
  } else {
    return undefined;
  }
}