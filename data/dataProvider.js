const JSONDataProvider = require('./jsonDataProvider.js').JSONDataProvider;

const MovieEntry = require('../models/movieItem.js').MovieEntry;

const dbJson = new JSONDataProvider();
//console.log(dbJson.generateId())

module.exports.getGeneralUserMovieList = ()=> {
  return dbJson.extractAll();
}

module.exports.setUserMovieEval = async (item)=> {
  if (item instanceof MovieEntry) {
    await dbJson.insert(item);
  }
}

module.exports.updateUserMovieEval = async (item)=> {
  if (item instanceof MovieEntry) {
    await dbJson.update(item);
  }
}