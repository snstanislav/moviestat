var express = require(process.env.NODE_PATH+'/express');
const fs = require('fs');
const dbJson = require('../data/jsonProvider.js');

const router = express.Router();

router.get("/", (req, res)=>{
  console.log("index page loaded")
  res.render('index', { title: 'Movie Stat', db: dbJson })
});

module.exports = router;
