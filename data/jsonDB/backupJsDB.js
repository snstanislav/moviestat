const fs = require('fs')
const path = require('path')

const userLogin = "snstanislav";
const userPath = path.join(__dirname, "../../../moviestat_db/users/" + userLogin);
const userDataPath = path.join(userPath, "docs");
const newBackupPath = path.join(userPath, "backup/moviestat-db-backup-" +
getBackupDateTime() + ".json");

/**
* CREATE NEW BACKUP
*/
function loadAllFromUserDataDir() {
  const db = [];
  // load all item names for user's db dir
  let list = fs.readdirSync(userDataPath);
  // load content from db to list
  list.forEach(elem => {
    db.push(JSON.parse(fs.readFileSync(path.join(userDataPath, elem))));
  })
  console.log(db.length);
  return db.sort((a,b) => b.pRating-a.pRating);
}

function createBackup() {
  fs.writeFileSync(newBackupPath, JSON.stringify(loadAllFromUserDataDir(),null,2));
}

function getBackupDateTime() {
  const now = new Date();
  // mind auto format line break
  return `${now.getFullYear()}-${now.toLocaleString('en-us',{month:'short'})}-${now.getDate()} ${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}s`
}

createBackup()