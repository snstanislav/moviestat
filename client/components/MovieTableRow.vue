<template>
    <div v-if="item && item.movie" class="row">
        <div class="row-section col-order-fav">
            <div class="row-subsection ord">{{ index + 1 }}</div>
            <!-- FAVORITE -->
            <div @click="handleChangeFavorite" class="row-subsection favor">
                <span>
                    <img :key="isFavorite" :src="isFavorite ? '/fav.png' : '/no-fav.png'" class="fav-button" />
                </span>
            </div><!-- /favor -->
        </div>
        <div class="row-section col-poster-dur">
            <NuxtLink :to="`/media/${item.movie._id}`" target="_blank">
                <img :src="item.movie.poster" :alt="item.movie.origTitle" loading="lazy" />
            </NuxtLink>

            <div class="duration">
                {{ item.movie.duration }}
            </div>
        </div>
        <div class="row-section col-title">
            <div class="row-subsection comm-title">
                {{ item.movie.commTitle ? item.movie.commTitle : (item.movie.origTitle ? item.movie.origTitle : "") }}
            </div>
            <div v-if="item.movie.origTitle" class="row-subsection orig-title">
                <i>Original title: <b>{{ item.movie.origTitle }}</b></i>
            </div>
        </div>
        <div class="row-section col-year-imdb">
            <div v-if="item.movie.year" class="row-subsection year">
                {{ item.movie.year }}
            </div>
            <div v-if="item.movie.type" class="row-subsection type">
                {{ prettyMediaType(item.movie.type) }}
            </div>
            <div class="row-subsection">
                <span v-if="item.movie.imdbRating">IMDB:
                    {{ item.movie.imdbRating }} {{ item.movie.imdbVotes ? "(" + item.movie.imdbVotes + ")" : ""
                    }}</span>
            </div>
        </div>
        <div class="row-section col-user-rating">
            <div class="row-subsection table-eval-wrapper">
                <RatingButton :userRating :toogleDialogFunc="toogleDialog" />

                <div v-if="isDialogVisible" class="change-wrap">
                    <!-- CHANGE RATING -->
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
                    <button @click="handleChangeRating" class="change-eval">Change</button>
                </div> <!-- change-wrap -->
                <div class="eval-date-text">
                    <span> {{ userChangeEvalDate ? userChangeEvalDate.slice(0,
                        userEvalDate.indexOf(" GMT")) : userEvalDate.slice(0, userEvalDate.indexOf(" GMT")) }}</span>
                </div>
            </div><!-- /eval-wrap -->
        </div>
    </div>
</template>

<script setup>
import { prettyMediaType } from "../composables/utils";
import changeRate from "../composables/changeRate";
import RatingButton from "./statistics/partials/RatingButton.vue";
import loadData from "../composables/loadData";
const { setEvaluations } = loadData();

const { item, index } = defineProps(["item", "index"]);

const { isDialogVisible, toogleDialog, changeFavorite, changeRating } = changeRate();

const isReady = ref(false);
const mediaItem = ref(item.movie);
const userRating = ref(item.userRating);
const userEvalDate = ref(item.userEvalDate);
const userChangeEvalDate = ref(item.userChangeEvalDate);
const isFavorite = ref(item.isFavorite);
const newUserRating = ref(10);

onMounted(async () => {
    isReady.value = true;
});

async function handleChangeFavorite() {
    let question = isFavorite.value ? "\nNot favorite anymore?\n" : "\nWant to add to favorites?\n";
    if (confirm(question)) {
        const newValue = await changeFavorite(mediaItem.value._id, isFavorite.value);
        isFavorite.value = newValue;

        await setEvaluations();
    }
}

async function handleChangeRating() {
    if (userRating.value.toString() !== newUserRating.value.toString()) {
        let question = `\nDo you really want to change the rating?\n`;
        if (confirm(question)) {
            await changeRating(mediaItem.value._id, newUserRating.value);
            userRating.value = newUserRating.value;

            await setEvaluations();
        }
    }
}
</script>