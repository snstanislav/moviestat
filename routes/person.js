//modules
const express = require(process.env.NODE_PATH+'/express');
const personManager = require('../models/personManager.js');
const statisticsGenerator = require('../models/statisticsGenerator.js');
const dp = require('../data/dataProvider.js');

const router = express.Router();

router.get("/person/:id", (req, res)=> {
  if (dp.dbCache) {
    console.log("\nperson >> loaded from [dbCache] - %s\n", dp.dbCache.length);
    render(req, res, dp.dbCache);
  } else {
    dp.initGeneralUserMovieList((db)=> {
      render(req, res, db);
      console.log("\nperson >> extracted from database - %s\n", db.length);
    });
  }
});

function render(req, res, db) {
  let currPerson = personManager.getPerson(db,
    req.params['id']);
  if (currPerson) {
    res.render('person', {
      title: "Person's user statistics", personItem: currPerson, formatDT: statisticsGenerator.formatDT
    });
    console.log("Router: person's profile page loaded");
  } else {
    res.render('error', {
      title: "404 Page not found",
      errHead: "404 Person not found",
      errMsg: "This person does not exist in database",
      id: undefined
    });
  }
}

module.exports = router;