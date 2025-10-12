<template>
    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <div v-if="!userProfileData" class="login-wrapper">
            <h2>Sign in to continue</h2>
            <input v-model="login" type="text" width="10" placeholder="Login" required></input>
            <input v-model="password" type="password" width="10" placeholder="Password" required></input>
            <button @click="handleSignin">Sign in</button>
            <p class="message">{{ message }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useAuth from "../composables/useAuth";
const { signin, userProfileData, message } = useAuth();

const login = ref("");
const password = ref("");
const isReady = ref(false);

onMounted(async () => {
    isReady.value = true;
});

async function handleSignin() {
    await signin(login.value, password.value);
    console.log("userProfileData")
    console.log(userProfileData.value)
}
</script>