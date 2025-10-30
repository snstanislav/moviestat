<template>
    <div class="stat-container">
        <SortbarMovieTable />
        <Filterbar />
        <div id="m-table-headline">
            <h2 class="category">Your rated movies ({{ movieList.length }})</h2>
            <input v-model="quickSearch" @input="performQuickSearch" type="text" placeholder="Quick search..." />
        </div>
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

const movieList = ref([]);
const quickSearch = ref("");

// initialize from props
onMounted(() => {
    movieList.value = toRaw(userEvaluations) || [];
    movieList.value = getMovieStat(movieList.value, currentMovieTableSortMode.value, currentFilter.value.filterMode, currentFilter.value.filterValue);
});

// perform search against original source (userEvaluations), case-insensitive
function performQuickSearch() {
    const query = (quickSearch.value || "").trim().toLowerCase();
    const source = toRaw(userEvaluations) || [];
    let list = source;

    if (query) {
        list = source.filter(elem => {
            const title = (elem?.movie?.commTitle || elem?.movie?.title || "").toString().toLowerCase();
            return title.includes(query);
        });
    }

    movieList.value = getMovieStat(list, currentMovieTableSortMode.value, currentFilter.value.filterMode, currentFilter.value.filterValue);
};

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

<style>
#m-table-headline {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    input {
        margin: 0.2rem;
        padding: 0.2rem 0.7rem;
        width: 30%;
        max-width: 10rem;
        height: 1.2rem;
        border-radius: 5px;
        border: 0;
        background: #ddd;
    }
}
</style>