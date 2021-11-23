// @ts-check

const path = require("path");
const { loadHtml, removeDir, spawnNpm } = require("../helper");

module.exports.main = async () => {
  
  await removeDir(path.join(__dirname, "dist"));
  await removeDir(path.join(__dirname, "node_modules"));
  
  await spawnNpm(["install"], __dirname);
  await spawnNpm(["run", "build"], __dirname);
  
  const jsdom  = require("jsdom");
  const { expect } = require("chai");

  const { dom } = await loadHtml(jsdom, path.join(__dirname, "index.html"));
  const picker = dom.window.document.querySelector(".clr-picker");

  expect(picker).to.not.be.null;
};