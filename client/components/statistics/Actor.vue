<template>
    <KeepAlive>
        <Person :userEvaluations="userEvaluations" :personStatFunc="getActorStatistics" :filtermode="FilmStatMode.ACTOR"
            :label :threshold :key="FilmStatMode.ACTOR" />
    </KeepAlive>
</template>

<script setup>
import { FilmStatMode } from "../../composables/statistics/statisticsGenerator";
import { getActorStatistics } from "../../composables/statistics/personManager";
import Person from "./partials/Person.vue";
const { userEvaluations } = defineProps(['userEvaluations']);
const label = "Actors / Actresses";
const threshold = 5;
</script>