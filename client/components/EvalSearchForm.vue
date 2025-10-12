<template>
    <div class="section search-form-wrapper">
        <h1 class="search-head">Find and rate a film</h1>
        <div class="search-bar">
            <input v-model="inputText" type="text" name="search" placeholder="Type a title..." required></input>
            <button @click="sendSearchQuery">Let's try</button>
        </div>
    </div>
</template>

<script setup>

const { currentSearch } = defineProps({
    currentSearch: {
        type: String,
        required: false,
        default: ""
    }
}
);
const router = useRouter();
const inputText = ref(currentSearch);

async function sendSearchQuery() {
    if (validate()) {
        console.log("sendSearchQuery :: validated") //
        router.push({ path: "/eval", query: { search: inputText.value } });
    }
}
function validate() {
    inputText.value = inputText.value.toLowerCase().trimEnd();

    let inputRGEX = /[a-zA-Zа-яА-Яі0-9-.\&]$/gi;
    if (inputRGEX.test(inputText.value)) return true;
    return false;
}

</script>