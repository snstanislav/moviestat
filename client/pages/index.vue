<template>
    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <div v-if="userProfileData">
            <!-- SEARCH BAR -->
            <EvalSearchForm :currentSearch="currentSearch" />
            <br><br>

            <!-- MAIN CONTENT -->
            <div class="section">
                <!-- TAB BAR -->
                <nav class="tab-bar">
                    <span>Category: </span>
                    <button v-for="tab in tabs" :key="tab.name" @click="activeTab = tab"
                        :class="['tab-button', activeTab.name === tab.name ? 'tab-button-selected' : '']">
                        {{ tab.label }}
                    </button>

                </nav>
                <KeepAlive>
                    <component v-if="userEvaluations && userEvaluations.length > 0" :is="activeTab.component"
                        :key="activeTab.name" :userEvaluations="userEvaluations" />
                </KeepAlive>
            </div>
        </div>

        <div v-else>
            <Login />
        </div>
    </div>
</template>

<script setup>
//const config = useRuntimeConfig();
//const { data, error, pending } = await useFetch(`${config.public.apiBase}`);

import useAuth from "../composables/useAuth";
const { userProfileData } = useAuth();

import loadData from "../composables/loadData";
const { userEvaluations, setEvaluations } = loadData();

import EvalSearchForm from "../components/EvalSearchForm.vue";

import MovieTable from "../components/MovieTable.vue";
import Year from "../components/statistics/Year.vue";
import Decade from "../components/statistics/Decade.vue";
import Genre from "../components/statistics/Genre.vue";
import Language from "../components/statistics/Language.vue";
import Country from "../components/statistics/Country.vue";

import Director from "../components/statistics/Director.vue";
import Writer from "../components/statistics/Writer.vue";
import Producer from "../components/statistics/Producer.vue";
import Composer from "../components/statistics/Composer.vue";
import Actor from "../components/statistics/Actor.vue";


const currentSearch = ref(""); // filler
const isReady = ref(false);

const tabs = [
    { name: "MovieTable", component: MovieTable, label: "Movie rate table" },
    { name: "Genre", component: Genre, label: "Genre" },
    { name: "Country", component: Country, label: "Country" },
    { name: "Language", component: Language, label: "Language" },
    { name: "Decade", component: Decade, label: "Decade" },
    { name: "Year", component: Year, label: "Year" },

    { name: "Director", component: Director, label: "Director" },
    { name: "Producer", component: Producer, label: "Producer" },
    { name: "Writer", component: Writer, label: "Writer" },
    { name: "Composer", component: Composer, label: "Composer" },
    { name: "Actor", component: Actor, label: "Actor / Actress" }
];

const activeTab = shallowRef(tabs[0]);

onMounted(async () => {
    isReady.value = true;
    await setEvaluations();
});

watch(userProfileData, async (val) => {
    if (val) {
        await setEvaluations();
    }
});
</script>