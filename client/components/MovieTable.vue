<template>
    <div class="content-section">

        <div v-if="userEvaluations && userEvaluations.length > 0" class="table-container">
            <div>
                <MovieTableRow v-for="(item, index) in userEvaluations" :key="item.movie._id" :index="index"
                    :item="item" />
            </div>
        </div>

    </div>
</template>

<script setup>
import MovieTableRow from "./MovieTableRow.vue";
const { userEvaluations } = defineProps(['userEvaluations']);

</script>