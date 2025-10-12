require("dotenv").config();
const { connect, disconnect, clearDB } = require("./setupTestDB");
const { getTestPersonObj } = require("./setupTestObj");
const { addNewPerson } = require("../services/personService");

beforeAll(async () => {
    process.env.MONGO_URI = "mongodb://fakehost:27017/fakedb";
    await connect();
});
afterEach(async () => { await clearDB(); });
afterAll(async () => { await disconnect(); });

test("adding new Person into 'persons' DB collection", async () => {
    const newTestPerson = getTestPersonObj();
    const resObj = await addNewPerson(newTestPerson);

    expect(resObj.tmdbID).toBe(newTestPerson.tmdbID);
    expect(resObj.imdbID).toBe(newTestPerson.imdbID);
    expect(resObj.name).toBe(newTestPerson.name);
    expect(resObj.birthday).toBe(newTestPerson.birthday);
    expect(resObj.placeOfBirth).toBe(newTestPerson.placeOfBirth);
    expect(resObj.gender).toBe(newTestPerson.gender);
    expect(resObj.photo).toBe(newTestPerson.photo);
    expect(resObj.biography).toBe(newTestPerson.biography);
});
