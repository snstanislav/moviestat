const { constructMovieFromAPIs } = require("../api/apiManager");
const fs = require("fs");

require("dotenv").config();

beforeAll(() => { process.env.MONGO_URI = "mongodb://fakehost:27017/fakedb"; });

test("composing complete Movie item from API (TMDB, OMDB)", async () => {
   /* const testItem = JSON.parse(fs.readFileSync("./tests/testMovie.json"));
    const testID = "49047";
    const testMediaType = "movie";
*/
    const testItem = JSON.parse(fs.readFileSync("./tests/testTV.json"));
    const testID = "4087";
    const testMediaType = "tv";

    const testDate = (new Date()).toString();
    testItem.userEvalDate = testDate;

    const resultMovieItem = await constructMovieFromAPIs(
        testID,  // test optional
        testMediaType,  // test optional
        8, testDate);

    expect(testItem.type).toBe(resultMovieItem.type);
    expect(testItem.tmdbID.toString()).toBe(resultMovieItem.tmdbID.toString());
    expect(testItem.imdbID).toBe(resultMovieItem.imdbID);
    expect(testItem.imdbRating).toBe(resultMovieItem.imdbRating);
    expect(Number.parseInt(testItem.imdbVotes.replace(",", ""))
        <= Number.parseInt(resultMovieItem.imdbVotes.replace(",", ""))).toBe(true);
    expect(testItem.commTitle).toBe(resultMovieItem.commTitle);
    expect(testItem.origTitle).toBe(resultMovieItem.origTitle);
    expect(testItem.year).toBe(resultMovieItem.year);
    expect(testItem.duration).toBe(resultMovieItem.duration);
    expect(testItem.parental).toBe(resultMovieItem.parental);
    expect(testItem.plot).toBe(resultMovieItem.plot);
    expect(testItem.poster).toBe(resultMovieItem.poster);
    expect(testItem.budget).toBe(resultMovieItem.budget);
    expect(testItem.boxOffice).toBe(resultMovieItem.boxOffice);

    expect(testItem.userRating).toBe(resultMovieItem.userRating);
    expect(testItem.userEvalDate).toBe(resultMovieItem.userEvalDate);
    expect(testItem.userChangeEvalDate).toBe(resultMovieItem.userChangeEvalDate);
    expect(testItem.false).toBe(resultMovieItem.false);

    expect(testItem.directors.length).toBe(resultMovieItem.directors.length);
    expect(comparePersonList(testItem.directors, resultMovieItem.directors)).toBe(true);

    expect(testItem.writers.length).toBe(resultMovieItem.writers.length);
    expect(comparePersonList(testItem.writers, resultMovieItem.writers)).toBe(true);

    expect(testItem.producers.length).toBe(resultMovieItem.producers.length);
    expect(comparePersonList(testItem.producers, resultMovieItem.producers)).toBe(true);

    expect(testItem.composers.length).toBe(resultMovieItem.composers.length);
    expect(comparePersonList(testItem.composers, resultMovieItem.composers)).toBe(true);

    expect(testItem.cast.length).toBe(resultMovieItem.cast.length);
    expect(comparePersonList(testItem.cast, resultMovieItem.cast)).toBe(true);

    function comparePersonList(test, result) {
        if (test.length === 0 && result.length === 0) return true;
        for (let i = 0; i < test.length; i++) {
            return test.tmdbID === result.tmdbID
                && test.imdbID === result.tmdbID
                && test.name === result.name
                && test.birthday === result.birthday
                && test.placeOfBirth === result.placeOfBirth
                && test.gender === result.gender
                && test.photo === result.photo
                && test.biography === result.biography;
        }
    }
});