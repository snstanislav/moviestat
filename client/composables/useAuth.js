export default function useAuth() {

    const userProfileData = useState("userProfileData", () => null);
    const message = useState("message", () => "");

    async function signin(login, password) {
        try {
            if (login && password) {
                const res = await fetch("http://localhost:3001/auth/signin", {
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

    async function signout() {
        await fetch("http://localhost:3001/auth/signout", {
            method: "POST",
            credentials: "include"
        });
        userProfileData.value = null;
        message.value = "";
        //localStorage.clear()
    }


    async function signup(login, fullName, email, password) {
        try {
            if (login && password) {
                const res = await fetch("http://localhost:3001/auth/signup", {
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


    async function loadProfile() {
        const res = await fetch("http://localhost:3001/auth/profile", {
            method: "GET",
            credentials: "include"
        });
        const resJson = await res.json()
        if (res.ok && resJson.success) return resJson;
    }

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