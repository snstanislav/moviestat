/**
* 05.03.2024
*/

// modules
const statisticsGenerator = require('./statisticsGenerator.js');
const fs = require('fs')
const dataProvider = require('../data/dataProvider.js');
const db = dataProvider.getGeneralUserMovieList();

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
//


//console.log(getMovie('bkptt450'))
//printFilmsRate(getMovieStat(SortStatMode.IMDB_EVALNUM_DESC))

//let someMap = getMovieStat(SortStatMode.YEAR_DESC)
//printFilmsRate(filterMovieStat(someMap, FilmStatMode.CAST, "nm0000154"))


function getMovieStat(sortMode) {
  return sortStat(composeFilmsRate(), sortMode);
}
module.exports.getMovieStat = getMovieStat;

function getMovie(imdbId) {
  return db.find(elem => elem.imdbId == imdbId);
}
module.exports.getMovie = getMovie;

function composeFilmsRate() {
  let filmsMap = new Map();
  db.forEach(elem => {
    setFilmMapEntry(filmsMap, elem);
  });
  return filmsMap;
}

function setFilmMapEntry(map, detailsItem) {
  const key = detailsItem.imdbId;

  const entry = {
    imdbLink: detailsItem.imdbLink,
    commTitle: detailsItem.commTitle,
    origTitle: detailsItem.origTitle,
    year: detailsItem.year,
    duration: detailsItem.duration,
    parental: detailsItem.parental,
    type: detailsItem.type,
    countriesOrig: detailsItem.countriesOrig,
    plot: detailsItem.plot,
    imdbRating: detailsItem.imdbRating,
    imdbRatingNum: detailsItem.imdbRatingNum,
    sPoster: detailsItem.sPoster,
    genres: detailsItem.genres,
    director: detailsItem.director,
    cast: detailsItem.cast,
    budget: detailsItem.budget,
    grossWW: detailsItem.grossWW,
    pRating: detailsItem.pRating,
    pDateTime: detailsItem.pDateTime,
    favorite: detailsItem.favorite
  }
  map.set(key, entry)
}
///

function printFilmsRate(filmsMap) {
  let filmsList = []

  console.log("films to be printed: "+filmsMap.size)
  filmsMap.forEach(elem => {
    filmsList.push([elem.commTitle,
      elem.year,
      elem.pRating]);
  });
  const result = JSON.stringify(filmsList/*.sort((a, b)=>b[2]-a[2])*/);
  fs.writeFileSync("./listtemp3.txt",
    result.trim().replaceAll("],[",
      "],\n["));
}