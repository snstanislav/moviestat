/**
* 01.03.2024
*/

const fs = require('fs');
const path = require('path');

const userLogin = "snstanislav";
const DBpath = path.join(__dirname, "../../moviestat_db/users/", userLogin, "docs");
//const DBpath = path.join(__dirname, "/jsonDB/users/", userLogin, "docs");

class JSONDataProvider {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.db = [];

    let list = fs.readdirSync(DBpath);
    list.forEach(elem => {
      this.db.push(JSON.parse(fs.readFileSync(path.join(DBpath, elem)), "utf-8"));
    });
    this.size = this.db.length;

    console.log(`${this.constructor.name}: initialize 'db'. Current size - [${this.size}]`);
  }

  saveDB(item) {
    const savingPath = path.join(DBpath, item.imdbId+".json");
    fs.writeFile(savingPath, JSON.stringify(item, null, 2), err=> {
      if (err) {
        console.error(`${this.constructor.name}: DB save failure...`);
      } else {
        console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] saved successfully!`);
      }
    });
  }

  isUniqueId(imdbId) {
    return !this.db.some(elem => elem.imdbId == imdbId);
  }

  insert(item) {
    if (item) {
      let i = this.db.findIndex(elem => elem.imdbId == item.imdbId);
      if (i >= 0) {
        this.update(item);
        this.db[i] = item;
      } else {
        console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] insertion.`);
        this.db.push(item);
        this.saveDB(item);
      }
    }
  }

  update(item) {
    if (item) {
      let savedIds = fs.readdirSync(DBpath);
      if (savedIds.includes(item.imdbId+".json")) {
        console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] updation.`);
        this.saveDB(item);
      } else {
        console.error(`${this.constructor.name}: updating item [${item.imdbId} / ${item.commTitle}] not found...`);
      }
    }
  }

  remove(imdbId) {
    let i = this.db.findIndex(elem => elem.imdbId == imdbId);
    if (i >= 0) {
      const removingPath = path.join(DBpath, imdbId+".json");
      fs.unlink(removingPath, err=> {
        if (err) {
          console.log(`${this.constructor.name}: [${imdbId}] removing failure...`);
        } else {
          this.db.splice(i, 1);
          console.log(`${this.constructor.name}: [${imdbId}] removed successfully!`);
        }
      });
    } else {
      console.error(`${this.constructor.name}: removing item [${imdbId}] not found...`);
    }
  }

  extractOne(imdbId) {
    let i = this.db.findIndex(elem => elem.imdbId == imdbId);
    if (i >= 0) {
      console.log(`${this.constructor.name}: item [${imdbId}] found!`);
      return this.db[i];
    } else {
      console.error(`${this.constructor.name}: item [${imdbId}] not found...`);
      return {};
    }
  }

  extractAll() {
    return this.db;
  }

}

module.exports.JSONDataProvider = JSONDataProvider;