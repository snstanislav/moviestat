const fs = require('fs')
const path = require('path')

const userLogin = "snstanislav";
const userPath = path.join(__dirname, "../../../moviestat_db/users/" + userLogin);
const userDataPath = path.join(userPath, "docs1");
const backupSrcPath = path.join(userPath, "backup/moviestat-db-backup-2024-Apr-4 12h0m17s.json");


function restoreBackupToUserDataDir() {
  fs.mkdir(userDataPath, {
    recursive: true
  }, err=> {
    if (err) console.error("mkdir db error...")
    else {
      console.log("mkdir db success!");

      const backupDataList = JSON.parse(fs.readFileSync(backupSrcPath, "utf-8"));

      console.log("processing restore...")
      backupDataList.forEach(elem => {
        fs.writeFile(`${userDataPath}/${elem.imdbId}.json`, JSON.stringify(elem, null, 2),
          err=> {
            if (err) console.error("backup restore error on - %s / %s", elem.commTitle, elem.imdbId)
          });
      });
    }
  });
}

restoreBackupToUserDataDir()