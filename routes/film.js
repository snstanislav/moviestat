//modules
const express = require(process.env.NODE_PATH+'/express');
const movieManager = require('../models/movieManager.js');

const router = express.Router();

router.get("/film/:id", (req, res)=> {
  console.log("param id "+req.params['id'])
  res.render('film', {
    title: "Film's user statistics", movieItem: movieManager.getMovie(req.params['id'])
  });
  console.log("Router: film profile page loaded");
});

/*router.update("/:id", (req, res)=> {
  res.render('film', {
    title: 'Movie Stat', movieItem:
    movieManager.getMovie(req.params['id']);
  });
  console.log("Router: film profile updated");
});*/

/*router.delete("/:id", (req, res)=> {
  res.render('film', {
    title: 'Movie Stat', movieItem:
    movieManager.getMovie(req.params['id']);
  });
  console.log("Router: film profile deleted");
});*/

module.exports = router;