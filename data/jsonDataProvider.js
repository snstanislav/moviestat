/**
* 01.03.2024
*/

const fs = require('fs');

const DBpath = "./data/src/db-test.json";

class JSONDataProvider {
  constructor() {
    this.db = JSON.parse(
      fs.readFileSync(DBpath));
    this.size = this.db.length;
  }

  async saveDB() {
    await fs.writeFile(DBpath, JSON.stringify(this.db, null, 2), err=> {
      if (err) console.error(`${this.constructor.name}: Error: DB saving
        failure\n`);
    });
  }

  isUniqueId(id) {
    return !this.db.some(elem => elem.imdbId == id);
  }

  async insert(item) {
    if (this.isUniqueId(item.imdbId)) {
      this.db.unshift(item);

      await this.saveDB();
      console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] inserted successfully\n`);
    } else {
      console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] already exists. Item will be updated\n`);

      this.update(item);
    }
  }

  async update(item) {
    let i = this.db.findIndex(elem => elem.imdbId == item.imdbId)
    if (i >= 0) {
      const firstEvalTime = this.db[i].pDateTime; //
      this.db[i] = item;
      this.db[i].pDateTime = firstEvalTime; //

      await this.saveDB();
      console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] updated successfully\n`)
    } else {
      console.error(`${this.constructor.name}: Error: updating item is not
        correct\n`);
    }
  }

  async remove(id) {
    let i = this.db.findIndex(elem => elem.imdbId == id);
    if (i >= 0) {
      this.db.splice(i, 1);

      await this.saveDB();
      console.log(`${this.constructor.name}: [${id}] removed successfully`);
    } else {
      console.error(`${this.constructor.name}: Error: remove operation
        rejected\n`);
    }
  }

  extractOne(id) {
    let i = this.db.findIndex(elem => elem.imdbId == id);
    if (i >= 0) {
      console.log(`${this.constructor.name}: Item [${id}] found\n`);
      return this.db[i];
    } else {
      console.error(`${this.constructor.name}: Error: item [${id}] not found\n`);
      return {};
    }
  }

  extractAll() {
    return this.db;
  }

}

module.exports.JSONDataProvider = JSONDataProvider;