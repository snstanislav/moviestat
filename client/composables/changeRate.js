/**
 * @file changeRate.js
 * @description Vue 3 composable for managing user's media evaluations on the client side.
 * Handles toggling dialog visibility, changing favorites, updating ratings, and deleting evaluations.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module composables/changeRate
 */

const config = useRuntimeConfig();

export default function changeRate() {
    /** @type {import('vue').Ref<boolean|null>} - Controls visibility of the rating dialog */
    const isDialogVisible = ref(null);

    /**
     * Toggles the visibility of the rating dialog
     */
    function toogleDialog() {
        if (!isDialogVisible.value) isDialogVisible.value = true;
        else isDialogVisible.value = false;
    }

    /**
     * Changes the "favorite" status of a media item for the current user
     * @async
     * @param {string} mediaID - ID of the media item
     * @param {boolean} isFavorite - Current favorite status
     * @returns {Promise<boolean|undefined>} Returns the new favorite status if successful
     */
    async function changeFavorite(mediaID, isFavorite) {
        const newState = !isFavorite;
        const res = await fetch(`${config.public.apiBase}/media/favorite`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                mediaID,
                isFavorite: newState
            })
        });
        const resJson = await res.json();
        if (res.ok && resJson.success) {
            console.log("isFavourite successfully changed!");
            return newState;
        }
    }

    /**
     * Updates the user's rating for a media item
     * @async
     * @param {string} mediaID - ID of the media item
     * @param {number} newUserRating - New rating value
     * @param {string} userChangeEvalDate - Date of evaluation change
     */
    async function changeRating(mediaID, newUserRating, userChangeEvalDate) {
        const res = await fetch(`${config.public.apiBase}/media/change`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                mediaID,
                newUserRating,
                userChangeEvalDate
            })
        });
        const resJson = await res.json();
        if (res.ok && resJson.success) {
            console.log("Your evaluation successfully changed!");
            isDialogVisible.value = false;
        }
    }

    /**
     * Deletes a user's evaluation for a media item
     * @async
     * @param {string} mediaID - ID of the media item
     * @returns {Promise<Object|undefined>} Returns server response if successful
     */
    async function deleteRating(mediaID) {
        const res = await fetch(`${config.public.apiBase}/media/delete`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ mediaID })
        });
        const resJson = await res.json();
        if (res.ok && resJson.success) {
            return resJson;
        }
    }

    return {
        isDialogVisible,
        toogleDialog,
        changeFavorite,
        changeRating,
        deleteRating
    }
}