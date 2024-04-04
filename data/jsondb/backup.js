const fs = require('fs')
const path = require('path')
const ds = require('../dataSource')

const newBackupPath = path.join(ds.userPath, "backup/moviestat-db-backup-" +
  getBackupDateTime() + ".json");

function getBackupDateTime() {
  const now = new Date();
  // mind auto format line break
  return `${now.getFullYear()}-${now.toLocaleString('en-us', { month: 'short' })}-${now.getDate()} ${now.getHours()}h${now.getMinutes()}m${now.getSeconds()}s`
}

(function createBackup() {
  console.log("processing backup...")
  fs.writeFileSync(newBackupPath, JSON.stringify(ds.loadAllFromUserDataDir(), null, 2));
})()