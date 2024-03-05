const JSONDataProvider = require('./jsonDataProvider.js').JSONDataProvider;

const MovieEntry = require('../models/movieItem.js').MovieEntry;

const dbJson = new JSONDataProvider();
//console.log(dbJson.generateId())

module.exports.getGeneralUserMovieList = ()=> {
  return dbJson.extractAll();
}

module.exports.setUserMovieEval = (item)=> {
  if (item instanceof MovieEntry) {
    dbJson.insert(item);
  }
}

module.exports.updateUserMovieEval = (item)=> {
  if (item instanceof MovieEntry) {
    dbJson.update(item);
  }
}