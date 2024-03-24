//modules
const express = require(process.env.NODE_PATH+'/express');
const statisticsGenerator = require('../models/statisticsGenerator.js');
const movieManager = require('../models/movieManager.js');
const rateManager = require('../models/rateManager.js');

const router = express.Router();

let openedFilm = undefined;

router.get("/film/:id", (req, res)=> {
  openedFilm = movieManager.getMovie(req.params['id']);

  if (openedFilm) {
    res.render('film', {
      title: "Film's user statistics",
      movieItem: openedFilm,
      extractId: statisticsGenerator.extractIdFromLinkIMDB
    });
    console.log("Router: film profile page loaded");
  } else {
    res.render('error', {
      title: "404 Page not found",
      errHead: "404 Page not found",
      errMsg: "This movie does not exist in database"
    });
  }
});

router.post("/film/:id", (req, res)=> {
  console.log(req.body)
  console.log(req.params)

  if (req.params['id']) {
    if (req.body.favorite && openedFilm.favorite != req.body.favorite) {
      openedFilm.favorite = req.body.favorite == "true" ? true: false;
    }
    if (req.body.personalRating && openedFilm.pRating != req.body.personalRating) {
      openedFilm.pRating = req.body.personalRating;
    }
    movieManager.changeUserEval(openedFilm);
    res.redirect("/film/"+req.params['id']);
  }
});

router.post("/film/", (req, res)=> {
  if (req.body.filmLink != undefined && req.body.personalRating != undefined) {
    rateManager.rateMovie(req.body.filmLink, req.body.personalRating);

    const id = statisticsGenerator.extractIdFromLinkIMDB(req.body.filmLink)

    res.render('success', {
      title: "Success",
      sssHead: "Done",
      sssMsg: "Movie added successfully!",
      id: id
    });
  }
});

router.post("/film/delete/:id", (req, res)=> {
  movieManager.removeMovie(req.params['id'])
  //res.send("<h1>Success!!!</h1><br><a href='/'><< Back</a>")
  res.render('success', {
      title: "Ok",
      sssHead: "Done",
      sssMsg: "Movie removed from database...",
      id: undefined
    });
});

module.exports = router;