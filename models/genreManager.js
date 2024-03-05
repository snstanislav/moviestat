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
console.log(getGenreStat(SortStatMode.QUANTITY_DESC))

function getGenreStat(sortMode) {
  return sortStat(composeFullStat(FilmStatMode.GENRE), sortMode);
}
module.exports.getGenreStat = getGenreStat;
