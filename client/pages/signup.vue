<template>
    <div v-if="!isReady" class="loader-wrapper">
        <span class="loader"></span>
    </div>
    <div v-else>
        <div v-if="userProfileData" class="section">

            <div class="empty-result">
                You are already logged in.
            </div>
        </div>
        <div v-else>
            <div class="login-wrapper">
                <h2>Create An Account</h2>
                <input v-model="login" type="text" width="10" placeholder="Login" required></input>
                <input v-model="fullName" type="text" width="10" placeholder="Full name"></input>
                <input v-model="email" type="text" width="10" placeholder="Email"></input>
                <input v-model="password" type="password" width="10" placeholder="Password" required></input>
                <button @click="handleSignup">Sign in</button>
                <p class="message">{{ message }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useAuth from "../composables/useAuth";
const { signup, userProfileData, message } = useAuth();

const login = ref("");
const fullName = ref("");
const email = ref("");
const password = ref("");
const isReady = ref(false);

onMounted(async () => {
    isReady.value = true;
});

async function handleSignup() {
    if (!login.value || !email.value || !password.value) {
        message.value = "Login, E-mail and Password required"
    } else {
        const result = await signup(login.value, fullName.value, email.value, password.value);
        console.log(result)
        if (result && result.success) {
            console.log("SignUp client page: " + result.message);
            message.value = "";
            navigateTo("/");
        } else {
            message.value = result.message;
        }
    }
}
</script>

<style>
.sectiom {
    border-radius: 10px;
}
</style>