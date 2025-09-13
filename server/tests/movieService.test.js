const { connect, disconnect, clearDB } = require("./setupTestDB");
const { findMovie } = require("../services/movieService");

require("dotenv").config();

beforeAll(async () => {
    process.env.MONGO_URI = "mongodb://fakehost:27017/fakedb";
    await connect();
});
afterEach(async () => { await clearDB(); });
afterAll(async () => { await disconnect(); });

test("searching a Movie", async () => {
    const res = await findMovie("x files", 1);

    expect(res.totalResults).toBe(29);
    expect(res.totalPages).toBe(2);
    expect(res.currentPage).toBe(1);
    expect(res.results.length > 0).toBe(true);

    expect(res.results.some(
        elem => elem.tmdbID === 4087
            && elem.type === "tv"
            && elem.year === "1993")).toBe(true);
});