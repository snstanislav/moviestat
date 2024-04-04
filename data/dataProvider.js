/**
* 01.03.2024
* modified 03.04.2024
*/

const MovieEntry = require('../models/movieItem.js').MovieEntry;

const JSONDataProvider = require('./jsonDB/jsonDataProvider.js').JSONDataProvider;
let dp = new JSONDataProvider();
/*
const MongoDataProvider = require('./mongo/mongoDataProvider.js').MongoDataProvider;
const dp = new MongoDataProvider();
*/
module.exports.dbCache;

module.exports.initGeneralUserMovieList = (render)=> {
  dp.extractAll(render);
}

module.exports.getGeneralSingleMovie = (id)=> {
  return dp.extractOne(id);
}

module.exports.setUserMovieEval = (item, renderOk, renderErr)=> {
  if (item instanceof MovieEntry) {
    dp.insert(item, renderOk, renderErr);
  }
}

module.exports.updateUserMovieEval = (item, render)=> {
  if (item instanceof MovieEntry) {
    dp.update(item, render);
  }
}

module.exports.removeUserMovieEval = (id, renderOk, renderErr)=> {
  dp.remove(id, renderOk, renderErr);
}