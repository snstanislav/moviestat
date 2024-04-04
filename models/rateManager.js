/**
 * 07.03.2024
 */
 
const fs = require('fs')
const path = require('path');

// modules
const statisticsGenerator = require('./statisticsGenerator.js');
const imdbParser = require('./imdbParser.js')
const MovieEntry = require('./movieItem.js').MovieEntry;
const dataProvider = require('../data/dataProvider.js');

// functions
const extractIdFromLinkIMDB = statisticsGenerator.extractIdFromLinkIMDB;


function performImdbSearch(query, render) {
  const queryUrl = `https://imdb.com/find/?q=${query}`;
  fetch(queryUrl)
  .then(response => {
    if (response.ok) {
      console.log("1st fetch success!"); //
      return response.text();
    }
  })
  .then(data => {
    let searchResultList = [];
    imdbParser.parseSearchResult(searchResultList, String(data));
    render(searchResultList);
  });
}
module.exports.performImdbSearch = performImdbSearch;
///
function rateMovie(filmLink, personalRating, renderOk, renderErr) {
  fetch(filmLink).then(response => {
    if (response.ok) {
      console.log("2nd fetch success"); //
      return response.text();
    }
  }).then(data => {
    const resObj = imdbParser.parseFilm(String(data),
      extractIdFromLinkIMDB(filmLink),
      filmLink, personalRating, new Date().toLocaleString("uk-UA")); // !!

    dataProvider.setUserMovieEval(resObj, renderOk, renderErr);
  });
}
module.exports.rateMovie = rateMovie;