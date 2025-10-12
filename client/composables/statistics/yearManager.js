/**
* created 03.03.2024
* modified 10/2025
*/

import { composeFullStat, sortStat, setStatMapEntry, calcPercentsAndRatesStat, FilmStatMode, SortStatMode } from './statisticsGenerator';

export function getYearStat(db, sortMode) {
  let resultMap = sortStat(composeFullStat(db, FilmStatMode.YEAR, initYearMap()), sortMode);
  resultMap = new Map([...resultMap].filter(elem => elem[1].quantity > 0));
  return resultMap;
}

export function composeDecadeStat(db, sortMode) {
  let yearFullStat = composeFullStat(db, FilmStatMode.YEAR,
    initYearMap());
  if (yearFullStat) {
    const yearArr = [...yearFullStat.entries()];
    let decadeMap = new Map();
    let currGroupSum = 0;
    let currRateSum = 0;
    let totalQuantity = 0;
    let firstYearInGroup = yearArr[0][0];

    if (yearArr[0][0] > yearArr[yearArr.length - 1][0]) {
      /* from future to past */
      for (let i = 0; i < yearArr.length; i += 1) {
        if (yearArr[i][0] % 10 == 0) {
          /* decade beginning detected */
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
          if (yearArr[i][0] == firstYearInGroup) {
            /* decade is currently
        represented by only its first year */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}`, totalQuantity, currRateSum, currGroupSum);
          } else {
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}-${firstYearInGroup}`, totalQuantity, currRateSum, currGroupSum)
          }
          //== reset ==
          currGroupSum = 0;
          currRateSum = 0;
          firstYearInGroup = yearArr[i + 1][0];
        } else if (i == yearArr.length - 1) {
          /* the very last year */
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
          if (yearArr[i][0] == firstYearInGroup) {
            /* the very last year
        represents the first one in its current group */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}`, totalQuantity, currRateSum, currGroupSum)
          } else {
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}-${firstYearInGroup}`, totalQuantity, currRateSum, currGroupSum)
          }
        } else {
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
        }
      }
    } else if (yearArr[0][0] < yearArr[yearArr.length - 1][0]) {
      /* from past to future */
      for (let i = 0; i < yearArr.length; i += 1) {
        if (yearArr[i][0] % 10 == 0) {
          /* decade beginning detected*/
          if (yearArr[i - 1][0] == firstYearInGroup) {
            /* the first decade is represented by only its last year */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i - 1][0]}`,
              totalQuantity, currRateSum, currGroupSum)
          } else {
            /* and now save previous decade */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap,
              `${firstYearInGroup}-${yearArr[i - 1][0]}`, totalQuantity,
              currRateSum, currGroupSum)
          }
          //=== increase ===
          currGroupSum = yearArr[i][1].quantity;
          currRateSum = Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
          firstYearInGroup = yearArr[i][0];
          if (i == yearArr.length - 1) {
            /* decade's first year appears to be the very last one */
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}`, totalQuantity, currRateSum, currGroupSum)
          }
        } else if (i == yearArr.length - 1) {
          /* the very last year; processing the last decade */
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
          if (yearArr[i][0] == firstYearInGroup) {
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${yearArr[i][0]}`, totalQuantity, currRateSum, currGroupSum)
          } else {
            //--- assign ---
            totalQuantity = setStatMapEntry(decadeMap, `${firstYearInGroup}-${yearArr[i][0]}`,
              totalQuantity, currRateSum, currGroupSum)
          }
        } else {
          //=== increase ===
          currGroupSum += yearArr[i][1].quantity;
          currRateSum += Number(yearArr[i][1].rating) * yearArr[i][1].quantity;
        }
      }
    }
    let resultMap = calcPercentsAndRatesStat(decadeMap, totalQuantity);
    resultMap = new Map([...resultMap].filter(elem => elem[1].quantity > 0));
    return sortStat(resultMap, sortMode);
  } else {
    return new Map();
  }
}

function initYearMap() {
  let yearInitArr = new Array(
    new Date().getFullYear() + 1 - 1895);
  for (let i = 0; i < yearInitArr.length; i += 1) {
    yearInitArr[i] = [String(i + 1895),
    {
      quantity: 0,
      percent: 0,
      rating: 0
    }];
  }
  return new Map(yearInitArr);
}
///
function printYearStat() {
  yearMap = getYearStat();
  for (item of yearMap) {
    console.log(item[0] + " " + item[1].quantity)
  }
}
///
function drawYearStat() {
  yearMap = getYearStat();
  let mark = '|';
  for (item of yearMap) {
    let bar = '';
    for (let i = 1; i <= item[1].quantity; i += 1)
      bar += mark;
    console.log(item[0] + " " + bar)
  }
}