//modules
const express = require(process.env.NODE_PATH+'/express');
const rateManager = require('../models/rateManager.js');

const router = express.Router();

let searchResultCache = new Map();

router.get("/eval/", (req, res)=> {
  ///
  console.log("CACHED QUERIES :: ", searchResultCache.keys())

  if(searchResultCache.has(req.query.search)) {
    res.render('eval', {
      title: "Search result", searchResultList: searchResultCache.get(req.query.search)
    });
    ///
    console.log("Search result rendered from [cache]")
  } else {
    rateManager.performImdbSearch(req.query.search, (searchResultList)=> {
      searchResultCache.set(req.query.search, searchResultList);
      res.render('eval', {
        title: "Search result", searchResultList: searchResultList
      });
    });
    ///
    console.log("Search result rendered from /web/")
  }
});

module.exports = router;