/**
 * @file countryManager.js
 * @description Provides statistics for films grouped by country.
 * @author Stanislav Snisar
 * @version 1.1.0
 * @created 03.03.2024
 * @modified 10.2025
 * @module composables/statistics/countryManager
 */

import { composeFullStat, sortStat, FilmStatMode } from './statisticsGenerator';

/**
 * Generates a sorted statistical collection of films by country.
 * @param {Array<Object>} db - Array of film evaluation objects
 * @param {string} sortMode - Sorting mode from FilmStatMode
 * @returns {Array<Object>} Sorted array of country statistics
 */
export function getCountryStat(db, sortMode) {
  return sortStat(composeFullStat(db, FilmStatMode.COUNTRY), sortMode);
}