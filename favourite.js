const fs = require('fs');

const pathSrc = "./data/src/db.json";
const db = JSON.parse(fs.readFileSync(pathSrc, "utf-8"));

const FilmProperties = {
  GENRES: "genres",
  COUNTRIES: "countriesOrig",
  YEAR: "year",
  CAST: "cast",
  DIRECTOR: "director",
  TYPE: "type"
};

//== time
console.time()
//==

// 5 - 428, 7 - 204, 10 - 77 / 14655
//console.log(composeActorsRate(7))
console.log(getSinglePropertyMovies(
  "Mel Gibson", FilmProperties.DIRECTOR))
console.log(getSinglePropertyMovies("Mel Gibson", FilmProperties.CAST))
//console.log(composeFullStat(FilmProperties.DIRECTOR))
//printYearStat()
//drawYearStat()

//== time
console.timeEnd()

function setMapEntry(item, propertyMap, totalQuantity, rating) {
  if (item) {
    let currQuantity = propertyMap.get(item) == undefined ? 0:
    propertyMap.get(item).quantity;
    let currRate = propertyMap.get(item) == undefined ? 0:
    propertyMap.get(item).rate;

    propertyMap.set(item, {
      quantity: currQuantity += 1,
      percent: 0,
      rate: currRate += Number(rating)
    });
    totalQuantity += 1;
  }
  return totalQuantity;
}

/// Genres, Countries
function composeFullStat(filmProperty) {
  let propertyMap = new Map();
  let totalQuantity = 0;
  if (filmProperty == FilmProperties.YEAR || filmProperty == FilmProperties.GENRES || filmProperty == FilmProperties.COUNTRIES) {

    db.forEach(item => {
      switch (filmProperty) {
        case FilmProperties.YEAR:
          totalQuantity = setMapEntry(item.year.substring(0, 4), propertyMap, totalQuantity, item.pRating);
          break;
        case FilmProperties.GENRES:
          item[filmProperty].forEach(elem => {

            totalQuantity = setMapEntry(elem, propertyMap, totalQuantity, item.pRating);
          });
          break;
        case FilmProperties.COUNTRIES:
          item[filmProperty].forEach(elem => {

            totalQuantity = setMapEntry(elem, propertyMap, totalQuantity, item.pRating);
          });
          break;
        default:
          console.error(`Mode error`);
          break;
      }
    });
  } else {
    console.error(`Mode is not valid`)
  }
  propertyArr = [...propertyMap.entries()];

  let resultMap = new Map()
  propertyArr.forEach(item => {
    resultMap.set(item[0],
      {
        quantity: item[1].quantity,
        percent: (item[1].quantity/totalQuantity*100).toFixed(2),
        rate: (item[1].rate/item[1]. quantity).toFixed(2)
      });
  })
  propertyMap = new Map([...resultMap.entries()].sort((a,
    b)=>b[1].quantity-a[1].quantity));
  return propertyMap;
}
////
function getSinglePropertyMovies(value, filmProperty) {
  let count = 0;
  let amount = 0;
  let filmList = [];
  db.forEach((film)=> {

    if (filmProperty == FilmProperties.YEAR) {
      if (film.year == value) {
        count += 1;
        amount += Number(film.pRating);
        filmList.push([film.commTitle, film.year])
      }
    } else {
      film[filmProperty].forEach(elem => {
        const property = (filmProperty == FilmProperties.CAST || filmProperty ==
          FilmProperties.DIRECTOR) ? elem.name: elem;
        if (property == value) {
          count += 1;
          amount += Number(film.pRating);
          filmList.push([film.commTitle, film.year, film.pRating])
        }
      });
    }
  });
  return [value, (amount/count).toFixed(3), count, filmList];
}
////
function composeActorsRate(numFilmLimit) {
  let actorsList = []
  let actorsMap = new Map();

  db.forEach(film =>
    film.cast.forEach(elem =>
      {
        let currVal = actorsMap.get(elem.name) == undefined ? 0: actorsMap.get(elem.name);
        actorsMap.set(elem.name, currVal += 1)
      }));
  console.log("actors total: "+actorsMap.size)
  actorsMap = [...actorsMap.entries()]
  .filter(elem => elem[1] >= numFilmLimit);

  console.log("actors filtered: "+actorsMap.length)
  actorsMap.forEach(elem => {
    actorsList.push([elem[0], elem[1]]);
  });
  const result = JSON.stringify(actorsList.sort((a, b)=>b[2]-a[2]).sort((a,
  b)=>b[1]-a[1]));
  fs.writeFileSync("./listtemp.txt",
    result.trim().replaceAll("],[",
      "],\n["));
      
}
////
function composeActorsRateFull() {
  const actorList = []
  db.forEach(film => {
    film.cast.forEach((elem)=> {
      let index = 0;
      if (actorList.some((item, j, self)=> {
        if (item[0] == elem.name) {
          index = j;
          return true;
        }
      })) {
        actorList[index][1] += Number(film.pRating);
        actorList[index][2] += 1;
      } else {
        actorList.push([elem.name, Number(film.pRating), 1]);
      }
    })
  })

  actorList.forEach((elem,
    i,
    self)=>self[i][1] = (self[i][1]/self[i][2]).toFixed(3));

  const result =
  JSON.stringify(actorList.filter(elem => elem[2] >= 7).sort((a,
  b)=>b[2]-a[2])/*.sort((a,
    b)=>b[1]-a[1])*/).trim().replaceAll("],[",
    "],\n[");
  fs.writeFileSync("./listtemp2.txt",
    result)
}
////
function composeYearStat() {
  let yearInitArr = new Array(
    new Date().getFullYear()+1 - 1895);
  for (let i = 0; i < yearInitArr.length; i += 1) {
    yearInitArr[i] = [String(i+1895),
      0];
  }
  let yearMap = new Map(yearInitArr);

  db.forEach((elem, i, self)=> {
    currYear = elem.year.substring(0, 4)
    yearMap.set(currYear, yearMap.get(currYear)+1);

  });
  return yearMap = new Map([...yearMap.entries()].sort((a, b)=>b[0]-a[0]));
}
////
function printYearStat() {
  yearMap = composeYearStat();
  for (item of yearMap) {
    console.log(item[0]+" "+item[1])
  }
}
////
function drawYearStat() {
  yearMap = composeYearStat();
  let mark = '|';
  for (item of yearMap) {
    let bar = '';
    for (let i = 1; i <= item[1]; i += 1)
      bar += mark;
    console.log(item[0]+" "+bar)
  }
}
////
function composeDecadeStat() {
  yearMap = composeYearStat();
  yearArr = [...yearMap.entries()];

  const decadeMap = new Map();
  let currGroupSum = 0;
  let firstYearInGroup = yearArr[0][0];

  if (yearArr[0][0] > yearArr[yearArr.length-1][0]) {
    for (let i = 0; i < yearArr.length; i += 1) {
      if (yearArr[i][0]%10 == 0) {
        currGroupSum += yearArr[i][1];
        if (yearArr[i][0] == firstYearInGroup) {
          decadeMap.set(`${yearArr[i][0]}`, currGroupSum);
        } else {
          decadeMap.set(`${yearArr[i][0]}-${firstYearInGroup}`, currGroupSum);
        }
        currGroupSum = 0;
        firstYearInGroup = yearArr[i+1][0];
      } else if (i == yearArr.length-1) {
        currGroupSum += yearArr[i][1];
        if (yearArr[i][0] == firstYearInGroup) {
          decadeMap.set(`${yearArr[i][0]}`, currGroupSum);
        } else {
          decadeMap.set(`${yearArr[i][0]}-${firstYearInGroup}`, currGroupSum);
        }
      } else {
        currGroupSum += yearArr[i][1];
      }
    }
  } else if (yearArr[0][0] < yearArr[yearArr.length-1][0]) {
    for (let i = 0; i < yearArr.length; i += 1) {
      if (yearArr[i][0]%10 == 0) {
        if (yearArr[i-1][0] == firstYearInGroup) {
          decadeMap.set(`${yearArr[i-1][0]}`, currGroupSum);
        } else {
          decadeMap.set(`${firstYearInGroup}-${yearArr[i-1][0]}`, currGroupSum);
        }
        currGroupSum = yearArr[i][1];
        firstYearInGroup = yearArr[i][0];
        if (i == yearArr.length-1) {
          decadeMap.set(`${yearArr[i][0]}`, currGroupSum);
        }
      } else if (i == yearArr.length-1) {
        currGroupSum += yearArr[i][1];
        if (yearArr[i][0] == firstYearInGroup) {
          decadeMap.set(`${yearArr[i][0]}`, currGroupSum);
        } else {
          decadeMap.set(`${firstYearInGroup}-${yearArr[i][0]}`, currGroupSum);
        }
      } else {
        currGroupSum += yearArr[i][1];
      }
    }
  }
  console.log(decadeMap)
}
