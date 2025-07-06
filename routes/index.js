//modules
//const express = require(process.env.NODE_PATH+'/express');
const express = require('express');
const statisticsGenerator = require('../models/statisticsGenerator.js');
const yearManager = require('../models/yearManager.js');
const genreManager = require('../models/genreManager.js');
const countryManager = require('../models/countryManager.js');
const personManager = require('../models/personManager.js');
const movieManager = require('../models/movieManager.js');
const rateManager = require('../models/rateManager.js');
const dp = require('../data/dataProvider.js');

// enumerators
const FilmStatMode = statisticsGenerator.FilmStatMode;
const SortStatMode = statisticsGenerator.SortStatMode;

const router = express.Router();

let paramsMap = new Map();
/* Initial sorting parameters */
paramsMap.set("sortyear", SortStatMode.KEY_DESC)
paramsMap.set("sortdecade", SortStatMode.KEY_DESC)
paramsMap.set("sortgenre", SortStatMode.QUANTITY_DESC)
paramsMap.set("sortcountry", SortStatMode.QUANTITY_DESC)
paramsMap.set("sortactor", SortStatMode.RATING_DESC)
paramsMap.set("sortdirector", SortStatMode.RATING_DESC)
paramsMap.set("sortmovie", SortStatMode.EVAL_DATETIME_DESC)

// load main page
router.get("/", (req, res)=> {
  for (const [key, value] of Object.entries(req.query)) {
    console.log(`${key}: ${value}`);
    paramsMap.set(key, value);
  }
  if (dp.dbCache) {
    console.log("\nindex >> loaded from [dbCache] - %s\n", dp.dbCache.length);
    render(req, res, dp.dbCache);
  } else {
    dp.initGeneralUserMovieList((db)=> {
      render(req, res, db);
      console.log("\nindex >> extracted from database - %s\n", db.length);
      dp.dbCache = db;
    });
  }
});

function render(req, res, db) {
  res.render('index',
    {
      title: "User's movie statistics",
      SortMode: SortStatMode,
      FilmMode: FilmStatMode,
      currentFilter: {
        mode: paramsMap.get("filtermode"),
        value: paramsMap.get("filtervalue")
      },
      yearStat: yearManager.getYearStat(db,
        paramsMap.get("sortyear")),
      decadeStat: yearManager.composeDecadeStat(db,
        paramsMap.get("sortdecade")),
      genreStat: genreManager.getGenreStat(db,
        paramsMap.get("sortgenre")),
      countryStat: countryManager.getCountryStat(db,
        paramsMap.get("sortcountry")),
      actorStat: personManager.getActorStat(db,
        paramsMap.get("sortactor")),
      directorStat: personManager.getDirectorStat(db,
        paramsMap.get("sortdirector")),
     movieStat: movieManager.getMovieStat(db,
        paramsMap.get("sortmovie"),
        paramsMap.get("filtermode"),
        paramsMap.get("filtervalue")),
     /* new Map([...(movieManager.getMovieStat(db, paramsMap.get("sortmovie"),
        paramsMap.get("filtermode"),
        paramsMap.get("filtervalue")))
        .entries()].filter(elem => statisticsGenerator.formatDT(elem[1].pDateTime) >
        statisticsGenerator.formatDT("01.02.2024, 00:00"))),*/
      ////
      sortyearmode: paramsMap.get("sortyear"),
      sortdecademode: paramsMap.get("sortdecade"),
      sortgenremode: paramsMap.get("sortgenre"),
      sortcountrymode: paramsMap.get("sortcountry"),
      sortactormode: paramsMap.get("sortactor"),
      sortdirectormode: paramsMap.get("sortdirector"),
      sortmoviemode: paramsMap.get("sortmovie")
    });
  console.log("Router: index");
}

// change
router.post("/index/:id", (req, res)=> {
  let currentFilm = movieManager.getMovie(dp.dbCache, req.params['id']);
  console.log(req.body)
  if (currentFilm && req.params['id']) {
    if (req.body.favorite && currentFilm.favorite != req.body.favorite) {
      currentFilm.favorite = req.body.favorite == "true" ? true: false;
    }
    if (req.body.personalRating && currentFilm.pRating != req.body.personalRating) {
      currentFilm.pRating = req.body.personalRating;
    }
    movieManager.changeUserEval(currentFilm, () => {
      res.redirect("/");
    });
  }
});

module.exports = router;