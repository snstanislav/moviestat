<template>
    <KeepAlive>
        <Person :userEvaluations="userEvaluations" :personStatFunc="getProducerStatistics"
            :filtermode="FilmStatMode.PRODUCER" :label :threshold :key="FilmStatMode.PRODUCER" />
    </KeepAlive>
</template>

<script setup>
import { FilmStatMode } from "../../composables/statistics/statisticsGenerator";
import { getProducerStatistics } from "../../composables/statistics/personManager";
import Person from "./partials/Person.vue";
const { userEvaluations } = defineProps(['userEvaluations']);
const label = "Producers";
const threshold = 3;
</script>