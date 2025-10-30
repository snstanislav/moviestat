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
            <form class="auth-wrapper" @submit.prevent="handleSignup">
                <h2>Create An Account</h2>
                <input v-model="login" type="text" width="10" placeholder="Login*" required />
                <input v-model="fullName" type="text" width="10" placeholder="Full name" />
                <input v-model="email" type="text" width="10" placeholder="Email*" required />
                <input v-model="password" type="password" width="10" placeholder="Password*" required />
                <button type="submit">Sign in</button>
                <p class="message">{{ message }}</p>
            </form>
        </div>
    </div>
</template>

<script setup>
import useAuth from "../composables/useAuth";
const { signup, userProfileData, message } = useAuth();
const toast = await useSafeToast();

const login = ref("");
const fullName = ref("");
const email = ref("");
const password = ref("");
const isReady = ref(false);

onMounted(async () => {
    isReady.value = true;
});

async function handleSignup() {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if (!emailPattern.test(email.value)) {
        message.value = "Invalid email format.";
        return;
    }

    if (!login.value || !email.value || !password.value) {
        message.value = "Login, E-mail and Password required"
    } else {
        const result = await signup(login.value, fullName.value, email.value, password.value);

        if (result && result.success) {
            console.log("SignUp client page: " + result.message);

            navigateTo("/");
            toast.success(result.message);
            resetForm();
        } else {
            message.value = result.message;
            toast.error("Registration failed");
        }
    }
}

function resetForm() {
    message.value = "";

    login.value = "";
    fullName.value = "";
    email.value = "";
    password.value = "";
}
</script>

<style>
.sectiom {
    border-radius: 10px;
}
</style>