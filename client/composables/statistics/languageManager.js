/**
 * @file languageManager.js
 * @description Provides statistics for films grouped by language.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @created 10.2025
 * @module composables/statistics/languageManager
 */

import { composeFullStat, sortStat, FilmStatMode } from './statisticsGenerator';

/**
 * Generates a sorted statistical collection of films by language.
 * @param {Array<Object>} db - Array of film evaluation objects
 * @param {string} sortMode - Sorting mode from FilmStatMode
 * @returns {Array<Object>} Sorted array of language statistics
 */
export function getLanguageStat(db, sortMode) {
  return sortStat(composeFullStat(db, FilmStatMode.LANGUAGE), sortMode);
}