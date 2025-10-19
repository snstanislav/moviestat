<template>
    <div class="content-section">
        <div v-if="movieList && movieList.length > 0" class="stat-container">
            <SortbarMovieTable />
            <div class="table-container">
                <MovieTableRow v-for="(item, index) in movieList" :key="item.movie._id" :index="index" :item="item" />
            </div>
        </div>
    </div>
</template>

<script setup>
import SortbarMovieTable from "./statistics/partials/SortbarMovieTable.vue";
import MovieTableRow from "./MovieTableRow.vue";
import { getMovieStat } from "../composables/statistics/movieManager";
const { userEvaluations } = defineProps(["userEvaluations"]);

const currentMovieTableSortMode = useState("currentMovieTableSortMode");

const movieList = ref(userEvaluations)

watch(currentMovieTableSortMode, (newMode) => {
    console.log("Sort movie mode changed: ", newMode)
    movieList.value = getMovieStat(movieList.value, currentMovieTableSortMode.value);
});

</script>