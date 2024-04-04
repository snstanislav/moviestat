const moviesColl = require("../dataSource").loadAllFromUserDataDir();

const { MongoClient } = require(process.env.NODE_PATH+'/mongodb');
const rem = process.env.MONGO_CONNECT


MongoClient.connect(rem).then(db => {
  console.log('Client ready');
  let dbo = db.db("moviestat");
  let coll = dbo.collection("snstanislav")

  coll.deleteMany({})
  .then((result)=> {
    console.log(result)

    coll.insertMany(moviesColl)
    .then(result2 => {
      console.log("\nrestore - inserted: %s", result2.insertedCount)

      coll.count().then(result3 => {
        console.log("\ndatabase count: %s\n", result3)
        db.close()
      }); // count
    }); // insert
  }); // clear
}); //connect