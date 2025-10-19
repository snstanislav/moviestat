<template>
    <nav class="sort-bar">
        <span class="sort-label">Sort by: </span>
        <span v-for="(sortOpt, index) in sortOptions">
            <a :key="sortOpt.key" @click="changeCurrentSortMode(sortOpt.key); activeSortMode = sortOpt"
                :class="['sort-item', sortOpt.key === activeSortMode.key ? 'sort-item-selected' : '']">
                {{ sortOpt.label }}
            </a>{{ index < sortOptions.length - 1 ? "|" : "" }} </span>
    </nav>
</template>

<script setup>
import { SortStatMode } from "../../../composables/statistics/statisticsGenerator";
import useSort from "../../../composables/useSort";
const { changeCurrentSortMode } = useSort();

const sortOptions = [
    { key: SortStatMode.QUANTITY_DESC, label: "Quantity down" },
    { key: SortStatMode.QUANTITY_ASC, label: "Quantity up" },
    { key: SortStatMode.RATING_DESC, label: "Rating down" },
    { key: SortStatMode.RATING_ASC, label: "Rating up" },
    { key: SortStatMode.KEY_ASC, label: "A-Z (0-9)" },
    { key: SortStatMode.KEY_DESC, label: "Z-A (9-0)" }
];
const activeSortMode = useState("activeSortMode", () => sortOptions[0]);
</script>