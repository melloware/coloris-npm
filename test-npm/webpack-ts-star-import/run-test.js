// @ts-check

const path = require("path");
const { loadHtml, clean, spawnYarn, requireJsdom, requireChai, waitUntil } = require("../helper");

module.exports.main = async () => {
  await clean(__dirname);
  
  await spawnYarn(["install"], __dirname);
  await spawnYarn(["run", "build"], __dirname);
  
  const jsdom  = requireJsdom();
  const { expect } = requireChai();

  const { dom } = await loadHtml(jsdom, path.join(__dirname, "index.html"));

  await waitUntil(() => dom.window.document.getElementById("status")?.textContent === "done", 5000);

  const picker = dom.window.document.querySelector(".clr-picker");

  expect(picker).to.not.be.null;
};