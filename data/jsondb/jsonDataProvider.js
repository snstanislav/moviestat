/**
* 01.03.2024
* 04.04.2024 modified
*/

const fs = require('fs');
const path = require('path');

const userLogin = "snstanislav";
const DBpath = path.join(__dirname, "../../../moviestat_db/users/", userLogin, "docs");

class JSONDataProvider {
  constructor() {
    this.db = [];
  }

  saveDB(item, render) {
    const savingPath = path.join(DBpath, item.imdbId+".json");
    fs.writeFile(savingPath, JSON.stringify(item, null, 2), err=> {
      if (err) {
        console.error(`${this.constructor.name}: DB save failure...`);
      } else {
        console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] saved successfully!`);
        if (render) {
          render(); ////
          console.log(`${this.constructor.name}: rendered from saveDB()`);
        }
      }
    });
  }

  isUniqueId(imdbId) {
    return !this.db.some(elem => elem.imdbId == imdbId);
  }

  insert(item, renderOk, renderErr) {
    if (item) {
      if (this.isUniqueId(item.imdbId)) {
        console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] insertion`);
        this.db.push(item);
        this.saveDB(item, renderOk); ///
      } else {
        console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] already exists...`);
        renderErr(); ////
      }
    }
  }

  update(item, render) {
    if (item) {
      fs.readdir(DBpath, (err, savedIds)=> {
        if (err)
          console.error(`${this.constructor.name}: data dir access error in update()...`);
        if (savedIds.includes(item.imdbId+".json")) {
          console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] updating`);
          this.saveDB(item, render); ///
        } else {
          console.error(`${this.constructor.name}: updating item [${item.imdbId} / ${item.commTitle}] not found...`);
        }
      });
    }
  }

  remove(imdbId, renderOk, renderErr) {
    let i = this.db.findIndex(elem => elem.imdbId == imdbId);
    if (i >= 0) {
      const removingPath = path.join(DBpath, imdbId+".json");
      fs.unlink(removingPath, err => {
        if (err) {
          console.log(`${this.constructor.name}: [${imdbId}] removing failure...`);
          if (renderErr) {
            renderErr(); ////
            console.log(`${this.constructor.name}: rendered from remove()`);
          }
        } else {
          this.db.splice(i, 1);
          console.log(`${this.constructor.name}: [${imdbId}] removed successfully!`);
          if (renderOk) {
            renderOk(); ////
            console.log(`${this.constructor.name}: rendered from remove()`);
          }
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

  extractAll(render) {
    fs.readdir(DBpath, (err, list) => {
      if (err)
        console.error(`${this.constructor.name}: data dir access error in extractAll()...`);
      list.forEach(elem => {
        this.db.push(JSON.parse(fs.readFileSync(path.join(DBpath, elem)), "utf-8"));
      });
      if (render) {
        render(this.db); ////
        this.size = this.db.length;
        console.log(`${this.constructor.name}: rendered from extractAll()`);
      }
    });
  }
}
module.exports.JSONDataProvider = JSONDataProvider;