<template>
    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <div v-if="userProfileData">

            <!-- SEARCH BAR -->
            <EvalSearchForm :currentSearch="searchQuery" />
            <br><br>

            <div class="section eval-container">
                <div class="clear-cache-wrapper">
                    <a v-if="isSearchChached" @click="clearChache">Clear search cache</a>
                </div>

                <div v-if="searchResult && total === 0">
                    <h3><i>No search results</i></h3>
                </div>
                <div v-if="searchResult">
                    <div v-for="(item, index) in resultsArr"
                        :class="['eval-film-item', selectedItem === item ? 'selected-eval-item' : '']" @click="selectResult(item, index)">

                        <div class="order"><span>{{ index + 1 }}</span></div>
                        <div class="poster"><img :src="item.poster" alt="Poster"></div>
                        <div class="text">
                            <h2>{{ item.title }} {{ item.year ? `(${item.year})` : "" }} — {{ prettyMediaType(item.type)
                            }}</h2>
                            <p>{{ item.overview }}</p>
                        </div>

                        <div class="evalBar">
                            <select v-model="newUserRating" name="personalRating">
                                <option value="10">10</option>
                                <option value="9">9</option>
                                <option value="8">8</option>
                                <option value="7">7</option>
                                <option value="6">6</option>
                                <option value="5">5</option>
                                <option value="4">4</option>
                                <option value="3">3</option>
                                <option value="2">2</option>
                                <option value="1">1</option>
                            </select>
                            <button @click="performEvaluation(item)">Rate</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <Login />
        </div>
    </div>
</template>

<script setup>
import { prettyMediaType } from "../composables/utils"
import useAuth from "../composables/useAuth";
const { userProfileData } = useAuth();

const config = useRuntimeConfig();
const toast = await useSafeToast();
const isReady = ref(false);

const route = useRoute();
const searchQuery = ref(route.query.search);
const searchResult = ref(null);
const isSearchChached = ref(false);

const selectedItem = ref(false);

const resultsArr = ref(null);
const total = ref(0);

const newUserRating = ref(10);

onMounted(async () => {
    isReady.value = true;
    if (route.query.search) {
        searchQuery.value = route.query.search;

        console.log("PERFORM MOUNTED / route.query.search: " + route.query.search)
        await performSearch(route.query.search);
    }
});

watch(() => route.query.search, async (newQuery) => {
    if (newQuery) {
        console.log("PERFORM WATCH / newQuery: " + newQuery)

        searchQuery.value = newQuery;
        await performSearch(newQuery);
    }
});

function selectResult(item) {
    if (selectedItem.value !== item) selectedItem.value = item;
}

async function performSearch(query) {
    try {
        const cached = localStorage.getItem(route.query.search)
        if (cached) {
            console.log("Loaded from cache")
            searchResult.value = JSON.parse(cached);
            isSearchChached.value = true;
        } else {
            console.log("Loaded from API / query: " + query)

            const res = await fetch(`${config.public.apiBase}/eval?search=${query}`, {
                method: "GET", headers: { "Content-Type": "application/json" },
                credentials: "include"
            });
            const resJson = await res.json();
            if (!res.ok && !resJson.success) {
                console.log("Search result failed: API response: " + resJson.message);

                searchResult.value = {
                    totalResults: 0,
                    totalPages: 1,
                    currentPage: 1,
                    results: []
                }
            } else {
                searchResult.value = resJson.data;
                console.log(resJson);
                localStorage.setItem(query, JSON.stringify(searchResult.value));
            }
        }
        resultsArr.value = searchResult.value.results;
        total.value = searchResult.value.results.length;

    } catch (err) {
        localStorage.clear();
        console.error("Error: performSearch", err);
    }
}

async function performEvaluation(item) {
    let question = `\nYou're trying to rate ${item.title} (${item.year})\n`;
    if (confirm(question)) {
        try {
            const res = await fetch(`${config.public.apiBase}/eval/rate`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    tmdbIDSearched: item.tmdbID,
                    mediaType: item.type,
                    userRating: newUserRating.value,
                    userEvalDate: (new Date()).toString()
                })
            });
            const resJson = await res.json();
            console.log(resJson.message)
            if (!res.ok && !resJson.success) {
                console.log("Evaluation failed: " + resJson.message);

            } else {
                console.log(resJson.data)

                if (resJson.data.isJustInserted) {
                    console.log("performEvaluation :: New movie item inserted into DB :: " + resJson.data.movieID);
                } else {
                    console.log("performEvaluation :: The movie already exists in DB :: " + resJson.data.movieID);
                }
                // window.open(`/media/${resJson.data.movieID}`, '_blank');
                navigateTo(`/media/${resJson.data.movieID}`);
                toast.success(resJson.message);
            }
        } catch (err) {
            localStorage.clear();
            console.error("Error: performEvaluation", err);
            toast.error("Something went wrong. Please try again");
        }
    }
}

function clearChache() {
    if (localStorage.getItem(route.query.search)) {
        localStorage.removeItem(route.query.search);
        console.log(`Cache for <${route.query.search}> cleared.`);
        isSearchChached.value = false;
    }
}
</script>