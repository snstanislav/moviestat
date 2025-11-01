/**
 * @file useAuth.js
 * @description Vue 3 composable for managing user authentication on the client side.
 * Provides signin, signup, signout, and user profile state management.
 * @author Stanislav Snisar
 * @version 1.0.0
 * @module composables/useAuth
 */

export default function useAuth() {
    const config = useRuntimeConfig();

    /**
    * Reactive state holding the current user's profile data
    */
    const userProfileData = useState("userProfileData", () => null);

    /**
     * Reactive state holding messages for login/signup errors
     */
    const message = useState("message", () => "");

    /**
     * Performs user signin
     * @async
     * @param {string} login - User login
     * @param {string} password - User password
     */
    async function signin(login, password) {
        try {
            if (login && password) {
                const res = await fetch(`${config.public.apiBase}/auth/signin`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ login, password })
                });
                const resJson = await res.json();

                if (res.ok && resJson.success) {
                    await setProfileData();
                    //await setEvaluations();
                } else {
                    message.value = "Authorization faild."
                }
            } else {
                message.value = "*All fields are required!"
            }
        } catch (err) {
            console.error("Fetch error:", err);
            message.value = "Authentication failed";
        }
    }

    /**
    * Signs out the current user and clears profile data
    * @async
    */
    async function signout() {
        await fetch(`${config.public.apiBase}/auth/signout`, {
            method: "POST",
            credentials: "include"
        });
        userProfileData.value = null;
        message.value = "";
        //localStorage.clear()
    }

    /**
    * Performs user signup
    * @async
    * @param {string} login - Desired login
    * @param {string} fullName - Full name of the user
    * @param {string} email - User email
    * @param {string} password - User password
    * @returns {Promise<Object|undefined>} Response JSON from the server
    */
    async function signup(login, fullName, email, password) {
        try {
            if (login && password) {
                const res = await fetch(`${config.public.apiBase}/auth/signup`, {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ login, fullName, email, password })
                });
                const resJson = await res.json();

                if (res.ok) {
                    console.log("useAuth:" + resJson.message)
                    return resJson;
                }
            } else {
                message.value = "*All fields are required!"
            }
        } catch (err) {
            console.error("Fetch error:", err);
            message.value = "Authentication failed";
        }
    }

    /**
    * Loads the authenticated user's profile from the backend
    * @async
    * @returns {Promise<Object|undefined>} User profile JSON if successful
    */
    async function loadProfile() {
        console.log(`API BASE: ${config.public.apiBase}/auth/profile`)
        const res = await fetch(`${config.public.apiBase}/auth/profile`, {
            method: "GET",
            credentials: "include"
        });
        const resJson = await res.json()
        if (res.ok && resJson.success) return resJson;
    }

    /**
    * Sets the reactive `userProfileData` state using data fetched from the backend
    * @async
    */
    async function setProfileData() {
        const profile = await loadProfile();
        console.log(profile)
        if (profile) {
            userProfileData.value = profile.user;
        }
    }

    return {
        signin,
        signout,
        signup,
        setProfileData,
        userProfileData,
        message
    }

}