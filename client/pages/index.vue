<template>
    <div v-if="!isReady" class="loader-wrapper">
        <span class="loader"></span>
    </div>
    <div v-else>
        <div v-if="userProfileData">
            <!-- SEARCH BAR -->
            <EvalSearchForm :currentSearch="currentSearch" />
            <br><br>

            <!-- MAIN CONTENT -->
            <div class="section">
                <!-- TAB BAR -->
                <nav class="tab-bar">
                    <span>Category: </span>
                    <button v-for="tab in tabs" :key="tab.name" @click="activeTabName = tab.name"
                        :class="['tab-button', activeTabName === tab.name ? 'tab-button-selected' : '']">
                        {{ tab.label }}
                    </button>

                </nav>
                <KeepAlive>
                    <div v-if="pending" class="loader-wrapper loader-wrapper-inner">
                        <span class="loader"></span>
                    </div>
                    <component v-else-if="userEvaluations" :is="activeTab.component" :key="activeTab.name"
                        :userEvaluations="userEvaluations" />
                </KeepAlive>
            </div>
        </div>

        <div v-else>
            <component :is="loginComponent" :key="'media'" />
        </div>
    </div>
</template>

<script setup>
import Login from "~/components/Login.vue";

import EvalSearchForm from "../components/EvalSearchForm.vue";
import useAuth from "../composables/useAuth";
const { userProfileData } = useAuth();

import loadData from "../composables/loadData";
const { pending, userEvaluations, setEvaluations } = loadData();

import useTabs from "../composables/useTabs";
const { tabs, activeTabName, activeTab } = useTabs();

const currentSearch = ref(""); // filler
const isReady = ref(false);
const loginComponent = shallowRef(null);

onMounted(async () => {
    isReady.value = true;
    await setEvaluations();

    if (!userProfileData.value) {
        loginComponent.value = Login;
    }
});

watch(activeTab, () => {
    console.log(`Active tab: ${activeTab.value}`)
});

watch(userProfileData, async (val) => {
    if (val) {
        await setEvaluations();
    }
    if (!userProfileData.value) {
        loginComponent.value = Login;
    }
});
</script>