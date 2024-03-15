/**
* 04.03.2024
*/

const dataProvider = require('../data/dataProvider.js');

const db = dataProvider.getGeneralUserMovieList();

const FilmStatMode = {
  CAST: "cast",
  DIRECTOR: "director",
  GENRE: "genres",
  COUNTRY: "countriesOrig",
  YEAR: "year",
  DECADE: "decade",
  USER_RATING: "pRating",
  TYPE: "type",
  FAVORITE: "favorite"
};
module.exports.FilmStatMode = FilmStatMode;

const SortStatMode = {
  KEY_ASC: "key-asc",
  KEY_DESC: "key-desc",
  QUANTITY_ASC: "quantity-asc",
  QUANTITY_DESC: "quantity-desc",
  RATING_ASC: "rating-asc",
  RATING_DESC: "rating-desc",
  // for persons
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc",
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
module.exports.SortStatMode = SortStatMode;

module.exports.composeFullStat = (filmProperty, propertyMap = new Map()) => {

  let totalQuantity = 0;
  if (filmProperty == FilmStatMode.YEAR || filmProperty == FilmStatMode.GENRE || filmProperty == FilmStatMode.COUNTRY) {

    switch (filmProperty) {
      case FilmStatMode.YEAR:
        db.forEach(item => {
          totalQuantity = setStatMapEntry(propertyMap, item.year.substring(0, 4), totalQuantity, item.pRating, 1);
        });
        /* do not change initial sort order */
        propertyMap = new Map([...propertyMap.entries()].sort((a, b)=>b[0]-a[0]));
        break;
      case FilmStatMode.GENRE:
        db.forEach(item => {
          item[filmProperty].forEach(elem => {
            totalQuantity = setStatMapEntry(propertyMap, elem, totalQuantity, item.pRating, 1);
          });
        });
        break;
      case FilmStatMode.COUNTRY:
        db.forEach(item => {
          item[filmProperty].forEach(elem => {
            totalQuantity = setStatMapEntry(propertyMap, elem, totalQuantity, item.pRating, 1);
          });
        });
        break;
      default:
        console.error(`Mode error`);
        break;
    }
  } else {
    console.error(`Mode is not valid`)
  }

  return calcPercentsAndRatesStat(propertyMap, totalQuantity);
}

function sortStat(map, sortMode) {
  switch (sortMode) {
    case SortStatMode.KEY_ASC:
      return new Map([...map.entries()].sort());
      break;
    case SortStatMode.KEY_DESC:
      return new Map([...map.entries()].sort().reverse());
      break;
    case SortStatMode.QUANTITY_ASC:
      return new Map([...map.entries()]
      .sort((a, b)=>a[1].rating-b[1].rating)
      .sort((a, b)=>a[1].quantity-b[1].quantity));
      break;
    case SortStatMode.QUANTITY_DESC:
      return new Map([...map.entries()]
      .sort((a, b)=>b[1].rating-a[1].rating)
      .sort((a, b)=>b[1].quantity-a[1].quantity));
      break;
    case SortStatMode.RATING_ASC:
      return new Map([...map.entries()]
      .sort((a, b)=>a[1].quantity-b[1].quantity)
      .sort((a, b)=>a[1].rating-b[1].rating));
      break;
    case SortStatMode.RATING_DESC:
      return new Map([...map.entries()]
      .sort((a, b)=>b[1].quantity-a[1].quantity)
      .sort((a, b)=>b[1].rating-a[1].rating));
      break;
    // for persons
    case SortStatMode.NAME_ASC:
      return new Map([...map.entries()]
        .sort((a, b)=> a[1].name.localeCompare(b[1].name)));
      break;
    case SortStatMode.NAME_DESC:
      return new Map([...map.entries()].sort((a, b)=> b[1].name.localeCompare(a[1].name)));
      break;
    // for films
    case SortStatMode.YEAR_ASC:
      return new Map([...map.entries()]
        .sort((a, b)=>formatDT(a[1].pDateTime)
          -formatDT(b[1].pDateTime))
        .sort((a, b)=>normalizeYear(a[1].year)-normalizeYear(b[1].year)));
      break;
    case SortStatMode.YEAR_DESC:
      return new Map([...map.entries()]
        .sort((a, b)=>formatDT(b[1].pDateTime)
          -formatDT(a[1].pDateTime))
        .sort((a, b)=>normalizeYear(b[1].year)-normalizeYear(a[1].year)));
      break;
    case SortStatMode.USER_RATING_ASC:
      return new Map([...map.entries()]
        .sort((a, b)=>formatDT(b[1].pDateTime)
          -formatDT(a[1].pDateTime))
        .sort((a, b)=>a[1].pRating-b[1].pRating));
      break;
    case SortStatMode.USER_RATING_DESC:
      return new Map([...map.entries()]
        .sort((a, b)=>formatDT(b[1].pDateTime)
          -formatDT(a[1].pDateTime))
        .sort((a, b)=>b[1].pRating-a[1].pRating));
      break;
    case SortStatMode.IMDB_RATING_ASC:
      return new Map([...map.entries()]
        .sort((a, b)=>formatNum(a[1].imdbRatingNum)-formatNum(b[1].imdbRatingNum))
        .sort((a, b)=>a[1].imdbRating-b[1].imdbRating));
      break;
    case SortStatMode.IMDB_RATING_DESC:
      return new Map([...map.entries()]
        .sort((a, b)=>formatNum(b[1].imdbRatingNum)-formatNum(a[1].imdbRatingNum))
        .sort((a, b)=>b[1].imdbRating-a[1].imdbRating));
      break;
    case SortStatMode.IMDB_EVALNUM_ASC:
      return new Map([...map.entries()]
        .sort((a, b)=>a[1].imdbRating-b[1].imdbRating)
        .sort((a, b)=>formatNum(a[1].imdbRatingNum)-formatNum(b[1].imdbRatingNum)));
      break;
    case SortStatMode.IMDB_EVALNUM_DESC:
      return new Map([...map.entries()]
        .sort((a, b)=>b[1].imdbRating-a[1].imdbRating)
        .sort((a, b)=>formatNum(b[1].imdbRatingNum)-formatNum(a[1].imdbRatingNum)));
      break;
    case SortStatMode.EVAL_DATETIME_ASC:
      return new Map([...map.entries()]
        .sort((a, b)=>formatDT(a[1].pDateTime)-formatDT(b[1].pDateTime)));
      break;
    case SortStatMode.EVAL_DATETIME_DESC:
      return new Map([...map.entries()]
        .sort((a, b)=>formatDT(b[1].pDateTime)-formatDT(a[1].pDateTime)));
      break;
    default:
      return map;
      break;
  }
}
module.exports.sortStat = sortStat;
////
function filterMovieStat(map, filterMode, filterValue) {
  const mapEntries = [...map.entries()];

  if (filterMode == FilmStatMode.CAST || filterMode == FilmStatMode.DIRECTOR) {
    return new Map(mapEntries.filter(entry => entry[1][filterMode].some(elem => elem.imdbLink.includes(filterValue))))
  } else if (filterMode == FilmStatMode.GENRE || filterMode == FilmStatMode.COUNTRY) {
    return new Map(mapEntries.filter(entry => entry[1][filterMode].includes(filterValue)))
  } else if (filterMode == FilmStatMode.USER_RATING || filterMode == FilmStatMode.TYPE || filterMode == FilmStatMode.YEAR) {
    return new Map(mapEntries.filter(entry => entry[1][filterMode] == filterValue))
  } else if (filterMode == FilmStatMode.DECADE) {
    const decade = filterValue.split('-')
    return new Map(mapEntries.filter(entry => entry[1].year >= decade[0] && entry[1].year <= decade[1]))
  } else if (filterMode == FilmStatMode.FAVORITE) {
    return new Map(mapEntries.filter(entry => entry[1].favorite == true))
  } else {
    console.error("StatisticsGenerator: filter result is empty...")
    return map;
  }
}
module.exports.filterMovieStat = filterMovieStat;
////
function calcPercentsAndRatesStat(propertyMap, totalQuantity) {
  const propertyArr = [...propertyMap.entries()];
  const resultMap = new Map()
  propertyArr.forEach(item => {
    resultMap.set(item[0],
      {
        quantity: item[1].quantity,
        percent: (item[1].quantity/totalQuantity*100).toFixed(2),
        rating: item[1].quantity != 0 ?
        (item[1].rating/item[1].quantity).toFixed(2): 0
      });
  });
  return resultMap;
}
module.exports.calcPercentsAndRatesStat = calcPercentsAndRatesStat;
///
function setStatMapEntry(propertyMap, key, totalQuantity, rating, incrValue) {
  if (key) {
    let currQuantity = propertyMap.get(key) == undefined ? 0:
    propertyMap.get(key).quantity;
    let currRate = propertyMap.get(key) == undefined ? 0:
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
module.exports.setStatMapEntry = setStatMapEntry;
///
module.exports.getSingleProperty = (value, filmProperty) => {
  if (filmProperty) {
    let count = 0;
    let amount = 0;
    let filmList = [];
    db.forEach((film)=> {

      if (filmProperty == FilmStatMode.YEAR) {
        if (film.year == value) {
          count += 1;
          amount += Number(film.pRating);
          filmList.push([film.commTitle, film.year])
        }
      } else if (filmProperty == FilmStatMode.TYPE) {
        if (film.type == value) {
          count += 1;
          amount += Number(film.pRating);
          filmList.push([film.commTitle, film.year])
        }
      } else {
        film[filmProperty].forEach(elem => {
          const property = (filmProperty == FilmStatMode.CAST || filmProperty ==
            FilmStatMode.DIRECTOR) ? extractIdFromLinkIMDB(elem.imdbLink): elem;
          if (property == value) {
            count += 1;
            amount += Number(film.pRating);
            //filmList.push([film.commTitle, film.year, film.pRating]);
            //filmList.push(film.commTitle);
            filmList.push(film)
          }
        });
      }
    });
    return {
      searchItem: value,
      quantity: count,
      rating: (amount/count).toFixed(3),
      filmList: filmList
    }
  } else {
    console.error("StatisticsGenerator: invalid single property...")
  }
}
///
function normalizeYear(yearStr) {
  const result = Number(yearStr.substring(0, 4));
  return result ? result: 0;
}
//
function formatDT(dtStr) {
  if (dtStr && dtStr.match(/\d{2}\.\d{2}\.\d{4}, \d{2}:\d{2}/gi)) {
    let dateTime = dtStr.split(', ');
    let date = dateTime[0].split('.');
    let time = dateTime[1].split(':');
    let dd = date[0];
    let MM = date[1];
    let yyyy = date[2];
    let hh = time[0];
    let mm = time[1];
    return new Date(`${yyyy}-${MM}-${dd}T${hh}:${mm}`);
  } else {
    return dtStr;
  }
}
module.exports.formatDT = formatDT;
//
function formatNum(numStr) {
  const mark = numStr.includes('K') ? 'K': (numStr.includes('M') ? 'M': '');
  const multiplier = numStr.includes('K') ? 1000: (numStr.includes('M') ?
    1000000: 1);

  const result = Number(numStr.substring(0, numStr.indexOf(mark) > 0 ?
    numStr.indexOf(mark): numStr.length))*multiplier;
  return result ? result: 0;
}
///
function extractIdFromLinkIMDB (link) {
  if (link.includes("/name/") || link.includes("/title/")) {
    let category = link.includes("/name/") ? "/name/": (link.includes("/title/") ?
      "/title/": "")
    let indS = link.indexOf(category) + category.length;
    let indE = link.indexOf("/", indS);
    return link.substring(indS, indE);
  } else {
    return undefined;
  }
}
module.exports.extractIdFromLinkIMDB = extractIdFromLinkIMDB;