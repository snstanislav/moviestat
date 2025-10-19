/**
* created: 04.03.2024
* modified: 10/2025
*/

import { getSingleProperty, sortStat, FilmStatMode, SortStatMode } from "./statisticsGenerator";

export function getDirectorStatistics(db, sortMode, thresholdQuantity = 1) {
  return sortStat(composePersonsRate(db, thresholdQuantity, FilmStatMode.DIRECTOR), sortMode);
}

export function getWriterStatistics(db, sortMode, thresholdQuantity = 1) {
  return sortStat(composePersonsRate(db, thresholdQuantity, FilmStatMode.WRITER), sortMode);
}

export function getProducerStatistics(db, sortMode, thresholdQuantity = 1) {
  return sortStat(composePersonsRate(db, thresholdQuantity, FilmStatMode.PRODUCER), sortMode);
}

export function getComposerStatistics(db, sortMode, thresholdQuantity = 1) {
  return sortStat(composePersonsRate(db, thresholdQuantity, FilmStatMode.COMPOSER), sortMode);
}

export function getActorStatistics(db, sortMode, thresholdQuantity = 5) {
  return sortStat(composePersonsRate(db, thresholdQuantity, FilmStatMode.ACTOR), sortMode);
}

function composePersonsRate(db, numFilmLimit, personMode) {
  let personsMap = new Map();
  if (db) {
    db.sort((a, b) => new Date(a.userEvalDate) > new Date(b.userEvalDate));
    switch (personMode) {

      case FilmStatMode.DIRECTOR:
        db.forEach(item => {
          return item.movie.directors.forEach(elem => {
            setPersonMapEntry(personsMap, elem.person, item.userRating);
          });
        });
        console.log(`Person manager: DIRECTORs total -- ${personsMap.size}`);
        break;

      case FilmStatMode.WRITER:
        db.forEach(item => {
          return item.movie.writers.forEach(elem => {
            setPersonMapEntry(personsMap, elem.person, item.userRating);
          });
        });
        console.log(`Person manager: WRITERs total -- ${personsMap.size}`);
        break;

      case FilmStatMode.PRODUCER:
        db.forEach(item => {
          return item.movie.producers.forEach(elem => {
            setPersonMapEntry(personsMap, elem.person, item.userRating);
          });
        });
        console.log(`Person manager: PRODUCERs total -- ${personsMap.size}`);
        break;

      case FilmStatMode.COMPOSER:
        db.forEach(item => {
          return item.movie.composers.forEach(elem => {
            setPersonMapEntry(personsMap, elem.person, item.userRating);
          });
        });
        console.log(`Person manager: COMPOSERs total -- ${personsMap.size}`);
        break;

      case FilmStatMode.ACTOR:
        db.forEach(item => {
          return item.movie.cast.forEach(elem => {
            setPersonMapEntry(personsMap, elem.person, item.userRating);
          });
        });
        console.log(`Person manager: ACTORs total -- ${personsMap.size}`);
        break;

      default:
        console.log("Person manager: mode is not valid");
        break;
    }
    personsMap.forEach(elem => {
      elem.rating = (elem.rating / elem.quantity).toFixed(2);
    });

    return sortStat(new Map([...personsMap.entries()]
      .filter(elem => elem[1].quantity >=
        numFilmLimit)), SortStatMode.EVAL_DATETIME_DESC);
  } else {
    return new Map();
  }
}

function setPersonMapEntry(map, detailsItem, rating) {
  if (detailsItem && detailsItem.name) {
    const key = detailsItem.name;
    let currQuantity = map.get(key) == undefined ? 0 : map.get(key).quantity;
    let currRate = map.get(key) == undefined ? 0 : map.get(key).rating;

    const entry = {
      //_id: detailsItem._id,
      photo: detailsItem.photo,
      quantity: currQuantity += 1,
      rating: currRate += Number(rating),
      imdbID: detailsItem.imdbID
    }
    if (detailsItem.photo)
      entry.photo = detailsItem.photo;

    map.set(key, entry);
  }
}

// for short profile
export function getPerson(db, imdbId) {
  if (db) {
    const actorsColl = composePersonsRate(db, 1, FilmStatMode.ACTOR);
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
          FilmStatMode.ACTOR,
          getSingleProperty(db, imdbId, FilmStatMode.ACTOR).filmList);
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

function setProfileOccupSection(profile, imdbId, personInfo, personMode, filmList) {
  profile.occupation.push(personMode);
  profile.imdbId = imdbId;
  profile.imdbLink = personInfo.imdbLink;
  profile.name = personInfo.name;
  profile.photo = profile.photo ? profile.photo : (personInfo.photo ?
    personInfo.photo : "");

  profile[personMode] = {
    quantity: personInfo.quantity,
    rating: personInfo.rating,
    filmList: filmList
  }
}