<template>
    <div v-if="yearList.length" class="stat-container">
        <Sortbar />
        <div v-for="item in yearList" :key="item.key">
            <div v-if="item.value && item.value.quantity > 0" class="chart-line year-chart">

                <!--<NuxtLink :to="{
                    path: '/',
                    query: {
                        filtermode: FilmStatMode.YEAR,
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
import { SortStatMode, FilmStatMode } from "../../composables/statistics/statisticsGenerator";
import { getYearStat } from "../../composables/statistics/yearManager";
const { userEvaluations } = defineProps(['userEvaluations']);

import useStat from "../../composables/useSort";
const { currentSortMode, collectionDimension, showData, barWidth, addData } = useStat();

import Sortbar from "./partials/Sortbar.vue";

const composedMap = getYearStat(toRaw(userEvaluations), currentSortMode.value);
collectionDimension.value.count = userEvaluations.length;
composedMap.forEach((value, key) => {
    if (value.quantity > collectionDimension.value.maxQuantity) {
        collectionDimension.value.maxQuantity = value.quantity;
    }
});
const yearStat = ref(composedMap);

const yearList = computed(() =>
    Array.from(yearStat.value.entries()).map(([key, value]) => ({ key, value }))
)

watch(currentSortMode, (newMode) => {
    console.log("Sort mode changed: ", newMode)
    yearStat.value = new Map(getYearStat(toRaw(userEvaluations), currentSortMode.value))
});

</script>
