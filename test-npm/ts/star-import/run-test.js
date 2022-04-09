// @ts-check

const path = require("path");
const { loadHtml, clean, spawnYarn, requireJsdom, requireChai, waitUntil } = require("../../helper");

module.exports.main = async () => {
  await clean(__dirname);
  
  await spawnYarn(["install"], __dirname);
  await spawnYarn(["run", "build"], __dirname);
};