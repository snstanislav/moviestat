/**
 * @file movieManager.js
 * @description Sorting and filtering logic for the Movie table view.
 * @author Stanislav Snisar
 * @version 1.1.0
 * @created 05.03.2024
 * @modified 10.2025
 * @module composables/statistics/movieManager
 */

import { FilmStatMode, SortStatMode } from "./statisticsGenerator";
import { defaultSortRecentDate, normalizeYear, normalizeIMDBVotes } from "../utils";

/**
 * Main entry to retrieve sorted & filtered movie stats for the UI.
 *
 * @param {Array<Object>} db - Array of film evaluation objects
 * @param {string} sortMode - Sort mode from SortStatMode.
 * @param {string} filterMode - Filter mode from FilmStatMode.
 * @param {string} filterValue - Value applied to filter.
 * @returns {Array<Object>} Processed movie dataset.
 */
export function getMovieStat(db, sortMode, filterMode, filterValue) {
  return filterMovieTable(sortMovieStat(db, sortMode), filterMode, filterValue);
}

/**
 * Sort movie table data by the requested sort mode.
 * Caller should pass copies if immutability is required.
 *
 * @param {Array<Object>} db - Movie dataset
 * @param {string} sortMode - Sorting key from SortStatMode
 * @returns {Array<Object>} Sorted movies
 */
function sortMovieStat(db, sortMode) {
  if (db) {
    db = defaultSortRecentDate(db);
    switch (sortMode) {
      case SortStatMode.EVAL_DATETIME_DESC:
        return db;
      case SortStatMode.EVAL_DATETIME_ASC:
        return db.sort((a, b) => {
          let argA = a.userChangeEvalDate ? a.userChangeEvalDate : a.userEvalDate;
          let argB = b.userChangeEvalDate ? b.userChangeEvalDate : b.userEvalDate;
          return new Date(argA) - new Date(argB);
        });

      case SortStatMode.USER_RATING_DESC:
        return db.sort((a, b) => Number(b.userRating) - Number(a.userRating));
      case SortStatMode.USER_RATING_ASC:
        return db.sort((a, b) => Number(a.userRating) - Number(b.userRating));

      case SortStatMode.YEAR_DESC:
        return db.sort((a, b) => normalizeYear(b.movie.year) - normalizeYear(a.movie.year));
      case SortStatMode.YEAR_ASC:
        return db.sort((a, b) => normalizeYear(a.movie.year) - normalizeYear(b.movie.year));

      case SortStatMode.IMDB_RATING_DESC:
        return db.sort((a, b) =>
          normalizeIMDBVotes(b.movie.imdbVotes) - normalizeIMDBVotes(a.movie.imdbVotes))
          .sort((a, b) => Number(b.movie.imdbRating) - Number(a.movie.imdbRating));
      case SortStatMode.IMDB_RATING_ASC:
        return db.sort((a, b) =>
          normalizeIMDBVotes(a.movie.imdbVotes) - normalizeIMDBVotes(b.movie.imdbVotes))
          .sort((a, b) => Number(a.movie.imdbRating) - Number(b.movie.imdbRating));

      case SortStatMode.IMDB_EVALNUM_DESC:
        return db.sort((a, b) => Number(b.movie.imdbRating) - Number(a.movie.imdbRating))
          .sort((a, b) => normalizeIMDBVotes(b.movie.imdbVotes) - normalizeIMDBVotes(a.movie.imdbVotes));
      case SortStatMode.IMDB_EVALNUM_ASC:
        return db.sort((a, b) => Number(a.movie.imdbRating) - Number(b.movie.imdbRating))
          .sort((a, b) => normalizeIMDBVotes(a.movie.imdbVotes) - normalizeIMDBVotes(b.movie.imdbVotes));
      default:
        return db;
    }
  } else {
    console.error("sortMovieStat error: data not valid...")
    return db;
  }
}

/**
 * Filter movie dataset by selected filter mode and value.
 *
 * @param {Array<Object>} db - Movie dataset
 * @param {string} filterMode - Filter type from FilmStatMode
 * @param {string} filterValue - Filter value
 * @returns {Array<Object>} Filtered movie dataset
 */
export function filterMovieTable(db, filterMode, filterValue) {
  if (filterMode && filterValue) {

    if (filterMode === FilmStatMode.USER_RATING) {
      return db.filter(entry => entry.userRating == filterValue);
    } else if (filterMode == FilmStatMode.FAVORITE) {
      return db.filter(entry => entry.isFavorite === true);
    } else if (filterMode === FilmStatMode.GENRE
      || filterMode === FilmStatMode.COUNTRY
      || filterMode === FilmStatMode.LANGUAGE) {
      return db.filter(entry => entry.movie[filterMode].includes(filterValue));
    } else if (filterMode === FilmStatMode.YEAR) {
      return filterValue ? db.filter(entry => entry.movie.year.substring(0, 4) === filterValue) : db;
    } else if (filterMode == FilmStatMode.TYPE) {
      return db.filter(entry => entry.movie.type === filterValue);
    } else if (filterMode === FilmStatMode.DECADE) {
      const decade = filterValue.split('-');
      return db.filter(entry => entry.movie.year >= decade[0] && entry.movie.year <= decade[1]);
    } else if (filterMode === FilmStatMode.DIRECTOR
      || filterMode === FilmStatMode.PRODUCER
      || filterMode === FilmStatMode.WRITER
      || filterMode === FilmStatMode.COMPOSER
      || filterMode === FilmStatMode.ACTOR) {
      return db.filter(entry => entry.movie[filterMode].some(elem => {
        if (elem.person) return elem.person.name.includes(filterValue)
      }));
    } else {
      console.error("Filter params are invalid.")
      return db;
    }
  } else {
    console.log("Filter params are empty.")
    return db;
  }
}