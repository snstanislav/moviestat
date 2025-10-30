<template>
    <div v-if="!isReady" class="loader-wrapper">
        <span class="loader"></span>
    </div>
    <div v-else>
        <div v-if="userProfileData">
            <div class="section">
                <div v-if="mediaItem" class="film-wrapper">
                    <div class="film-headline">
                        <div class="film-imdb"><!-- left -->
                            <span v-if="mediaItem.imdbRating">
                                IMDB: {{ mediaItem.imdbRating }} ({{ mediaItem.imdbVotes }})
                            </span>
                        </div>
                        <div class="film-cert"><!-- center -->
                            <span v-if="mediaItem.type">{{ prettyMediaType(mediaItem.type) }} </span>
                            <span v-if="mediaItem.duration">&nbsp;|&nbsp;{{ mediaItem.duration }} </span>
                            <span v-if="mediaItem.parental">&nbsp;|&nbsp;{{ mediaItem.parental }} </span>
                        </div><!-- /film-cert -->
                        <!-- FAVORITE -->
                        <div @click="handleChangeFavorite" class=favor title="Favorite">
                            <span>
                                <img :key="isFavorite" :src="isFavorite ? '/fav.png' : '/no-fav.png'"
                                    class="fav-button" />
                            </span>
                        </div><!-- /favor -->
                    </div><!-- /film-headline -->

                    <div class="film-basic-info">
                        <div class="film-img-eval-wrap"><!-- left -->
                            <div>
                                <img :alt="mediaItem.origTitle" :src="mediaItem.poster">
                            </div>
                            <div class="media-eval-wrapper">
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
                                    <button @click="handleChangeRating" class="change-eval">Change your
                                        rating</button>
                                    <!-- REMOVE RATING-->
                                    <button @click="handleDeleteRating" class="remove" type="submit">Remove you
                                        rating</button>
                                </div> <!-- change-wrap -->
                                <div class="eval-date-text">
                                    <p>
                                        <span class="ed-label">Evaluated: </span>
                                        {{ userEvalDate.slice(0, userEvalDate.indexOf(" GMT")) }}
                                        <span v-if="userChangeEvalDate" class="ed-label"> /</span>
                                    </p>
                                    <p v-if="userChangeEvalDate">
                                        <span class="ed-label">Changed: </span>
                                        {{ userChangeEvalDate.slice(0,
                                            userEvalDate.indexOf(" GMT")) }}
                                    </p>
                                </div>
                            </div><!-- /eval-wrap -->
                        </div><!-- /film-img-eval-wrap -->

                        <div class="film-descr"><!-- right -->
                            <div class="film-comm-title">
                                <div>{{ mediaItem.commTitle ? mediaItem.commTitle : mediaItem.origTitle }}
                                    <span v-if="mediaItem.year">({{ mediaItem.year }})</span>
                                </div>

                                <nav>
                                    <a v-if="mediaItem.imdbID" title="TMDB profile"
                                        :href="`https://www.themoviedb.org/${mediaItem.type}/${mediaItem.tmdbID}/`"
                                        target="blank"><img src="../../public/tmdb-logo.png" alt="TMDB logo">
                                    </a>
                                    <a v-if="mediaItem.imdbID" title="IMDB profile"
                                        :href="`https://www.imdb.com/title/${mediaItem.imdbID}/`" target="blank"><img
                                            src="../../public/imdb-logo.png" alt="IMDB logo">
                                    </a>
                                </nav>
                            </div>

                            <div v-if="mediaItem.origTitle" class="descr-container film-orig-title">
                                Original title: <span>{{ mediaItem.origTitle }}</span>
                            </div>

                            <div class="descr-container">
                                <div v-if="mediaItem.genres && mediaItem.genres.length > 0" class="film-genre">
                                    {{ mediaItem.genres.join(" | ") }}
                                </div>
                                <div v-if="mediaItem.countries && mediaItem.countries.length > 0" class="film-country">
                                    {{ mediaItem.countries.join(" | ") }}</div>
                                <div v-if="mediaItem.languages && mediaItem.languages.length > 0" class="film-language">
                                    {{ mediaItem.languages.join(" | ") }}</div>

                                <div v-if="mediaItem.budget && mediaItem.budget > 0" class="film-budget">
                                    Budget: {{ Number(mediaItem.budget).toLocaleString() }} $
                                </div>
                                <div v-if="mediaItem.boxOffice && mediaItem.boxOffice > 0" class="film-grossww">
                                    Gross WW: {{ Number(mediaItem.boxOffice).toLocaleString() }} $
                                </div>
                            </div>

                            <div v-if="mediaItem.plot" class="descr-container film-plot">
                                {{ mediaItem.plot }}
                            </div>
                        </div><!-- /film-descr-->
                    </div><!-- /film-basic-info -->

                    <div v-if="mediaItem.directors && mediaItem.directors.length > 0" class="crew-wrapper">
                        <h3>Director:&nbsp;</h3>
                        <div class="film-crew">
                            <span v-for="item in mediaItem.directors" class="crew-single-person">
                                <span v-if="item.person">
                                    <a v-if="item.person.imdbID"
                                        :href="`https://www.imdb.com/name/${item.person.imdbID}/`" target="blank">
                                        {{ item.person.name }}
                                    </a>
                                    <span v-else>
                                        {{ item.person.name }}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>

                    <div v-if="mediaItem.writers && mediaItem.writers.length > 0" class="crew-wrapper">
                        <h3>Writer / Screenplay:&nbsp;</h3>
                        <div class="film-crew">
                            <span v-for="item in mediaItem.writers" class="crew-single-person">
                                <span v-if="item.person">
                                    <a v-if="item.person.imdbID"
                                        :href="`https://www.imdb.com/name/${item.person.imdbID}/`" target="blank">
                                        {{ item.person.name }}
                                    </a>
                                    <span v-else>
                                        {{ item.person.name }}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>

                    <div v-if="mediaItem.producers && mediaItem.producers.length > 0" class="crew-wrapper">
                        <h3>Producers:&nbsp;</h3>
                        <div class="film-crew">
                            <span v-for="item in mediaItem.producers" class="crew-single-person">
                                <span v-if="item.person"><a v-if="item.person.imdbID"
                                        :href="`https://www.imdb.com/name/${item.person.imdbID}/`" target="blank">
                                        {{ item.person.name }}
                                    </a>
                                    <span v-else>
                                        {{ item.person.name }}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>

                    <div v-if="mediaItem.composers && mediaItem.composers.length > 0" class="crew-wrapper">
                        <h3>Composer:&nbsp;</h3>
                        <div class="film-crew">
                            <span v-for="item in mediaItem.composers" class="crew-single-person">
                                <span v-if="item.person">
                                    <a v-if="item.person.imdbID"
                                        :href="`https://www.imdb.com/name/${item.person.imdbID}/`" target="blank">
                                        {{ item.person.name }}
                                    </a>
                                    <span v-else>
                                        {{ item.person.name }}
                                    </span>
                                </span>
                            </span>
                        </div>
                    </div>

                    <div v-if="mediaItem.cast && mediaItem.cast.length > 0" class="crew-wrapper">
                        <h3>Cast:&nbsp;</h3>
                        <div class="film-cast">
                            <div v-for="item in mediaItem.cast" :class="item.person ? 'role-item' : 'blank-space'">
                                <div v-if="item.person" class="photo-wrapper">
                                    <a v-if="item.person.imdbID"
                                        :href="`https://www.imdb.com/name/${item.person.imdbID}/`" target="blank">
                                        <img v-if="item.person.photo" :src="item.person.photo" :alt="item.person.name">
                                        <img v-else src="../../public/person-blank.png" :alt="item.person.name">
                                    </a>
                                    <span v-else>
                                        <img class="disabled" :src="item.person.photo" :alt="item.person.name">
                                        <img class="disabled" :src="item.person.photo" :alt="item.person.name">
                                    </span>
                                </div>
                                <div v-if="item.person" class="cast-name">
                                    {{ item.person.name }}
                                    <div class="cast-character">
                                        {{ item.character }}
                                    </div>
                                </div>
                            </div><!-- /film-cast -->
                        </div>
                    </div>
                </div>
                <div v-else :class="msgNotExist ? 'empty-result' : ''">
                    {{ msgNotExist }}
                </div>
            </div>
        </div>

        <div v-else>
            <component :is="loginComponent" :key="'media'" />
        </div>
    </div>
</template>

<script setup>
import Login from "~/components/Login.vue";
import { prettyMediaType } from "../../composables/utils";
import useAuth from "../composables/useAuth";
import changeRate from "../../composables/changeRate";
import RatingButton from "~/components/statistics/partials/RatingButton.vue";

const toast = await useSafeToast();

const { userProfileData } = useAuth();
const { isDialogVisible, toogleDialog, changeFavorite, changeRating, deleteRating } = changeRate();
const route = useRoute();
const isReady = ref(false);
const msgNotExist = ref("");
const loginComponent = shallowRef(null);

const mediaItem = ref(null);
const userRating = ref(0);
const userEvalDate = ref("");
const userChangeEvalDate = ref("");
const isFavorite = ref(false);
const newUserRating = ref(10);
let evaluatedSingleMedia = null;

onMounted(async () => {
    isReady.value = true;

    try {
        evaluatedSingleMedia = await loadCurrMovie(route.params.id);

        if (userProfileData.value && !evaluatedSingleMedia.movie) {
            msgNotExist.value = "Movie doesn't exist...";
        }
        if (evaluatedSingleMedia) {
            refreshCurrentState();
        }
    } catch (err) {
        msgNotExist.value = "Movie doesn't exist...";
    }

    if (!userProfileData.value) {
        loginComponent.value = Login;
    }
});

watch(userProfileData, async () => {
    evaluatedSingleMedia = await loadCurrMovie(route.params.id);

    if (evaluatedSingleMedia && evaluatedSingleMedia.movie) {
        refreshCurrentState();
    } else {
        msgNotExist.value = "Movie doesn't exist...";

        if (!userProfileData.value) {
            loginComponent.value = Login;
        }
    }
});

function refreshCurrentState() {
    clearInvalids(evaluatedSingleMedia.movie)

    mediaItem.value = evaluatedSingleMedia.movie;
    userRating.value = evaluatedSingleMedia.userRating;
    userEvalDate.value = evaluatedSingleMedia.userEvalDate;
    userChangeEvalDate.value = evaluatedSingleMedia.userChangeEvalDate;
    isFavorite.value = evaluatedSingleMedia.isFavorite;
}

function clearInvalids(movie) {
    movie.directors = movie.directors.filter(elem => elem.person);
    movie.writers = movie.writers.filter(elem => elem.person);
    movie.producers = movie.producers.filter(elem => elem.person);
    movie.composers = movie.composers.filter(elem => elem.person);
    movie.cast = movie.cast.filter(elem => elem.person);
}

async function loadCurrMovie(mediaID) {
    const res = await fetch(`http://localhost:3001/media/${mediaID}`, {
        method: "GET",
        credentials: "include"
    });
    const resJson = await res.json();
    if (res.ok && resJson.success) return resJson.data.evals?.[0];
}

async function handleChangeFavorite() {
    let question = isFavorite.value ? "\nNot favorite anymore?\n" : "\nWant to add to favorites?\n";
    if (confirm(question)) {
        const newValue = await changeFavorite(mediaItem.value._id, isFavorite.value);
        isFavorite.value = newValue;

        toast.success(isFavorite.value ? "Added to favorites" : "Not favorite any more");
    }
}

async function handleChangeRating() {
    if (userRating.value.toString() !== newUserRating.value.toString()) {
        let question = `\nDo you really want to change the rating?\n`;
        if (confirm(question)) {
            const newEvalDate = (new Date()).toString();
            await changeRating(mediaItem.value._id, newUserRating.value, newEvalDate);
            toast.success(`Rating was changed from ${userRating.value} to ${newUserRating.value}`);

            userRating.value = newUserRating.value;
            userChangeEvalDate.value = newEvalDate;
        }
    }
}

async function handleDeleteRating() {
    let question = "\nYou're trying to DELETE the rating and the movie from your profile. Are you sure?\n";
    if (confirm(question)) {
        try {
            var delItemName = `"${mediaItem.value.commTitle ? mediaItem.value.commTitle : mediaItem.value.origTitle}" ${mediaItem.value.year ? '(' + mediaItem.value.year + ')' : ''}`;
            await deleteRating(mediaItem.value._id);
            navigateTo("/");
            toast.success(`Rating for ${delItemName} deleted`);
        } catch (err) {
            console.error(err);
            toast.error(`Rating removing failed`);
        }
    }
}
</script>

<style>
.blank-space {
    display: none;
}
</style>