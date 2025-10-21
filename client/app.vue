<template>
  <div id="app">
    <header id="main-header">
      <div id="main-logo">
        <NuxtLink :to="`/`">
          <img src="/main-logo.png" alt="Website logo">
        </NuxtLink>
      </div>

      <div v-if="userProfileData" id="auth-wrapper">
        <details id="user-profile">

          <summary title="Your profile">
            <img src="/person-blank.png" alt="Profile toogle" width="50" height="50">
          </summary>

          <div id="user-credentials">
            <span v-if="userProfileData.login">Login: <span class="user-data">{{ userProfileData.login }}</span></span>
            <span v-if="userProfileData.fullName">Name: <span class="user-data">{{ userProfileData.fullName }}</span></span>
            <span v-if="userProfileData.email" class="user-data">{{ userProfileData.email }}</span>

            <div class="signout-wrapper">
              <a @click="signout" class="signout">Sign out</a>
            </div>
          </div>
        </details>
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