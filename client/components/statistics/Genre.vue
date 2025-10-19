<template>
    <div v-if="genreList.length" class="stat-container">
        <Sortbar />
        <div v-for="item in genreList" :key="item.key">
            <div v-if="item.value && item.value.quantity > 0" class="chart-line genre-chart">

                <!--<NuxtLink :to="{
                    path: '/',
                    query: {
                        filtermode: FilmStatMode.GENRE,
                        filtervalue: key,
                    },
                    hash: '#movieSect',
                }"> filter </NuxtLink>-->

                <!-- Label -->
                <span class="chart-key">
                    {{ item.key }}
                </span>
                <!-- Bar -->
                <span class="chart-bar" :style="{ width: barWidth(item.value) + '%' }">
                    {{ showData(item.value) }}
                </span>
                <!-- Additional info -->
                <span class="chart-addition">{{ addData(item.value) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FilmStatMode } from "../../composables/statistics/statisticsGenerator";
import { getGenreStat } from "../../composables/statistics/genreManager";
const { userEvaluations } = defineProps(['userEvaluations']);

import useStat from "../../composables/useSort";
const { currentSortMode, collectionDimension, showData, barWidth, addData } = useStat();

import Sortbar from "./partials/Sortbar.vue";

const composedMap = getGenreStat(toRaw(userEvaluations), currentSortMode.value);
collectionDimension.value.count = userEvaluations.length;
composedMap.forEach((value, key) => {
    if (value.quantity > collectionDimension.value.maxQuantity) {
        collectionDimension.value.maxQuantity = value.quantity;
    }
});
const genreStat = ref(composedMap);

const genreList = computed(() =>
    Array.from(genreStat.value.entries()).map(([key, value]) => ({ key, value }))
);

watch(currentSortMode, (newMode) => {
    console.log("Sort mode changed: ", newMode)
    genreStat.value = new Map(getGenreStat(toRaw(userEvaluations), currentSortMode.value))
});
</script>
