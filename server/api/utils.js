
async function fetchWithRetry(url, options, retries = 3, delay = 500) {
    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(url, options);
            if (res.ok) {
                //console.log(`Fetching for #${url} at retry #${i} was successful!\n`)
                return await res.json();
            } else {
                throw new Error(`Fetching error: HTTP ${res.status} at retry #${i+1}...\n`);
            }
        } catch (error) {
            if (i === retries) throw error;
            //console.warn(`Fetching failed for #${url} at retry #${i+1}...\n`)
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}
module.exports.fetchWithRetry = fetchWithRetry;