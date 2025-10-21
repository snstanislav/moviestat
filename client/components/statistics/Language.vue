<template>
    <div v-if="languageList.length" class="stat-container">
        <Sortbar />
        <div v-for="item in languageList" :key="item.key">
            <div v-if="item.value && item.value.quantity > 0" class="chart-line language-chart">

                <div class="filter-bar">
                    <a @click="changeCurrentFilter(FilmStatMode.LANGUAGE, item.key)"
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
import { getLanguageStat } from "../../composables/statistics/languageManager";
import useSortAndFilter from "../../composables/useSortAndFilter";
const { changeCurrentFilter, currentSortMode, collectionDimension, showData, barWidth, addData } = useSortAndFilter();
const { userEvaluations } = defineProps(['userEvaluations']);

const composedMap = getLanguageStat(toRaw(userEvaluations), currentSortMode.value);
collectionDimension.value.count = userEvaluations.length;
composedMap.forEach((value, key) => {
    if (value.quantity > collectionDimension.value.maxQuantity) {
        collectionDimension.value.maxQuantity = value.quantity;
    }
});
const languageStat = ref(composedMap);

const languageList = computed(() =>
    Array.from(languageStat.value.entries()).map(([key, value]) => ({ key, value }))
);

watch(currentSortMode, (newMode) => {
    console.log("Sort mode changed: ", newMode)
    languageStat.value = new Map(getLanguageStat(toRaw(userEvaluations), currentSortMode.value))
});
</script>
