/**
* 05.03.2024
*/

// modules
const statisticsGenerator = require('./statisticsGenerator.js');
const fs = require('fs')
const dataProvider = require('../data/dataProvider.js');
const MovieEntry = require('./movieItem.js').MovieEntry;

// enumerators
const FilmStatMode = statisticsGenerator.FilmStatMode;
const SortStatMode = statisticsGenerator.SortStatMode;

// functions
const composeFullStat = statisticsGenerator.composeFullStat;
const setStatMapEntry = statisticsGenerator.setStatMapEntry;
const calcPercentsAndRatesStat = statisticsGenerator.calcPercentsAndRatesStat;
const sortStat = statisticsGenerator.sortStat;
const getSingleProperty = statisticsGenerator.getSingleProperty;
const extractIdFromLinkIMDB = statisticsGenerator.extractIdFromLinkIMDB;
const filterMovieStat = statisticsGenerator.filterMovieStat;


module.exports.getMovieStat = (db, sortMode, filterMode, filterValue) => {
  return filterMovieStat(sortStat(composeFilmsRate(db), sortMode), filterMode, filterValue);
}
///
module.exports.getMovie = (db, imdbId) => {
  if (db) {
    return db.find(elem => elem.imdbId == imdbId);
  }
}
///
module.exports.removeMovie = (imdbId, renderOk, renderErr) => {
  dataProvider.removeUserMovieEval(imdbId, renderOk, renderErr);
}
///
module.exports.changeUserEval = (item, render) => {
  let currItem = new MovieEntry()
  currItem.copy(item)
  dataProvider.updateUserMovieEval(currItem, render);
}
///
function composeFilmsRate(db) {
  let filmsMap = new Map();
  if (db) {
    db.forEach(elem => {
      setFilmMapEntry(filmsMap, elem);
    });
  }
  return filmsMap;
}
module.exports.composeFilmsRate = composeFilmsRate;

///
function setFilmMapEntry(map, detailsItem) {
  const key = detailsItem.imdbId;

  const entry = {
    imdbLink: detailsItem.imdbLink,
    commTitle: detailsItem.commTitle,
    origTitle: detailsItem.origTitle,
    year: detailsItem.year,
    duration: detailsItem.duration,
    //parental: detailsItem.parental,
    type: detailsItem.type,
   //countriesOrig: detailsItem.countriesOrig,
    //plot: detailsItem.plot,
    imdbRating: detailsItem.imdbRating,
    imdbRatingNum: detailsItem.imdbRatingNum,
    sPoster: detailsItem.sPoster,
    //genres: detailsItem.genres,
    //director: detailsItem.director,
    //cast: detailsItem.cast,
    //budget: detailsItem.budget,
    //grossWW: detailsItem.grossWW,
    pRating: detailsItem.pRating,
    pDateTime: detailsItem.pDateTime,
    favorite: detailsItem.favorite
  }
  map.set(key, entry)
}