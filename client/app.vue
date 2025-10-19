<template>
  <div id="app">
    <header id="main-header">
      <div id="main-logo">
        <NuxtLink :to="`/`">
          <img src="/main-logo.png" alt="Website logo">
        </NuxtLink>
      </div>

      <div id="auth-wrapper">
        <div v-if="userProfileData" id="user-credentials">
          {{ userProfileData.login }} ({{ userProfileData.fullName }}) <br />{{ userProfileData.email }}
        </div>

        <div v-if="userProfileData">
          <!--<button @click="setProfileData">Profile</button>-->
          <a @click="signout" class="signout">Sign out</a>
        </div>
      </div>
    </header>

    <main id="page-content">
      <NuxtPage />
    </main>

    <footer id="main-footer">
      <img src="/tmdb-logo.png" alt="TMDB logo" />
      <p>Moviestat &copy; 2024-2025</p>
      <img src="/omdb-logo.png" alt="OMDB logo" />
    </footer>
  </div>
</template>

<script setup>
import useAuth from "./composables/useAuth";
const { signout, setProfileData, userProfileData } = useAuth();

onMounted(async () => {
  await setProfileData();
});
</script>