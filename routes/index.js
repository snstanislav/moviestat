//modules
const express = require(process.env.NODE_PATH+'/express');
const statisticsGenerator = require('../models/statisticsGenerator.js');
const yearManager = require('../models/yearManager.js');
const genreManager = require('../models/genreManager.js');
const countryManager = require('../models/countryManager.js');
const personManager = require('../models/personManager.js');
const movieManager = require('../models/movieManager.js');
const rateManager = require('../models/rateManager.js');


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


router.get("/", (req, res)=> {

  for (const [key, value] of Object.entries(req.query)) {
    console.log(`${key}: ${value}`);
    paramsMap.set(key, value);
  }

  res.render('index', {
    title: "User's movie statistics",
    SortMode: SortStatMode,
    FilmMode: FilmStatMode,
    currentFilter: {
      mode: paramsMap.get("filtermode"), 
      value: paramsMap.get("filtervalue")
    },
    yearStat: yearManager.getYearStat(paramsMap.get("sortyear")),
    sortyearmode: paramsMap.get("sortyear"),
    decadeStat: yearManager.composeDecadeStat(paramsMap.get("sortdecade")),
    sortdecademode: paramsMap.get("sortdecade"),
    genreStat: genreManager.getGenreStat(paramsMap.get("sortgenre")),
    sortgenremode: paramsMap.get("sortgenre"),
    countryStat: countryManager.getCountryStat(paramsMap.get("sortcountry")),
    sortcountrymode: paramsMap.get("sortcountry"),
    actorStat: personManager.getActorStat(paramsMap.get("sortactor")),
    sortactormode: paramsMap.get("sortactor"),
    directorStat: personManager.getDirectorStat(paramsMap.get("sortdirector")),
    sortdirectormode: paramsMap.get("sortdirector"),
    movieStat: movieManager.getMovieStat(paramsMap.get("sortmovie"), paramsMap.get("filtermode"), paramsMap.get("filtervalue")),
    sortmoviemode: paramsMap.get("sortmovie")
  });
  console.log("Router: index");
});

router.post("/index/:id",
  (req, res)=> {
    let openedFilm = movieManager.getMovie(req.params['id']);
    console.log(req.body)
    console.log(openedFilm.commTitle)
    if (req.params['id']) {
      if (req.body.favorite && openedFilm.favorite != req.body.favorite) {
        openedFilm.favorite = req.body.favorite == "true" ? true: false;
      }
      if (req.body.personalRating && openedFilm.pRating != req.body.personalRating) {
        openedFilm.pRating = req.body.personalRating;
      }
      movieManager.changeUserEval(openedFilm);
      res.redirect("/");
    }
  });

module.exports = router;