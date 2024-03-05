/**
* 01.03.2024
*/

const fs = require('fs');

/*
{
    _id: db.length-i,
    imdbLink: elem.imdbLink,
    commTitle: elem.commTitle,
    origTitle: elem.origTitle,
    year: elem.year,
    duration: elem.duration,
    parental: elem.parental,
    type: elem.type,
    countriesOrig: elem.countriesOrig,
    plot: elem.plot,
    imdbRating: elem.imdbRating,
    imdbRatingNum: elem.imdbRatingNum,
    sPoster: elem.sPoster,
    genres: elem.genres,
    director: elem.director,
    cast: elem.cast,
    budget: elem.budget,
    grossWW: elem.grossWW,
    pRating: elem.pRating,
    pDateTime: elem.pDateTime
  }
*/

const DBpath = "./data/src/db.json";

class JSONDataProvider {
  constructor() {
    this.db = JSON.parse(
      fs.readFileSync(DBpath));
    this.size = this.db.length;
  }

  saveDB() {
    fs.writeFile(DBpath, JSON.stringify(this.db, null, 2), err=> {
      if(err) console.error(`${this.constructor.name}: Error: DB saving failure`);
    })
  }

  isUniqueId(_id) {
    return !this.db.some(elem => elem._id == _id);
  }

  generateId() {
    let newId = this.db.length+1;
    while (!this.isUniqueId(newId)) newId =+ 1;
    return newId;
  }

  insert(item) {
    item._id = generateId();
    this.db.unshift(item);
    console.log(`${this.constructor.name}: Inserted successfully ${item._id} ${item.commTitle}`);

    saveDB();
  }

  update(item) {
    let i = this.db.findIndex(elem => elem._id == item._id)
    if (i >= 0) {
      this.db[i] = item;
      console.log(`${this.constructor.name}: Updated successfully ${item._id} ${item.commTitle}`)
    } else {
      console.error(`${this.constructor.name}: Error: updating item is not
        correct`);
    }

    saveDB();
  }

  remove(_id) {
    let i = this.db.findIndex(elem => elem._id == _id);
    if (i >= 0) {
      this.db.splice(i, 1);
      console.log(`${this.constructor.name}: Removed successfully ${_id}`);
    } else {
      console.error(`${this.constructor.name}: Error: remove operation rejected`);
    }

    saveDB();
  }

  extractOne(_id) {
    let i = this.db.findIndex(elem => elem._id == _id);
    if (i >= 0) {
      console.log(`${this.constructor.name}: Item ${_id} found`);
      return this.db[i];
    } else {
      console.error(`${this.constructor.name}: Error: item not found`);
      return {};
    }
  }

  extractAll() {
    return this.db;
  }

}

module.exports.JSONDataProvider = JSONDataProvider;