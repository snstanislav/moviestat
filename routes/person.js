//modules
const express = require(process.env.NODE_PATH+'/express');
const personManager = require('../models/personManager.js');
const statisticsGenerator = require('../models/statisticsGenerator.js');


const router = express.Router();

router.get("/person/:id", (req, res)=> {
  res.render('person', {
    title: "Person's user statistics", personItem: personManager.getPerson(req.params['id']), formatDT: statisticsGenerator.formatDT
  });
  console.log("Router: person's profile page loaded");
});

module.exports = router;