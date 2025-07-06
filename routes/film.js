//modules
//const express = require(process.env.NODE_PATH+'/express');
const express = require('express');
const statisticsGenerator = require('../models/statisticsGenerator.js');
const movieManager = require('../models/movieManager.js');
const rateManager = require('../models/rateManager.js');
const dp = require('../data/dataProvider.js');

const router = express.Router();

let openedFilm = undefined;

// show
router.get("/film/:id", (req, res)=> {
  if (dp.dbCache) {
    console.log("\nfilm >> loaded from [dbCache] - %s\n", dp.dbCache.length);
    render(req, res, dp.dbCache);
  } else {
    dp.initGeneralUserMovieList((db)=> {
      render(req, res, db);
      console.log("\nfilm >> extracted from database - %s\n", db.length);
      dp.dbCache = db;
    });
  }
});

function render(req, res, db) {
  openedFilm = movieManager.getMovie(db,
    req.params['id']);
  if (openedFilm) {
    res.render('film', {
      title: "Film's user statistics",
      movieItem: openedFilm,
      extractId: statisticsGenerator.extractIdFromLinkIMDB
    });
  } else {
    res.render('error', {
      title: "404 Page not found",
      errHead: "404 Movie not found",
      errMsg: "This movie does not exist in database",
      id: undefined
    });
  }
}

// change
router.post("/film/:id", (req, res)=> {
  console.log(req.body)
  console.log(req.params)
  if (openedFilm && req.params['id']) {
    if (req.body.favorite && openedFilm.favorite != req.body.favorite) {
      openedFilm.favorite = req.body.favorite == "true" ? true: false;
    }
    if (req.body.personalRating && openedFilm.pRating != req.body.personalRating) {
      openedFilm.pRating = req.body.personalRating;
    }
    movieManager.changeUserEval(openedFilm, () => {
      res.redirect("/film/"+req.params['id']);
    });
  } else {
    res.redirect("/film/"+req.params['id']);
  }
});

// add
router.post("/film/", (req, res)=> {
  const id = statisticsGenerator.extractIdFromLinkIMDB(req.body.filmLink)

  if (req.body.filmLink != undefined && req.body.personalRating != undefined) {
    rateManager.rateMovie(req.body.filmLink, req.body.personalRating, () => {
      res.render('success', {
        title: "Success",
        sssHead: "Done",
        sssMsg: "Movie added successfully!",
        id: id
      });
    }, () => {
      res.render('error', {
        title: "error",
        errHead: "Rejected",
        errMsg: "Movie already exists in the database...",
        id: id
      });
    });
  }
});

// remove
router.post("/film/delete/:id", (req, res)=> {
  movieManager.removeMovie(req.params['id'], () => {
    res.render('success', {
      title: "Ok",
      sssHead: "Done",
      sssMsg: "Movie removed from database.",
      id: undefined
    });
  }, () => {
    res.render('error', {
      title: "error",
      errHead: "Error",
      errMsg: "Movie removing failture...",
      id: req.params['id']
    });
  });
});

module.exports = router;