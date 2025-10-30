/**
 * @file loadData.js
 * @description Vue 3 composable for fetching and storing the current user's evaluated movies.
 * Provides reactive state and a method to load evaluations from the backend.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module composables/loadData
 */

const config = useRuntimeConfig();

export default function loadData() {
    /**
     * Reactive state holding the user's evaluations
     * @type {import('vue').Ref<Array<Object>>}
     */
    const userEvaluations = useState("userEvaluations", () => []);

    /**
     * Fetches the list of evaluated movies for the logged-in user from the backend
     * @async
     * @returns {Promise<Array<Object>|undefined>} Array of evaluation objects, or undefined on failure
     */
    async function loadEvaluations() {
        const res = await fetch(`${config.public.apiBase}/`, {
            method: "GET",
            credentials: "include"
        });
        const resJson = await res.json();
        if (res.ok && resJson.success) return resJson.data.evals;
    }

    /**
     * Loads evaluations and updates the reactive `userEvaluations` state
     * @async
     */
    async function setEvaluations() {
        try {
            const evals = await loadEvaluations();
            if (evals) {
                userEvaluations.value = evals;
            }
        } catch (err) {
            console.error("Evaluations loading into table failed\n", err)
        }
    }

    return {
        userEvaluations, 
        setEvaluations
    }
}