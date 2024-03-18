/**
* 04.03.2024
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


function getActorStat(sortMode, thresholdQuantity = 7) {
  return sortStat(composePersonsRate(thresholdQuantity, FilmStatMode.CAST), sortMode);
}
module.exports.getActorStat = getActorStat;

function getDirectorStat(sortMode, thresholdQuantity = 3) {
  return sortStat(composePersonsRate(thresholdQuantity, FilmStatMode.DIRECTOR), sortMode);
}
module.exports.getDirectorStat = getDirectorStat;

//// for short profile
function getPerson(imdbId) {
  const actorsColl = composePersonsRate(1, FilmStatMode.CAST);
  const direcsColl = composePersonsRate(1, FilmStatMode.DIRECTOR);

  if (actorsColl.has(imdbId) || direcsColl.has(imdbId)) {
    let profile = {
      occupation: []
    };

    if (actorsColl.has(imdbId)) {
      personInfo = actorsColl.get(imdbId);

      setProfileOccupSection(profile, imdbId, personInfo, FilmStatMode.CAST);
    }
    if (direcsColl.has(imdbId)) {
      personInfo = direcsColl.get(imdbId);

      setProfileOccupSection(profile, imdbId, personInfo, FilmStatMode.DIRECTOR);
    }
    return profile;
  } else {
    console.error("Person manager: person not found")
    return undefined;
  }
}
module.exports.getPerson = getPerson;
//
function setProfileOccupSection(profile, imdbId, personInfo, personMode) {
  profile.occupation.push(personMode);
  profile.imdbId = imdbId;
  profile.imdbLink = personInfo.imdbLink;
  profile.name = personInfo.name;
  profile.sPhoto = profile.sPhoto ? profile.sPhoto: (personInfo.sPhoto ?
    personInfo.sPhoto: "");

  profile[personMode] = {
    quantity: personInfo.quantity,
    rating: personInfo.rating,
    filmList: getSingleProperty(imdbId, personMode).filmList
  }
}

////
function composePersonsRate(numFilmLimit, personMode) {
  let personsMap = new Map();
  switch (personMode) {
    case FilmStatMode.CAST:
      db.forEach(film =>
        film.cast.forEach(elem => {
          setPersonMapEntry(personsMap, elem, film.pRating);
        }));
      break;
    case FilmStatMode.DIRECTOR:
      db.forEach(film =>
        film.director.forEach(elem => {
          setPersonMapEntry(personsMap, elem, film.pRating);
        }));
      break;
    default:
      console.log("Person manager: mode is not valid");
      break;
  }
  personsMap.forEach(elem => {
    elem.rating = (elem.rating/elem.quantity).toFixed(2);
  });
  console.log('Person manager: compose result total - %s', personsMap.size)
  //
  return sortStat(new Map([...personsMap.entries()]
    .filter(elem => elem[1].quantity >=
      numFilmLimit)), SortStatMode.EVAL_DATETIME_DESC);
}
///
function setPersonMapEntry(map, detailsItem, rating) {

  const key = extractIdFromLinkIMDB(detailsItem.imdbLink);
  let currQuantity = map.get(key) == undefined ? 0: map.get(key).quantity;
  let currRate = map.get(key) == undefined ? 0: map.get(key).rating;

  const entry = {
    name: detailsItem.name,
    quantity: currQuantity += 1,
    rating: currRate += Number(rating),
    imdbLink: detailsItem.imdbLink
  }
  if (detailsItem.sPhoto)
    entry.sPhoto = detailsItem.sPhoto;

  map.set(key, entry);
}

/// temporary
function printPersonsRate(personsMap) {
  let personsList = []

  console.log("actors filtered: "+personsMap.size)
  personsMap.forEach(elem => {
    personsList.push([elem.name,
      elem.rating,
      elem.quantity]);
  });
  const result = JSON.stringify(personsList/*.sort((a, b)=>b[2]-a[2])*/);
  fs.writeFileSync("./listtemp1.txt",
    result.trim().replaceAll("],[",
      "],\n["));
}