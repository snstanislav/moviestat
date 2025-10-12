/**
 * created 10/2025
 */

import { composeFullStat, sortStat, FilmStatMode } from './statisticsGenerator';

export function getLanguageStat(db, sortMode) {
  return sortStat(composeFullStat(db, FilmStatMode.LANGUAGE), sortMode);
}