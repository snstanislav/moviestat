import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
    console.log("Toast plugin loaded!");
    nuxtApp.vueApp.use(Toast, {
        position: "top-center",
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        transition: "Vue-Toastification__fade",
    });
});