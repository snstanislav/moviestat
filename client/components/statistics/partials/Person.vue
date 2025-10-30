<template>
    <div v-if="personList" class="stat-container">
        <Sortbar />
        <div class="stat-settings-bar">
            <h2 class="category">{{ label }} ({{ personList.length }})</h2>
            <div class="threshold-wrapper"><span>Quantity threshold: </span>
                <select v-model="currentThreshold" @change="selectThreshold" name="threshold">
                    <option class="standart-options" value="10">10</option>
                    <option value="9">9</option>
                    <option value="8">8</option>
                    <option value="7">7</option>
                    <option value="6">6</option>
                    <option class="standart-options" value="5">5</option>
                    <option value="4">4</option>
                    <option class="standart-options" value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                </select>
            </div>

            <div class="view-list-mode-wrapper" @click=";">
                <button :class="personListMode === LIST_MODE.TILES ? 'tiles-view-mode-active' : 'tiles-view-mode'"
                    @click="switchPersonListMode(LIST_MODE.TILES)" title="Tiles view"></button>
                <button :class="personListMode === LIST_MODE.TABLE ? 'table-view-mode-active' : 'table-view-mode'"
                    @click="switchPersonListMode(LIST_MODE.TABLE)" title="Table view"></button>
            </div>
        </div>

        <div v-if="personList.length" :class="`person-stat-list-${personListMode}`">
            <div v-for="(item, index) in personList" :key="item.key" class="person-stat-card">
                <div v-if="item.value && item.value.quantity > 0">
                    <div class="filter-bar">
                        <a @click="changeCurrentFilter(filtermode, item.key)"
                            class="filter-item">filter</a>
                    </div>

                    <div class="ord">
                        {{ index + 1 }}
                    </div>
                </div>

                <div class="card-photo">
                    <a v-if="item.value.imdbID" title="IMDB profile"
                        :href="`https://www.imdb.com/name/${item.value.imdbID}/`" target="_blank">

                        <img :src="item.value.photo ? item.value.photo : '/person-blank.png'" alt="Mini portrait"
                            loading="lazy" />
                    </a>

                </div>
                <div class="card-name">
                    {{ item.key }}
                </div>
                <div class="person-stat">
                    <span class="person-rank"> {{ item.value.rating }} </span>|<span class="person-quant"> {{
                        item.value.quantity }} </span>
                </div>
            </div>
        </div>
        <div v-else class="empty-result">The list is empty...</div>
    </div>
</template>

<script setup>
import Sortbar from "./Sortbar.vue";
import { SortStatMode } from "../../../composables/statistics/statisticsGenerator";
import useSortAndFilter from "../../../composables/useSortAndFilter";
const { changeCurrentFilter } = useSortAndFilter();
const { userEvaluations, personStatFunc, filtermode, label, threshold } = defineProps(['userEvaluations', 'personStatFunc', 'filtermode', 'label', 'threshold']);

const LIST_MODE = { TILES: "tiles", TABLE: "table" };

const currentSortMode = useState("currentSortMode", () => SortStatMode.QUANTITY_DESC);
const personListMode = useState("personListMode", () => LIST_MODE.TABLE);
const currentThreshold = ref(threshold);

const personComposedMap = ref(personStatFunc(toRaw(userEvaluations), currentSortMode.value, currentThreshold.value));

const personList = computed(() =>
    Array.from(personComposedMap.value.entries()).map(([key, value]) => ({ key, value }))
);

watch(currentSortMode, (newMode) => {
    console.log("Sort mode changed: ", newMode)
    personComposedMap.value = new Map(personStatFunc(toRaw(userEvaluations), currentSortMode.value, currentThreshold.value));
});

function switchPersonListMode(mode) {
    personListMode.value = mode;
}

function selectThreshold() {
    personComposedMap.value = new Map(personStatFunc(toRaw(userEvaluations), currentSortMode.value, currentThreshold.value));
}
</script>