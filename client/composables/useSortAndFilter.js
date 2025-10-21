import { SortStatMode } from "./statistics/statisticsGenerator";
import useTabs from "../composables/useTabs";

export default function useSortAndFilter() {
    const { resetTabs } = useTabs();
    
    const currentFilter = useState("currentFilter", () => ({
        filterMode: "", filterValue: ""
    }));

    const currentMovieTableSortMode = useState("currentMovieTableSortMode", () => SortStatMode.EVAL_DATETIME_DESC);
    const currentSortMode = useState("currentSortMode", () => SortStatMode.QUANTITY_DESC);
    const collectionDimension = ref({ count: 0, maxQuantity: 0 });

    function changeCurrentFilter(filterMode, filterValue) {
        console.log("changeCurrentFilter: %s = %s", filterMode, filterValue)
        currentFilter.value.filterMode = filterMode;
        currentFilter.value.filterValue = filterValue;

        resetTabs();
    }

    function clearFilter() {
        currentFilter.value.filterMode = "";
        currentFilter.value.filterValue = "";
    }

    function changeCurrentMovieTableSortMode(sortMode) {
        currentMovieTableSortMode.value = sortMode;
    }

    function changeCurrentSortMode(sortMode) {
        currentSortMode.value = sortMode;
    }

    function showData(value) {
        if (currentSortMode.value.includes('rating')) return value.rating;
        return value.quantity;
    }

    function barWidth(value) {
        let bar = 0
        if (currentSortMode.value.includes('rating')) {
            return value.rating * 8
        }
        if (currentSortMode.value.includes('quantity') || currentSortMode.value.includes('key')) {
            const step = Math.round(collectionDimension.value.count / collectionDimension.value.maxQuantity * 10) / 10;
            for (let i = 1; i <= value.quantity; i += 1) bar += step;
            return bar;
        }
    }

    function addData(value) {
        if (currentSortMode.value.includes('rating')) return value.quantity;
        if (currentSortMode.value.includes('quantity')) return `${value.percent}%`;
        return `(${value.rating})`;
    }

    return {
        currentFilter,
        currentMovieTableSortMode,
        currentSortMode,
        collectionDimension,

        changeCurrentFilter,
        clearFilter,
        changeCurrentMovieTableSortMode,
        changeCurrentSortMode,
        showData,
        barWidth,
        addData
    }
}