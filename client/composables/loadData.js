export default function loadData() {
    const userEvaluations = useState("userEvaluations", () => []);

    async function loadEvaluations() {
        const res = await fetch("http://localhost:3001/", {
            method: "GET",
            credentials: "include"
        });
        const resJson = await res.json();
        if (res.ok && resJson.success) return resJson.data.evals;
    }

    async function setEvaluations() {
        try {
            const evals = await loadEvaluations();
            if (evals) {
                userEvaluations.value = evals;
            }
        } catch (err) {
            console.error("Evaluations loading into table failed\n", err)
        }
    }

    return {
        userEvaluations, 
        setEvaluations
    }
}