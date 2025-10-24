<template>
    <div class="stat-container">
        <SortbarMovieTable />
        <Filterbar />

        <h2 class="category">Your rated movies ({{ movieList.length }})</h2>
        <div v-if="movieList && movieList.length > 0" class="table-container">
            <MovieTableRow v-for="(item, index) in movieList" :key="item.movie._id" :index="index" :item="item" />
        </div>
        <div v-else class="empty-result">The list is empty...</div>
    </div>
</template>

<script setup>
import SortbarMovieTable from "./statistics/partials/SortbarMovieTable.vue";
import Filterbar from "./statistics/partials/Filterbar.vue";
import MovieTableRow from "./MovieTableRow.vue";
import { getMovieStat } from "../composables/statistics/movieManager";
import useSortAndFilter from "../composables/useSortAndFilter";
const { currentFilter, currentMovieTableSortMode } = useSortAndFilter();
const { userEvaluations } = defineProps(["userEvaluations"]);

const movieList = ref(userEvaluations);

onMounted(() => {
    movieList.value = getMovieStat(movieList.value, currentMovieTableSortMode.value, currentFilter.value.filterMode, currentFilter.value.filterValue);
});

watch(() => userEvaluations, async (newMode) => {
    movieList.value = toRaw(userEvaluations);
    movieList.value = getMovieStat(movieList.value, currentMovieTableSortMode.value, currentFilter.value.filterMode, currentFilter.value.filterValue);
    console.log("userEvaluations has changed.")
});

watch(currentFilter.value, (newMode) => {
    console.log("MovieTable: FILTER movie mode changed.")
    movieList.value = toRaw(userEvaluations);
    movieList.value = getMovieStat(movieList.value, currentMovieTableSortMode.value, currentFilter.value.filterMode, currentFilter.value.filterValue);
});

watch(currentMovieTableSortMode, (newMode) => {
    console.log("MovieTable: SORT movie mode changed.")
    movieList.value = getMovieStat(movieList.value, currentMovieTableSortMode.value, currentFilter.value.filterMode, currentFilter.value.filterValue);
});
</script>