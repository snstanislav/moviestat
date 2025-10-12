require("dotenv").config();
const { connect, disconnect, clearDB } = require("./setupTestDB");
const { getTestUserObj } = require("./setupTestObj");
const { addNewUser } = require("../services/userService");

beforeAll(async () => {
    process.env.MONGO_URI = "mongodb://fakehost:27017/fakedb";
    await connect();
});
afterEach(async () => { await clearDB(); });
afterAll(async () => { await disconnect(); });

test("adding new User into 'users' DB collection", async () => {
    const newTestUser = getTestUserObj();
    const resObj = await addNewUser(newTestUser);

    expect(resObj.email).toBe(newTestUser.email);
    expect(resObj.login).toBe(newTestUser.login);
    expect(await resObj.comparePassword(newTestUser.password)).toBe(true);
    expect(resObj.fullName).toBe(newTestUser.fullName);
    expect(resObj.role).toBe(newTestUser.role);
    expect(JSON.stringify(resObj.evals)).toBe(JSON.stringify(newTestUser.evals));
    expect(resObj.evals.length).toBe(newTestUser.evals.length);
});