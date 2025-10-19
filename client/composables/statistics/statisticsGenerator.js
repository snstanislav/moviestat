/**
* created 04.03.2024
* modified 10/2025
*/

export const FilmStatMode = {
  TYPE: "type",
  YEAR: "year",
  DECADE: "decade",
  COUNTRY: "countries",
  LANGUAGE: "languages",
  GENRE: "genres",
  DIRECTOR: "directors",
  WRITER: "writers",
  PRODUCER: "producers",
  COMPOSER: "composers",
  ACTOR: "actor",
  USER_RATING: "userRating",
  FAVORITE: "isFavorite"
};

export const SortStatMode = {
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

export function composeFullStat(db, filmProperty, propertyMap = new Map()) {
  if (db) {
    let totalQuantity = 0;
    if (filmProperty === FilmStatMode.YEAR
      || filmProperty === FilmStatMode.DECADE
      || filmProperty === FilmStatMode.GENRE
      || filmProperty === FilmStatMode.LANGUAGE
      || filmProperty === FilmStatMode.COUNTRY) {

      switch (filmProperty) {
        case FilmStatMode.YEAR:
          db.forEach(item => {
            totalQuantity = setStatMapEntry(propertyMap, item.movie.year.slice(0, 4), totalQuantity, item.userRating, 1);
          });
          /* do not change initial sort order */
          propertyMap = new Map([...propertyMap.entries()]
            .sort((a, b) => b[0] - a[0]));
          break;
        case FilmStatMode.GENRE:
          db.forEach(item => {
            item.movie[filmProperty].forEach(elem => {
              totalQuantity = setStatMapEntry(propertyMap, elem, totalQuantity, item.userRating, 1);
            });
          });
          break;
        case FilmStatMode.LANGUAGE:
          db.forEach(item => {
            item.movie[filmProperty].forEach(elem => {
              totalQuantity = setStatMapEntry(propertyMap, elem, totalQuantity, item.userRating, 1);
            });
          });
          break;
        case FilmStatMode.COUNTRY:
          db.forEach(item => {
            item.movie[filmProperty].forEach(elem => {
              totalQuantity = setStatMapEntry(propertyMap, elem, totalQuantity, item.userRating, 1);
            });
          });
          break;
        default:
          console.error(`StatisticsGenerator: compose mode error`);
          break;
      }
    } else {
      console.error(`StatisticsGenerator: compose mode is not valid`)
    }

    return calcPercentsAndRatesStat(propertyMap, totalQuantity);
  } else {
    console.log("composeFullStat: 'db' is invalid");
  }
}

export function sortStat(map, sortMode) {
  if (map) {
    switch (sortMode) {
      case SortStatMode.KEY_ASC:
        return new Map([...map.entries()].sort());
      case SortStatMode.KEY_DESC:
        return new Map([...map.entries()].sort().reverse());
      case SortStatMode.QUANTITY_ASC:
        return new Map([...map.entries()]
          .sort((a, b) => a[1].rating - b[1].rating)
          .sort((a, b) => a[1].quantity - b[1].quantity));
      case SortStatMode.QUANTITY_DESC:
        return new Map([...map.entries()]
          .sort((a, b) => b[1].rating - a[1].rating)
          .sort((a, b) => b[1].quantity - a[1].quantity));
      case SortStatMode.RATING_ASC:
        return new Map([...map.entries()]
          .sort((a, b) => a[1].quantity - b[1].quantity)
          .sort((a, b) => a[1].rating - b[1].rating));
      case SortStatMode.RATING_DESC:
        return new Map([...map.entries()]
          .sort((a, b) => b[1].quantity - a[1].quantity)
          .sort((a, b) => b[1].rating - a[1].rating));

      default:
        return map;
    }
  } else {
    console.error("sortStat: src map was empty...")
    return new Map();
  }
}

export function calcPercentsAndRatesStat(propertyMap, totalQuantity) {
  const propertyArr = [...propertyMap.entries()];
  const resultMap = new Map()
  propertyArr.forEach(item => {
    resultMap.set(item[0],
      {
        quantity: item[1].quantity,
        percent: (item[1].quantity / totalQuantity * 100).toFixed(2),
        rating: item[1].quantity != 0 ?
          (item[1].rating / item[1].quantity).toFixed(2) : 0
      });
  });
  return resultMap;
}

export function setStatMapEntry(propertyMap, key, totalQuantity, rating, incrValue) {
  if (key) {
    let currQuantity = propertyMap.get(key) == undefined ? 0 :
      propertyMap.get(key).quantity;
    let currRate = propertyMap.get(key) == undefined ? 0 :
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

export function getSingleProperty(db, value, filmProperty) {
  if (filmProperty && db) {
    let count = 0;
    let amount = 0;
    let filmList = [];
    db.forEach((film) => {

      if (filmProperty == FilmStatMode.YEAR) {
        if (film.year == value) {
          count += 1;
          amount += Number(film.userRating);
          filmList.push([film.commTitle, film.year])
        }
      } else if (filmProperty == FilmStatMode.TYPE) {
        if (film.type == value) {
          count += 1;
          amount += Number(film.userRating);
          filmList.push([film.commTitle, film.year])
        }
      } else {
        film[filmProperty].forEach(elem => {
          const property = (filmProperty == FilmStatMode.ACTOR || filmProperty ==
            FilmStatMode.DIRECTOR) ? extractIdFromLinkIMDB(elem.imdbLink) : elem;
          if (property == value) {
            count += 1;
            amount += Number(film.userRating);
            //filmList.push([film.commTitle, film.year, film.userRating]);
            //filmList.push(film.commTitle);
            filmList.push(film)
          }
        });
      }
    });
    return {
      searchItem: value,
      quantity: count,
      rating: (amount / count).toFixed(3),
      filmList: filmList
    }
  } else {
    console.error("StatisticsGenerator: invalid single property...")
  }
}

///
export function extractIdFromLinkIMDB(link) {
  if (link.includes("/name/") || link.includes("/title/")) {
    let category = link.includes("/name/") ? "/name/" : (link.includes("/title/") ?
      "/title/" : "")
    let indS = link.indexOf(category) + category.length;
    let indE = link.indexOf("/", indS);
    return link.substring(indS, indE);
  } else {
    return undefined;
  }
}
//
function formatNum(numStr) {
  const mark = numStr.includes('K') ? 'K' : (numStr.includes('M') ? 'M' : '');
  const multiplier = numStr.includes('K') ? 1000 : (numStr.includes('M') ?
    1000000 : 1);

  const result = Number(numStr.substring(0, numStr.indexOf(mark) > 0 ?
    numStr.indexOf(mark) : numStr.length)) * multiplier;
  return result ? result : 0;
}