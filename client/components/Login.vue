<template>
    <div v-if="!isReady">Loading...</div>
    <div v-else>
        <form v-if="!userProfileData" @submit.prevent="handleSignin" class="auth-wrapper">
            <h2>Sign in to continue</h2>
            <input v-model="login" type="text" width="10" placeholder="Login*" required></input>
            <input v-model="password" type="password" width="10" placeholder="Password*" required></input>
            <button type="submit">Sign in</button>
            <p class="message">{{ message }}</p>
            <div>
                <a href="/signup">Have no account yet? Sign up</a>
            </div>
        </form>
    </div>
</template>

<script setup>
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
}
</script>