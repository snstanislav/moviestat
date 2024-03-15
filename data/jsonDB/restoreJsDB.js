const fs = require('fs')
const path = require('path')

const userLogin = "snstanislav";
const backupSrcPath = path.join(__dirname,
  "../../../moviestat_db/src/db.json");
const userPath = path.join(__dirname, "../../../moviestat_db/users/" + userLogin);
const userDataPath = path.join(userPath, "docs1");

/**
* RESTORE BACKUP
*/

function generateUserDataDir() {
  fs.mkdir(userDataPath, {
    recursive: true
  }, err=> {
    if (err)
      console.error("mkdir db error...");
    else
      console.log("mkdir db success!");
  });
}

function restoreBackupToUserDataDir() {
  const backupDataList = JSON.parse(fs.readFileSync(backupSrcPath, "utf-8"));

  backupDataList.forEach(elem => {
    fs.writeFile(`${userDataPath}/${elem.imdbId}.json`, JSON.stringify(elem, null, 2),
      err=> {
        if (err) console.error("backup restore error...");
        else console.log("backup restore success!");
      });
  });
}

//restoreBackupToUserDataDir()