<template>
    <KeepAlive>
        <Person :userEvaluations="userEvaluations" :personStatFunc="getDirectorStatistics"
            :filtermode="FilmStatMode.DIRECTOR" :label :threshold :key="FilmStatMode.DIRECTOR" />
    </KeepAlive>
</template>

<script setup>
import { FilmStatMode } from "../../composables/statistics/statisticsGenerator";
import { getDirectorStatistics } from "../../composables/statistics/personManager";
import Person from "./partials/Person.vue";
const { userEvaluations } = defineProps(['userEvaluations']);
const label = "Directors";
const threshold = 3;
</script>