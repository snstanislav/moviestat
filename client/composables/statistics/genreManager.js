/**
 * created 03.03.2024
 * modified 10/2025
 */

import { composeFullStat, sortStat, FilmStatMode } from './statisticsGenerator';

export function getGenreStat(db, sortMode) {
  return sortStat(composeFullStat(db, FilmStatMode.GENRE), sortMode);
}