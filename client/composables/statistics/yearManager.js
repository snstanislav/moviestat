/**
 * @file yearManager.js
 * @description Provides functions to compute movie statistics by year and decade.
 * @author Stanislav Snisar
 * @version 1.1.0
 * @created 03.03.2024
 * @modified 10/2025
 * @module composables/statistics/yearManager
 */

import { composeFullStat, sortStat, setStatMapEntry, calcPercentsAndRatesStat, FilmStatMode, SortStatMode } from './statisticsGenerator';

/**
 * Generates statistical data for films grouped by individual year.
 * 
 * @function getYearStat
 * @param {Array<Object>} db - Array of film evaluation objects, each containing:
 *   - {Object} movie - Movie object with year property
 *   - {number} userRating - User's rating for the film
 * @param {string} sortMode - Sorting mode from SortStatMode enum
 * 
 * @returns {Map<string, Object>} Sorted Map of year statistics where:
 *   - Key: Year string (e.g., '1999', '2010')
 *   - Value: Object containing:
 *     - {number} quantity - Number of films from this year
 *     - {string} percent - Percentage of total films (2 decimal places)
 *     - {string} rating - Average user rating for this year (2 decimal places)
 *   Only includes years with quantity > 0 (empty years filtered out)
 * 
 * @description Computes year-based statistics with a pre-initialized map covering all years
 *   from 1895 (cinema's birth) to current year + 1. Filters out years with no films before returning.
 * 
 * **Processing steps:**
 * 1. Initializes complete year range map (1895 to current year + 1)
 * 2. Populates statistics using composeFullStat
 * 3. Applies specified sorting
 * 4. Filters out years with zero films
 * 
 * @example
 * // Get year statistics sorted by year descending (newest first)
 * const films = [
 *   { movie: { year: '1999' }, userRating: 9.0 },
 *   { movie: { year: '1999' }, userRating: 8.8 },
 *   { movie: { year: '2010' }, userRating: 8.7 }
 * ];
 * 
 * const yearStats = getYearStat(films, SortStatMode.KEY_DESC);
 * // Map {
 * //   '2010' => { quantity: 1, percent: '33.33', rating: '8.70' },
 * //   '1999' => { quantity: 2, percent: '66.67', rating: '8.90' }
 * // }
 */
export function getYearStat(db, sortMode) {
  let resultMap = sortStat(composeFullStat(db, FilmStatMode.YEAR, initYearMap()), sortMode);
  resultMap = new Map([...resultMap].filter(elem => elem[1].quantity > 0));
  return resultMap;
}

/**
 * Generates statistical data for films grouped by decade or partial decade ranges.
 * 
 * @function composeDecadeStat
 * @param {Array<Object>} db - Array of film evaluation objects
 * @param {string} sortMode - Sorting mode from SortStatMode enum
 * 
 * @returns {Map<string, Object>} Sorted Map of decade statistics where:
 *   - Key: Decade range string with formats:
 *     - Complete decade: "2010" (only 2010 has films in the 2010s)
 *     - Partial range: "2010-2014" (films from 2010 to 2014 only)
 *     - Full decade: "2010-2019" (films throughout entire decade)
 *   - Value: Object containing:
 *     - {number} quantity - Total films in this decade range
 *     - {string} percent - Percentage of total films (2 decimal places)
 *     - {string} rating - Average user rating for this range (2 decimal places)
 *   Returns empty Map if db is invalid. Only includes ranges with quantity > 0.
 * 
 * @description Intelligently groups films by decades, creating ranges based on actual data distribution.
 *   Handles both chronological directions (past-to-future or future-to-past) and creates
 *   human-readable range labels. Decade boundaries are years divisible by 10 (2000, 2010, 2020, etc.).
 * 
 * **Rating calculation:**
 * - Accumulates: (year's average rating) × (year's quantity)
 * - Final: Total accumulated / total quantity for accurate weighted average
 * 
 * **Special cases:**
 * - Single year in decade: "2020" (not "2020-2020")
 * - Partial decade: "2020-2024" (current incomplete decade)
 * - Full decade: "2010-2019" (complete 10-year span)
 * 
 * @example
 * // Complete decades
 * const films = []; // Films from 2000-2009 and 2010-2019
 * const stats = composeDecadeStat(films, SortStatMode.QUANTITY_DESC);
 * // Map {
 * //   '2010-2019' => { quantity: 45, ... },
 * //   '2000-2009' => { quantity: 38, ... }
 * // }
 */
export function composeDecadeStat(db, sortMode) {
  let yearFullStat = composeFullStat(db, FilmStatMode.YEAR,
    initYearMap());
  if (yearFullStat) {
    const yearArr = [...yearFullStat.entries()];
    let decadeMap = new Map();
    let currGroupSum = 0;
    let currRateSum = 0;
    let totalQuantity = 0;
    let firstYearInGroup = yearArr[0][0];

    if (yearArr[0][0] > yearArr[yearArr.length - 1][0]) {
      /* from future to past */
      for (let i = 0; i < yearArr.length; i += 1) {
        if (yearArr[i][0] % 10 == 0) {
          /* decade beginning detected */
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
          if (yearArr[i][0] == firstYearInGroup) {
            /* decade is currently
        represented by only its first year */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}`, totalQuantity, currRateSum, currGroupSum);
          } else {
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}-${firstYearInGroup}`, totalQuantity, currRateSum, currGroupSum)
          }
          //== reset ==
          currGroupSum = 0;
          currRateSum = 0;
          firstYearInGroup = yearArr[i + 1][0];
        } else if (i == yearArr.length - 1) {
          /* the very last year */
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
          if (yearArr[i][0] == firstYearInGroup) {
            /* the very last year
        represents the first one in its current group */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}`, totalQuantity, currRateSum, currGroupSum)
          } else {
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}-${firstYearInGroup}`, totalQuantity, currRateSum, currGroupSum)
          }
        } else {
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
        }
      }
    } else if (yearArr[0][0] < yearArr[yearArr.length - 1][0]) {
      /* from past to future */
      for (let i = 0; i < yearArr.length; i += 1) {
        if (yearArr[i][0] % 10 == 0) {
          /* decade beginning detected*/
          if (yearArr[i - 1][0] == firstYearInGroup) {
            /* the first decade is represented by only its last year */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i - 1][0]}`,
              totalQuantity, currRateSum, currGroupSum)
          } else {
            /* and now save previous decade */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap,
              `${firstYearInGroup}-${yearArr[i - 1][0]}`, totalQuantity,
              currRateSum, currGroupSum)
          }
          //=== increase ===
          currGroupSum = yearArr[i][1].quantity;
          currRateSum = Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
          firstYearInGroup = yearArr[i][0];
          if (i == yearArr.length - 1) {
            /* decade's first year appears to be the very last one */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}`, totalQuantity, currRateSum, currGroupSum)
          }
        } else if (i == yearArr.length - 1) {
          /* the very last year; processing the last decade */
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
          if (yearArr[i][0] == firstYearInGroup) {
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}`, totalQuantity, currRateSum, currGroupSum)
          } else {
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${firstYearInGroup}-${yearArr[i][0]}`,
              totalQuantity, currRateSum, currGroupSum)
          }
        } else {
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
        }
      }
    }
    let resultMap = calcPercentsAndRatesStat(decadeMap, totalQuantity);
    resultMap = new Map([...resultMap].filter(elem => elem[1].quantity > 0));
    return sortStat(resultMap, sortMode);
  } else {
    return new Map();
  }
}

/**
 * Initializes a Map with all years from 1895 to current year + 1, pre-populated with zero values.
 * 
 * @function initYearMap
 * @private
 * @returns {Map<string, Object>} Map where:
 *   - Key: Year string (e.g., '1895', '1896', ..., '2025', '2026')
 *   - Value: Object with:
 *     - {number} quantity - Initialized to 0
 *     - {number} percent - Initialized to 0
 *     - {number} rating - Initialized to 0
 * 
 * @description Creates a complete year range map from cinema's birth (1895) to one year beyond
 *   the current year. All years are pre-initialized with zero values to ensure consistent
 *   year-based queries and sorting, even for years without any films.
 * 
 * **Purpose:**
 * - Ensures all possible years have entries in the map
 * - Prevents missing years in chronological displays
 * - Enables year-based sorting without gaps
 * 
 * **Implementation:**
 * 1. Calculates array size: (current year + 1 - 1895)
 * 2. Creates array of [year, {quantity: 0, percent: 0, rating: 0}] pairs
 * 3. Converts to Map for O(1) access
 */
function initYearMap() {
  let yearInitArr = new Array(
    new Date().getFullYear() + 1 - 1895);
  for (let i = 0; i < yearInitArr.length; i += 1) {
    yearInitArr[i] = [String(i + 1895),
    {
      quantity: 0,
      percent: 0,
      rating: 0
    }];
  }
  return new Map(yearInitArr);
}