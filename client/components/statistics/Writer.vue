<template>
    <KeepAlive>
        <Person :userEvaluations="userEvaluations" :personStatFunc="getWriterStatistics"
            :filtermode="FilmStatMode.WRITER" :label :threshold :key="FilmStatMode.WRITER" />
    </KeepAlive>
</template>

<script setup>
import { FilmStatMode } from "../../composables/statistics/statisticsGenerator";
import { getWriterStatistics } from "../../composables/statistics/personManager";
import Person from "./partials/Person.vue";
const { userEvaluations } = defineProps(['userEvaluations']);
const label = "Writers / Screenplay";
const threshold = 3;
</script>