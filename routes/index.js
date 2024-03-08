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

let yearSortMode = SortStatMode.KEY_DESC;
let decadeSortMode = SortStatMode.KEY_DESC;
let genreSortMode = SortStatMode.QUANTITY_DESC;
let countrySortMode = SortStatMode.QUANTITY_DESC;
let actorSortMode = SortStatMode.RATING_DESC;
let directorSortMode = SortStatMode.RATING_DESC;
let movieSortMode = SortStatMode.EVAL_DATETIME_DESC;

router.get("/", (req, res)=> {
  req.params['sortmode'] = SortStatMode.QUANTITY_DESC

  console.log(req.params['sortmode'])
  res.render('index', {
    title: "User's movie statistics",
    SortMode: SortStatMode,
    yearStat: yearManager.getYearStat(yearSortMode),
    decadeStat: yearManager.composeDecadeStat(decadeSortMode),
    genreStat: genreManager.getGenreStat(genreSortMode),
    countryStat: countryManager.getCountryStat(countrySortMode),
    actorStat: personManager.getActorStat(actorSortMode),
    directorStat: personManager.getDirectorStat(directorSortMode),
    movieStat: movieManager.getMovieStat(movieSortMode)
  });
  console.log("Router: index");
});

router.get("/index", (req, res)=> {
  if (req.query.filmLink != undefined && req.query.personalRating != undefined) {
    rateManager.rateMovie(req.query.filmLink, req.query.personalRating);
    res.redirect('/');
  }
});
/*
router.update("/:id", (req, res)=> {});

router.update("/index/:id", (req, res)=> {});
*/

module.exports = router;