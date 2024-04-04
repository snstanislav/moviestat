/**
* 04.03.2024
*/

// modules
const sg = require('./statisticsGenerator.js');
const fs = require('fs')

// enumerators
const FilmStatMode = sg.FilmStatMode;
const SortStatMode = sg.SortStatMode;

// functions
const sortStat = sg.sortStat;
const getSingleProperty = sg.getSingleProperty;
const extractIdFromLinkIMDB = sg.extractIdFromLinkIMDB;


function getActorStat(db, sortMode, thresholdQuantity = 7) {
  return sortStat(composePersonsRate(db, thresholdQuantity, FilmStatMode.CAST), sortMode);
}
module.exports.getActorStat = getActorStat;

function getDirectorStat(db, sortMode, thresholdQuantity = 3) {
  return sortStat(composePersonsRate(db, thresholdQuantity, FilmStatMode.DIRECTOR), sortMode);
}
module.exports.getDirectorStat = getDirectorStat;

//// for short profile
function getPerson(db, imdbId) {
  if (db) {
    const actorsColl = composePersonsRate(db, 1, FilmStatMode.CAST);
    const direcsColl = composePersonsRate(db, 1, FilmStatMode.DIRECTOR);

    if (actorsColl.has(imdbId) || direcsColl.has(imdbId)) {
      let profile = {
        occupation: []
      };
      if (actorsColl.has(imdbId)) {
        personInfo = actorsColl.get(imdbId);

        setProfileOccupSection(
          profile, 
          imdbId, 
          personInfo, 
          FilmStatMode.CAST, 
          getSingleProperty(db, imdbId, FilmStatMode.CAST).filmList);
      }
      if (direcsColl.has(imdbId)) {
        personInfo = direcsColl.get(imdbId);

        setProfileOccupSection(
          profile, 
          imdbId, 
          personInfo, 
          FilmStatMode.DIRECTOR, 
          getSingleProperty(db, imdbId, FilmStatMode.DIRECTOR).filmList);
      }
      return profile;
    } else {
      console.error("Person manager: person not found")
      return undefined;
    }
  }
}
module.exports.getPerson = getPerson;
//
function setProfileOccupSection(profile, imdbId, personInfo, personMode, filmList) {
  profile.occupation.push(personMode);
  profile.imdbId = imdbId;
  profile.imdbLink = personInfo.imdbLink;
  profile.name = personInfo.name;
  profile.sPhoto = profile.sPhoto ? profile.sPhoto: (personInfo.sPhoto ?
    personInfo.sPhoto: "");

  profile[personMode] = {
    quantity: personInfo.quantity,
    rating: personInfo.rating,
    filmList: filmList
  }
}

////
function composePersonsRate(db, numFilmLimit, personMode) {
  let personsMap = new Map();
  if (db) {
    db.sort((a, b)=>sg.formatDT(a.pDateTime)-sg.formatDT(b.pDateTime));
    switch (personMode) {
      case FilmStatMode.CAST:
        db.forEach(film =>
          film.cast.forEach(elem => {
            setPersonMapEntry(personsMap, elem, film.pRating);
          }));
        console.log('Person manager: actors total - %s', personsMap.size)
        break;
      case FilmStatMode.DIRECTOR:
        db.forEach(film =>
          film.director.forEach(elem => {
            setPersonMapEntry(personsMap, elem, film.pRating);
          }));
        console.log('Person manager: directors total - %s', personsMap.size)
        break;
      default:
        console.log("Person manager: mode is not valid");
        break;
    }
    personsMap.forEach(elem => {
      elem.rating = (elem.rating/elem.quantity).toFixed(2);
    });
    
    return sortStat(new Map([...personsMap.entries()]
      .filter(elem => elem[1].quantity >=
        numFilmLimit)), SortStatMode.EVAL_DATETIME_DESC);
  } else {
    return new Map();
  }
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