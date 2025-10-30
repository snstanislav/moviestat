/**
 * @file useSortAndFilter.js
 * @description Vue 3 composable for managing sorting and filtering of movies/statistics tables.
 * Provides reactive state for current filter, sort modes, collection dimensions, and utility functions.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module composables/useSortAndFilter
 */

import { SortStatMode } from "./statistics/statisticsGenerator";
import useTabs from "../composables/useTabs";

export default function useSortAndFilter() {
    const { resetTabs } = useTabs();

    /**
     * Reactive state holding the current filter
     * @type {import('vue').Ref<{filterMode: string, filterValue: string}>}
     */
    const currentFilter = useState("currentFilter", () => ({
        filterMode: "", filterValue: ""
    }));

    /**
     * Reactive state holding current movie table sort mode
     * @type {import('vue').Ref<string>}
     */
    const currentMovieTableSortMode = useState("currentMovieTableSortMode", () => SortStatMode.EVAL_DATETIME_DESC);

    /**
     * Reactive state holding current sort mode for other statistics
     * @type {import('vue').Ref<string>}
     */
    const currentSortMode = useState("currentSortMode", () => SortStatMode.QUANTITY_DESC);

    /**
     * Reactive state holding collection dimensions for chart calculations
     * (genres, countries, langs, decades, years)
     * @type {import('vue').Ref<{count: number, maxQuantity: number}>}
     */
    const collectionDimension = ref({ count: 0, maxQuantity: 0 });

    /**
     * Changes the current filter and resets tabs
     * @param {string} filterMode - The filter mode
     * @param {string} filterValue - The value to filter by
     */
    function changeCurrentFilter(filterMode, filterValue) {
        console.log("changeCurrentFilter: %s = %s", filterMode, filterValue)
        currentFilter.value.filterMode = filterMode;
        currentFilter.value.filterValue = filterValue;

        resetTabs();
    }

    /**
     * Clears the current filter
     */
    function clearFilter() {
        currentFilter.value.filterMode = "";
        currentFilter.value.filterValue = "";
    }

    /**
     * Changes the current sort mode for the movie table
     * @param {string} sortMode - New sort mode
     */
    function changeCurrentMovieTableSortMode(sortMode) {
        currentMovieTableSortMode.value = sortMode;
    }

    /**
     * Changes the general current sort mode for other statistics
     * @param {string} sortMode - New sort mode
     */
    function changeCurrentSortMode(sortMode) {
        currentSortMode.value = sortMode;
    }

    /**
     * Returns the value to display based on current sort mode 
     * (genres, countries, langs, decades, years)
     * @param {Object} value - Item with rating and quantity
     * @returns {number} Value to display in chart/table
     */
    function showData(value) {
        if (currentSortMode.value.includes('rating')) return value.rating;
        return value.quantity;
    }

    /**
     * Calculates the width of bars for chart display
     * (genres, countries, langs, decades, years)
     * @param {Object} value - Item with rating and quantity
     * @returns {number} Calculated bar width
     */
    function barWidth(value) {
        let bar = 0
        if (currentSortMode.value.includes('rating')) {
            return value.rating * 8
        }
        if (currentSortMode.value.includes('quantity') || currentSortMode.value.includes('key')) {
            const step = Math.round(collectionDimension.value.count / collectionDimension.value.maxQuantity * 10) / 10;
            for (let i = 1; i <= value.quantity; i += 1) bar += step;
            return bar;
        }
    }

    /**
     * Formats data for display depending on sort mode
     * (genres, countries, langs, decades, years)
     * @param {Object} value - Item with rating, quantity, percent
     * @returns {string|number} Formatted display value
     */
    function addData(value) {
        if (currentSortMode.value.includes('rating')) return value.quantity;
        if (currentSortMode.value.includes('quantity')) return `${value.percent}%`;
        return `(${value.rating})`;
    }

    return {
        currentFilter,
        currentMovieTableSortMode,
        currentSortMode,
        collectionDimension,

        changeCurrentFilter,
        clearFilter,
        changeCurrentMovieTableSortMode,
        changeCurrentSortMode,
        showData,
        barWidth,
        addData
    }
}