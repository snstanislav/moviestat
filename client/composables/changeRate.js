export default function changeRate() {

    const isDialogVisible = ref(null);

    function toogleDialog() {
        if (!isDialogVisible.value) isDialogVisible.value = true;
        else isDialogVisible.value = false;
    }

    async function changeFavorite(mediaID, isFavorite) {
        const newState = !isFavorite;
        const res = await fetch(`http://localhost:3001/media/favorite`, {
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

    async function changeRating(mediaID, newUserRating, userChangeEvalDate) {
        const res = await fetch(`http://localhost:3001/media/change`, {
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

    async function deleteRating(mediaID) {
        const res = await fetch(`http://localhost:3001/media/delete`, {
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