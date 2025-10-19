<template>
    <KeepAlive>
        <Person :userEvaluations="userEvaluations" :personStatFunc="getComposerStatistics"
            :filtermode="FilmStatMode.COMPOSER" :label :threshold :key="FilmStatMode.COMPOSER" />
    </KeepAlive>
</template>

<script setup>
import { FilmStatMode } from "../../composables/statistics/statisticsGenerator";
import { getComposerStatistics } from "../../composables/statistics/personManager";
import Person from "./partials/Person.vue";
const { userEvaluations } = defineProps(['userEvaluations']);
const label = "Composers / Soundtrack";
const threshold = 3;
</script>