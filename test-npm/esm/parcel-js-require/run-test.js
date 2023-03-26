// @ts-check

const path = require("path");
const { loadHtml, clean, spawnYarn, requireChai, requireJsdom, waitUntil } = require("../../harness/umd/helper.js");

module.exports.main = async () => {
  await clean(__dirname);
  
  await spawnYarn(["install"], __dirname);
  await spawnYarn(["run", "build", "--cache-dir", path.join(__dirname, ".parcel-cache")], __dirname);
  
  const jsdom  = requireJsdom();
  const { expect } = requireChai();

  const { dom } = await loadHtml(jsdom, path.join(__dirname, "index.html"));

  await waitUntil(() => dom.window.document.getElementById("status")?.textContent === "done", 5000);

  const picker = dom.window.document.querySelector(".clr-picker");
  const fields = dom.window.document.querySelector(".clr-field");

  expect(picker).to.not.be.null;
  expect(fields).to.not.eq(2);
};