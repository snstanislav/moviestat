<template>
    <nav class="sort-bar">
        <span class="sort-label">Sort by: </span>
        <span v-for="(sortOpt, index) in sortOptions">
            <a :key="sortOpt.key" @click="changeCurrentMovieTableSortMode(sortOpt.key); activeMTSortMode = sortOpt"
                :class="['sort-item', sortOpt.key === activeMTSortMode.key ? 'sort-item-selected' : '']">
                {{ sortOpt.label }}
            </a>{{ index < sortOptions.length - 1 ? "|" : "" }} </span>
    </nav>
</template>

<script setup>
import { SortStatMode } from "../../../composables/statistics/statisticsGenerator";
const { changeCurrentMovieTableSortMode } = useSort();

const sortOptions = [
    { key: SortStatMode.EVAL_DATETIME_DESC, label: "Recently rated" },
    { key: SortStatMode.EVAL_DATETIME_ASC, label: "Earliest rated" },
    { key: SortStatMode.USER_RATING_DESC, label: "Rating down" },
    { key: SortStatMode.USER_RATING_ASC, label: "Rating up" },
    { key: SortStatMode.YEAR_DESC, label: "Year down" },
    { key: SortStatMode.YEAR_ASC, label: "Year up" },
    { key: SortStatMode.IMDB_RATING_DESC, label: "IMDB rating down" },
    { key: SortStatMode.IMDB_RATING_ASC, label: "IMDB rating up" },
    { key: SortStatMode.IMDB_EVALNUM_DESC, label: "IMDB user votes down" },
    { key: SortStatMode.IMDB_EVALNUM_ASC, label: "IMDB user votes up" }
];
const activeMTSortMode = useState("activeMTSortMode", () => sortOptions[0]);
</script>