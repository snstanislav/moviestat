<template>
    <div v-if="decadeList.length" class="stat-container">
        <Sortbar />
        <div v-for="item in decadeList" :key="item.key">
            <div v-if="item.value && item.value.quantity > 0" class="chart-line decade-chart">

                <div class="filter-bar">
                    <a @click="changeCurrentFilter(FilmStatMode.DECADE, item.key); resetTabs();"
                        class="filter-item">filter</a>
                </div>

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
import Sortbar from "./partials/Sortbar.vue";
import { FilmStatMode } from "../../composables/statistics/statisticsGenerator";
import { composeDecadeStat } from "../../composables/statistics/yearManager";
import useSortAndFilter from "../../composables/useSortAndFilter";
const { changeCurrentFilter, currentSortMode, collectionDimension, showData, barWidth, addData } = useSortAndFilter();
const { userEvaluations } = defineProps(['userEvaluations']);

const composedMap = composeDecadeStat(toRaw(userEvaluations), currentSortMode.value);
collectionDimension.value.count = userEvaluations.length;
composedMap.forEach((value, key) => {
    if (value.quantity > collectionDimension.value.maxQuantity) {
        collectionDimension.value.maxQuantity = value.quantity;
    }
});
const decadeStat = ref(composedMap);

const decadeList = computed(() =>
    Array.from(decadeStat.value.entries()).map(([key, value]) => ({ key, value }))
);

watch(currentSortMode, (newMode) => {
    console.log("Sort mode changed: ", newMode)
    decadeStat.value = new Map(composeDecadeStat(toRaw(userEvaluations), currentSortMode.value));
});
</script>