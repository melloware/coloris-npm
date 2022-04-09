// @ts-check

const path = require("path");
const { loadHtml, clean, spawnYarn, requireChai, requireJsdom } = require("../helper");

module.exports.main = async () => {
  await clean(__dirname);
  
  await spawnYarn(["install"], __dirname);
  
  const jsdom  = requireJsdom();
  const { expect } = requireChai();

  const { dom } = await loadHtml(jsdom, path.join(__dirname, "index.html"));
  const picker = dom.window.document.querySelector(".clr-picker");

  expect(picker).to.not.be.null;
};