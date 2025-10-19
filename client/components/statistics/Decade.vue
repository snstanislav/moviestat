<template>
    <div v-if="decadeList.length" class="stat-container">
        <Sortbar />
        <div v-for="item in decadeList" :key="item.key">
            <div v-if="item.value && item.value.quantity > 0" class="chart-line decade-chart">

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
import { composeDecadeStat } from "../../composables/statistics/yearManager";
const { userEvaluations } = defineProps(['userEvaluations']);

import useStat from "../../composables/useSort";
const { currentSortMode, collectionDimension, showData, barWidth, addData } = useStat();

import Sortbar from "./partials/Sortbar.vue";

const composedMap = composeDecadeStat(toRaw(userEvaluations), currentSortMode.value);
collectionDimension.value.count = userEvaluations.length;
composedMap.forEach((value, key) => {
    if (value.quantity > collectionDimension.value.maxQuantity) {
        collectionDimension.value.maxQuantity = value.quantity;
    }
});
console.log("COMPOSED")
console.log(composedMap)
const decadeStat = ref(composedMap);

const decadeList = computed(() =>
    Array.from(decadeStat.value.entries()).map(([key, value]) => ({ key, value }))
)

watch(currentSortMode, (newMode) => {
    console.log("Sort mode changed: ", newMode)
    decadeStat.value = new Map(composeDecadeStat(toRaw(userEvaluations), currentSortMode.value));
});

</script>