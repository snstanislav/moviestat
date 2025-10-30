/**
 * Performs a fetch request with automatic retry logic on failure.
 * The function returns the parsed JSON response if successful. If all retries fail,
 * it throws the last encountered error.
 *
 * @async
 * @function fetchWithRetry
 * @param {string} url - The endpoint to fetch.
 * @param {RequestInit} options - Fetch configuration options (method, headers, etc.).
 * @param {number} [retries=3] - Maximum number of retry attempts before failing.
 * @param {number} [delay=500] - Initial delay in milliseconds between retries. Delay increases linearly with each attempt.
 * @returns {Promise<any>} Resolves with the parsed JSON response from the server.
 * @throws {Error} Throws if all retry attempts fail or if the response status is not OK.
 */
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
        } catch (err) {
            if (i === retries) throw err;
            //console.warn(`Fetching failed for #${url} at retry #${i+1}...\n`)
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
}
module.exports.fetchWithRetry = fetchWithRetry;