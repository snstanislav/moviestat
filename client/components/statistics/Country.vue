<template>
    <div v-if="countryList.length" class="stat-container">
        <SortWorld />
        <div v-for="item in countryList" :key="item.key">
            <div v-if="item.value && item.value.quantity > 0" class="chart-line country-chart">

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
import { getCountryStat } from "../../composables/statistics/countryManager";
const { userEvaluations } = defineProps(['userEvaluations']);

import useStat from "../../composables/useSort";
const { currentSortMode, collectionDimension, showData, barWidth, addData } = useStat();

import SortWorld from "./sortbar/SortWorld.vue";

const composedMap = getCountryStat(toRaw(userEvaluations), currentSortMode.value);
collectionDimension.value.count = userEvaluations.length;
composedMap.forEach((value, key) => {
    if (value.quantity > collectionDimension.value.maxQuantity) {
        collectionDimension.value.maxQuantity = value.quantity;
    }
});
const countryStat = ref(composedMap);

const countryList = computed(() =>
    Array.from(countryStat.value.entries()).map(([key, value]) => ({ key, value }))
)

watch(currentSortMode, (newMode) => {
    console.log("Sort mode changed: ", newMode)
    countryStat.value = new Map(getCountryStat(toRaw(userEvaluations), currentSortMode.value))
});

</script>
