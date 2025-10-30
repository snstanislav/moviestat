/**
 * @file useTabs.js
 * @description Vue 3 composable for managing tab components in the UI.
 * Provides reactive state for the active tab and utility functions for resetting tabs.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module composables/useTabs
 */

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

export default function useTabs() {
    /**
     * Array of tab objects containing component references and labels
     * @type {Array<{name: string, component: any, label: string}>}
     */
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

    /**
     * Reactive state for the currently active tab name
     * @type {import('vue').Ref<string>}
     */
    const activeTabName = useState("activeTabName", () => tabs[0].name);

    /**
     * Computed property returning the active tab object
     * @type {import('vue').ComputedRef<{name: string, component: any, label: string} | undefined>}
     */
    const activeTab = computed(() => tabs.find(elem => elem.name === activeTabName.value));

    /**
     * Resets the active tab to the first tab in the list
     */
    function resetTabs() {
        activeTabName.value = tabs[0].name;
    }

    return {
        tabs,
        activeTabName,
        activeTab,
        resetTabs
    }
}