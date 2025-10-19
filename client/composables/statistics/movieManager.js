/**
* created 05.03.2024
* modified 10/2025
*/

import { FilmStatMode, SortStatMode } from "./statisticsGenerator";
import { defaultSortRecentDate, normalizeYear, normalizeIMDBVotes } from "../utils";

export function getMovieStat(db, sortMode, filterMode, filterValue) {
  //return filterMovieStat(sortMovieStat(db, sortMode), filterMode, filterValue);
  return sortMovieStat(db, sortMode);

}

// for movie table only
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
    return new Map();
  }
}

export function filterMovieStat(db, filterMode, filterValue) {

  if (filterMode == FilmStatMode.ACTOR || filterMode == FilmStatMode.DIRECTOR) {
    return new Map(mapEntries.filter(entry => entry[filterMode].some(elem => elem.imdbLink.includes(filterValue))));
  } else if (filterMode == FilmStatMode.GENRE || filterMode == FilmStatMode.COUNTRY) {
    return new Map(mapEntries.filter(entry => entry[filterMode].includes(filterValue)));
  } else if (filterMode == FilmStatMode.USER_RATING || filterMode == FilmStatMode.TYPE || filterMode == FilmStatMode.YEAR) {
    return new Map(mapEntries.filter(entry => entry[filterMode] == filterValue))
  } else if (filterMode == FilmStatMode.DECADE) {
    const decade = filterValue.split('-')
    return new Map(mapEntries.filter(entry => entry.year >= decade && entry.year <= decade))
  } else if (filterMode == FilmStatMode.FAVORITE) {
    return new Map(mapEntries.filter(entry => entry.favorite == true))
  } else {
    console.error("StatisticsGenerator: filter result is empty...")
    return map;
  }
}
