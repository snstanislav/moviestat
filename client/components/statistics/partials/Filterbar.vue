<template>
    <nav class="fitler-table-wrapper">
        <span class="nav-bar-label">Filter: </span>
        <a v-for="ratingIndex in 10" :key="ratingIndex"
            @click="changeCurrentFilter(FilmStatMode.USER_RATING, ratingIndex)" class="filter-item">
            {{ ratingIndex }}</a> |
        <a @click="changeCurrentFilter(FilmStatMode.FAVORITE, true)" class="filter-item">Favorite</a> |
        <a @click="changeCurrentFilter(FilmStatMode.TYPE, 'movie')" class="filter-item">Movies</a>
        <a @click="changeCurrentFilter(FilmStatMode.TYPE, 'tv')" class="filter-item">TV Series</a>
    </nav>

    <div v-if="currentFilter.filterValue" class="current-filter-wrapper">
        <span class="nav-bar-label current-filter-label">Current filter:</span>
        <span class="current-filter-value">{{ prettyFilterValue() }}</span>
        <button @click="clearFilter" class="clear-filter">Clear</button>
    </div>
</template>

<script setup>
import { FilmStatMode } from '~/composables/statistics/statisticsGenerator';
import useSortAndFilter from "../../../composables/useSortAndFilter";
const { currentFilter, changeCurrentFilter, clearFilter } = useSortAndFilter();
import { prettyMediaType } from "../../../composables/utils";

function prettyFilterValue() {
    if (currentFilter.value.filterMode === FilmStatMode.FAVORITE && currentFilter.value.filterValue === true) {
        return "Your favorites"
    } else if (currentFilter.value.filterMode === FilmStatMode.TYPE) {
        return prettyMediaType(currentFilter.value.filterValue);
    } else if (currentFilter.value.filterMode === FilmStatMode.USER_RATING) {
        return `Rated as ${currentFilter.value.filterValue}`;
    } else if (currentFilter.value.filterMode === FilmStatMode.DIRECTOR) {
        return `${currentFilter.value.filterValue} as Director`;
    } else if (currentFilter.value.filterMode === FilmStatMode.PRODUCER) {
        return `${currentFilter.value.filterValue} as Producer`;
    } else if (currentFilter.value.filterMode === FilmStatMode.WRITER) {
        return `Screenplay by ${currentFilter.value.filterValue}`;
    } else if (currentFilter.value.filterMode === FilmStatMode.COMPOSER) {
        return `Music by ${currentFilter.value.filterValue}`;
    } else if (currentFilter.value.filterMode === FilmStatMode.ACTOR) {
        return `Played by ${currentFilter.value.filterValue}`;
    } else {
        return currentFilter.value.filterValue;
    }
}
</script>