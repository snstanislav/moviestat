<template>
    <div class="sort-bar">
        <span>Sort by: </span>
        <a @click="changeSortMode(SortStatMode.RATING_DESC)">Rating down</a> |
        <a @click="changeSortMode(SortStatMode.RATING_ASC)">Rating up</a> |
        <a @click="changeSortMode(SortStatMode.QUANTITY_DESC)">Quantity down</a> |
        <a @click="changeSortMode(SortStatMode.QUANTITY_ASC)">Quantity up</a> |
        <a @click="changeSortMode(SortStatMode.KEY_ASC)">A-Z (0-9)</a> |
        <a @click="changeSortMode(SortStatMode.KEY_DESC)">Z-A (9-0)</a>
    </div>
</template>

<script setup>
import { SortStatMode } from "../../../composables/statistics/statisticsGenerator";
import useStat from "../../../composables/useSort";
const { currentSortMode } = useStat();

function changeSortMode(sortMode) {
    currentSortMode.value = sortMode;
}
</script>