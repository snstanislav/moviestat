//modules
const express = require(process.env.NODE_PATH+'/express');
const rateManager = require('../models/rateManager.js');

const router = express.Router();

let sResultCache = []
let currSearchQuery = ""

router.get("/eval/", (req, res)=> {
  currSearchQuery = req.query.search;
  console.log("req.query.search >>"+req.query.search)
  if(currSearchQuery != "" && currSearchQuery != req.query.search) {
    sResultCache = [];
  }
  if (req.query.search != "") {

    if (sResultCache.length > 0) {
      res.render('eval', {
        title: "Search result", searchResultList: sResultCache
      });
      ///
      console.log("Eval. rendered from [cache]")
    } else {
      rateManager.performImdbSearch(req.query.search, (searchResultList)=> {
        sResultCache = searchResultList;
        res.render('eval', {
          title: "Search result", searchResultList: searchResultList
        });
      });
      ///
      console.log("Eval. rendered from /web/")
    }
  }
});

module.exports = router;