/**
* 02.04.2024
* 04.04.2024 modified
*/

const dbName = "moviestat";
const login = "snstanislav";

const { MongoClient } = require(process.env.NODE_PATH+'/mongodb');
const connectURI = process.env.MONGO_CONNECT;

class MongoDataProvider {
  constructor() {
    this.db = [];
  }

  isUniqueId(imdbId) {
    return !this.db.some(elem => elem.imdbId == imdbId);
  }

  insert(item, renderOk, renderErr) {
    if (item) {
      if (this.isUniqueId(item.imdbId)) {
        MongoClient.connect(connectURI).then(database => {
          console.log(`${this.constructor.name}: insertion`);
          let userColl = database.db(dbName).collection(login);
          userColl.insertOne(item)
          .then((result)=> {
            if (result.insertedId) {
              this.db.push(item);
              console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] inserted successfully.`);
              if (renderOk) {
                renderOk(); ////
                console.log(`${this.constructor.name}: rendered from insert()`);
              }
            }
            database.close();
          })
        }, console.error);
      } else {
        console.log(`${this.constructor.name}: [${item.imdbId} / ${item.commTitle}] already exists...`);
        if (renderErr) {
          renderErr(); ////
          console.log(`${this.constructor.name}: rendered from insert()`);
        }
      }
    }
  }

  update(item, render) {
    if (item) {
      MongoClient.connect(connectURI).then(database => {
        console.log(`${this.constructor.name}: updating`);
        let userColl = database.db(dbName).collection(login);
        userColl.updateOne({
          "imdbId": item.imdbId
        }, { $set: item })
        .then((result)=> {
          if (result.modifiedCount == 1) {
            console.log(`${this.constructor.name}: item updated successfully!`);
            if (render) {
              render(); ////
              console.log(`${this.constructor.name}: rendered from update()`);
            }
            database.close();
          }
        },
          console.error);
      });
    }
  }

  remove(imdbId, renderOk, renderErr) {
    let i = this.db.findIndex(elem => elem.imdbId == imdbId);
    if (i >= 0) {
      MongoClient.connect(connectURI).then(database => {
        console.log(`${this.constructor.name}: removing`);
        let userColl = database.db(dbName).collection(login);
        userColl.deleteOne({
          "imdbId": imdbId
        })
        .then((result)=> {
          if (result.deletedCount == 1) {
            this.db.splice(i, 1);
            console.log(`${this.constructor.name}: item removed successfully!`);
            if (renderOk) {
              renderOk(); ////
              console.log(`${this.constructor.name}: rendered from remove()`);
            }
          } else {
            console.error(`${this.constructor.name}: item removing failture...`);
            if (renderErr) {
              renderErr(); ////
              console.log(`${this.constructor.name}: rendered from remove()`);
            }
          }
          database.close();
        })
      }, console.error);
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
    MongoClient.connect(connectURI).then(database => {
      console.log(`${this.constructor.name}: init`);
      let userColl = database.db(dbName).collection(login);
      userColl.find().toArray()
      .then((result)=> {
        this.db = result;
        console.log(`${this.constructor.name}: data init success! Count - ${this.db.length}`);

        database.close();
        if (render) {
          render(this.db); ////
          this.size = this.db.length;
          console.log(`${this.constructor.name}: rendered from extractAll()`);
        }
      })
    }, console.error);
  }
}
module.exports.MongoDataProvider = MongoDataProvider;