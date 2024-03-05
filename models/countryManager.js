/**
 * 03.03.2024
 */

// modules
const statisticsGenerator = require('./statisticsGenerator.js');

// enumerators
const FilmStatMode = statisticsGenerator.FilmStatMode;
const SortStatMode = statisticsGenerator.SortStatMode;

// functions
const composeFullStat = statisticsGenerator.composeFullStat;
const setStatMapEntry = statisticsGenerator.setStatMapEntry;
const calcPercentsAndRatesStat = statisticsGenerator.calcPercentsAndRatesStat;
const sortStat = statisticsGenerator.sortStat;

///
//console.log(getCountryStat(SortStatMode.KEY_DESC))

function getCountryStat(sortMode) {
  return sortStat(composeFullStat(FilmStatMode.COUNTRY), sortMode);
}
module.exports.getCountryStat = getCountryStat;