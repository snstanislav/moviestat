const fs = require('fs')
const path = require('path')

const userLogin = "snstanislav";
const userPath = path.join(__dirname, "../../moviestat_db/users/" + userLogin);
const userDataPath = path.join(userPath, "docs");
module.exports.userPath = userPath;

function loadAllFromUserDataDir() {
  const db = [];
  // load all item names for user's db dir
  let list = fs.readdirSync(userDataPath);
  // load content from db to list
  list.forEach(elem => {
    db.push(JSON.parse(fs.readFileSync(path.join(userDataPath, elem))));
  })
  console.log("dataSource - result count: %s", db.length);
  return db.sort((a, b) => b.pRating-a.pRating);
}
module.exports.loadAllFromUserDataDir = loadAllFromUserDataDir;